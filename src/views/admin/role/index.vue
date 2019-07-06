<!--  -->
<template>
  <div class="app-container">
    <el-button @click="addRole" type="primary">新增</el-button>
    <el-table
      :data="roleList"
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
      <el-table-column label="角色名" min-width="120" prop="name"></el-table-column>
      <el-table-column label="备注" min-width="80" prop="remark"></el-table-column>

      <el-table-column align="center" label="操作" fixed="right" min-width="100px">
        <template slot-scope="scope">
          <el-button @click="grantPermission(scope.row)" type="primary" size="small">分配权限</el-button>
          <el-button @click="editRole(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRole(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="editDialogVisible"
      center
      width="40%"
      @close="resetForm"
    >
      <el-form ref="form" :model="form" label-width="80px" v-loading.body="detailLoading">
        <el-form-item label="角色名" prop="name" style="width:47%">
          <el-input v-model.trim="form.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item v-if="title == '编辑'">
          <el-button type="primary" @click="()=>saveOrUpdateRole()">更新</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
        <el-form-item v-if="title == '新增'">
          <el-button type="primary" @click="()=>saveOrUpdateRole()">保存</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="分配当前角色权限" :visible.sync="permissionDialogVisible" center>
      <grant-permission :roleId="currentRoleId" :roleName="currentRoleName"></grant-permission>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, editRole, deleteRole } from '@/api/sys/role'
import grantPermission from './componment/grantPermission'
export default {
  components: {
    grantPermission
  },
  data () {
    return {
      roleList: [],
      listLoading: false,
      detailLoading: false,
      editDialogVisible: false,
      permissionDialogVisible: false,
      title: '',
      formModel: {
        name: undefined,
        remark: undefined
      },
      form: {},
      currentRoleId: undefined,
      currentRoleName: undefined
    }
  },
  created () {
    this.loadRoles()
    this.resetForm()
  },
  watch: {

  },
  methods: {
    loadRoles () {
      let page = {
        currentPage: 1,
        size: 100
      }
      this.listLoading = true
      getRoles(page).then(res => {
        let data = res.data.data.records
        this.roleList = data
        this.listLoading = false
      }).catch()
    },
    resetForm () {
      this.form = JSON.parse(JSON.stringify(this.formModel))
    },
    addRole () {
      this.editDialogVisible = true
      this.title = '新增'
    },
    editRole (row) {
      this.editDialogVisible = true
      this.title = '编辑'
      this.form = JSON.parse(JSON.stringify(row))
    },
    saveOrUpdateRole () {
      this.detailLoading = true
      editRole(this.form).then(res => {
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
        this.detailLoading = false
        this.editDialogVisible = false
        this.loadRoles()
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '编辑失败',
          type: 'error',
          //duration: 2000 
        })
        this.detailLoading = false
      })
    },
    deleteRole (row) {
      this.listLoading = true
      deleteRole(row.id).then(res => {
        let { data } = res.data
        if (data) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.loadRoles()
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
    cancel () {
      this.editDialogVisible = false
    },
    grantPermission (row) {
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        this.currentRoleId = row.id
        this.currentRoleName = row.name
      })
    }
  }
}
</script>
<style scoped>
</style>
