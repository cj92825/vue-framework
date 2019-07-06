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
              :props="defaultProps"
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
                <span>
                  <svg-icon v-if="data.children" icon-class="文件夹"></svg-icon>
                  <svg-icon v-else icon-class="文档"></svg-icon>
                  <span>{{ node.label }}</span>
                </span>
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
                  <el-tooltip v-if="data.parentId>=0" content="删除">
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
          <div slot="header" class="clearfix">
            <span>{{formTitleMap[formStatus]}}</span>
          </div>
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            v-loading.body="detailLoading"
            :disabled="formStatus=='detail'"
          >
            <el-form-item label="菜单标题" prop="name" style="width:47%">
              <el-input v-model.trim="form.name" placeholder="请输入菜单标题"></el-input>
            </el-form-item>
            <el-form-item label="路由路径" prop="path">
              <el-input v-model.trim="form.path" placeholder="请输入路由路径"></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="component">
              <el-input v-model.trim="form.component" placeholder="请输入组件路径"></el-input>
            </el-form-item>
            <el-form-item label="跳转路径" prop="redirect">
              <el-input v-model.trim="form.redirect" placeholder="请输入跳转路径"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="()=>update()">更新</el-button>
              <el-button @click="()=>cancel(true)">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="()=>create()">保存</el-button>
              <el-button @click="()=>cancel(true)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMenus, editMenu, deleteMenu } from '@/api/sys/menu'
export default {
  data () {
    return {
      filterText: '',
      treeData: [],
      loading: false,
      listLoading: false,
      title: '详情',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form:{
        name: undefined,
        path: undefined,
        component: undefined,
        redirect: undefined
      },
      detailLoading: false,
      formStatus: 'detail',
      formTitleMap: {
        detail: '详情',
        create: '新增',
        update: '编辑'
      },
    }
  },
  created () {
    this.getMenus()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {

    getMenus () {
      this.loading = true
      getMenus().then(res => {
        let { data } = res.data
        this.formatTree(data)
        this.loading = false
      })
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    formatTree (data) {
      let branch = {
        id: -1,
        name: '所有菜单',
        children: []
      }
      data.forEach(node => {
        if (node.parentId == 0) {
          branch.children.push(node)
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
      this.treeData=[]
      this.treeData.push(branch)
    },
    handleNodeClick (data) {
      Object.assign(this.form, data)
      this.formStatus = 'detail'
    },
    handlerTreeAdd (data) {
      this.resetForm()
      this.form.parentId = Math.max(0,data.id)
      this.formStatus = 'create'
    },
    handlerTreeEdit (data) {
      Object.assign(this.form, data)
      this.formStatus = 'update'
    },
    handlerTreeDelete (data) {
      //将子菜单也删除,递归获取id
      let idList = []
      this.getMenuIds(data, idList)
      console.log(JSON.stringify(idList))
      const tip =
        data.children
          ? '此操作将永久删除当前目录以及所有子菜单, 是否继续?'
          : '此操作将永久删除当前菜单, 是否继续?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(idList).then(res => {
          let {data}=res.data
          if (data) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.cancel(true)
            this.getMenus()
          } else{
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              //duration: 2000 
            })
          }
        })
      }).catch(() => {
        this.$notify.info({
          title: '消息',
          message: '已取消删除'
        });
      });
    },
    getMenuIds (data, idList) {
      idList.push(data.id)
      if (data.children) {
        data.children.forEach(item => {
          this.getMenuIds(item, idList)
        })

      }
    },
    update () {
      this.editMenu(this.form)
    },
    create () {
      this.editMenu(this.form)
    },
    editMenu (form) {
      this.detailLoading = true
      editMenu(form).then(res => {
        let { data } = res.data
        this.detailLoading = false
        if (data) {
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
          this.cancel(true)
          this.getMenus()
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
    cancel (reset) {
      this.formStatus = 'detail'
      if (reset) {
        this.resetForm()
      }
    },
    resetForm () {
      this.$refs.form.resetFields()
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
