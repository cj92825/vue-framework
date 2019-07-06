<!--  -->
<template>
  <div class="app-container">
    <el-row style="width:100%;">
      <el-col :span="7">
        <el-card shadow="hover">
          <div slot="header">
            <el-input v-model="filterText" placeholder="输入关键字过滤"></el-input>
          </div>
          <el-scrollbar>
            <el-tree
              style="height:620px;"
              :data="treeData"
              @node-click="handleNodeClick"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              v-loading.body="loading"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-tooltip content="新增">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-plus"
                      @click.stop="handlerTreeAdd(data)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-edit-outline"
                      @click.stop="handlerTreeEdit(data)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip v-if="data.parentId != 0" content="删除">
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      @click.stop="handlerTreeDelete(data)"
                    ></el-button>
                  </el-tooltip>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card shadow="hover">
          <el-button @click="addPermission()" type="primary" size="small">新增</el-button>
          <el-table
            :data="filterPermissionData"
            v-loading.body="listLoading"
            max-height="650px"
            border
            fit
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            highlight-current-row
            style="width: 100%;margin-top:10px"
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="请求地址" min-width="120" prop="uri"></el-table-column>
            <el-table-column label="资源名" min-width="80" prop="name"></el-table-column>
            <el-table-column label="描述" min-width="120" prop="description"></el-table-column>

            <el-table-column align="center" label="操作" fixed="right" min-width="100px">
              <template slot-scope="scope">
                <el-button @click="editPermission(scope.row)" type="primary" size="small">编辑</el-button>
                <el-button @click="deletePermission(scope.row)" type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="editDialogVisible"
      center
      width="40%"
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="80px" v-loading.body="detailLoading">
        <el-form-item label="资源名" prop="name" style="width:47%">
          <el-input v-model.trim="form.name" placeholder="请输入资源名"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" prop="uri">
          <el-input v-model.trim="form.uri" placeholder="请输入请求地址"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item v-if="title == '编辑'">
          <el-button type="primary" @click="()=>saveOrUpdatePermission()">更新</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
        <el-form-item v-if="title == '新增'">
          <el-button type="primary" @click="()=>saveOrUpdatePermission()">保存</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryPermissionsGroup, queryPermissions, editPermission, deletePermission } from '@/api/sys/permission'
export default {
  data () {
    return {
      filterText: '',
      treeData: [],
      permissionData: [],
      filterPermissionData: [],
      loading: false,
      listLoading: false,
      detailLoading: false,
      editDialogVisible: false,
      title: '',
      currentGroupId: 1,
      formModel: {
        description: undefined,
        name: undefined,
        uri: undefined
      },
      form:{}
    }
  },
  created () {
    this.getGroup()
    this.getPermissionData()
    this.resetForm()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getGroup () {
      this.loading = true
      queryPermissionsGroup().then(res => {
        let data = res.data.data
        this.formatTree(data)
        this.loading = false
      }).catch()
    },
    getPermissionData () {
      let page = {
        currentPage: 1,
        size: 100
      }
      this.listLoading = true
      queryPermissions(page).then(res => {
        let data = res.data.data.records
        this.permissionData = data
        this.filterTableData()
        this.listLoading = false
      }).catch()
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    formatTree (data) {
      // data.forEach(node=>{
      //     if(node.parentId==0){
      //         dataTree.push(node)
      //     }
      //     data.forEach(item=>{
      //         if(item.parentId==node.id){
      //             if(!node.children){
      //                 node.children=[]
      //             }
      //             node.children.push(item)
      //         }
      //     })
      // })
      //如果是根就不用循环了，比上面个方法每一个根少一轮循环,时间n*(n-1)
      data.forEach(node => {
        if (node.parentId == 0) {
          this.treeData.push(node)
        } else {
          data.forEach(item => {
            if (item.id == node.parentId) {
              if (!item.children) {
                item.children = []
              }
              item.children.push(node)
            }
          })
        }
      })
    },
    handleNodeClick (data) {
      this.currentGroupId = data.id
      this.filterTableData()
    },
    filterTableData(){
      this.filterPermissionData = this.permissionData.filter(item => {
        return this.currentGroupId == 1 || item.groupId == this.currentGroupId
      })
    },
    addPermission () {
      this.editDialogVisible = true
      this.title = '新增'
      this.form.groupId = this.currentGroupId

    },
    editPermission (row) {
      this.editDialogVisible = true
      this.title = '编辑'
      this.form=JSON.parse(JSON.stringify(row))
      console.log(JSON.stringify(this.form))
      this.form.groupId = this.currentGroupId

    },
    saveOrUpdatePermission () {
      this.detailLoading = true
      editPermission(this.form).then(res => {
        let { data } = res.data
        if (data) {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
          this.detailLoading = false
          this.editDialogVisible = false
          this.getPermissionData()
        } else {
          this.$notify({
            title: '失败',
            message: '编辑失败',
            type: 'error',
            //duration: 2000 
          })
        }

      })
    },
    cancel(){
      this.editDialogVisible=false
    },
    resetForm () {
      this.form=JSON.parse(JSON.stringify(this.formModel))
    },
    deletePermission (row) {
      this.listLoading=true
      deletePermission(row.id).then(res => {
        let { data } = res.data
        if (data) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading=false
          this.getPermissionData()
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            //duration: 2000 
          })
        }
      })
    },
    handlerTreeAdd (data) {
    },
    handlerTreeEdit (data) {

    },
    handlerTreeDelete (data) {

    }
  }
}
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 8px;
}
</style>
