<!--  -->
<template>
  <div class="app-container">
    <el-button @click="addUser" type="primary">新增</el-button>
    <el-table
      :data="userList"
      v-loading.body="listLoading"
      max-height="650px"
      border
      fit
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      highlight-current-row
      style="width: 100%;margin-top:10px"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="手机号">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="帐号" min-width="120" prop="account"></el-table-column>
      <el-table-column label="姓名" min-width="80" prop="username"></el-table-column>
      <el-table-column label="备注" min-width="120" prop="remark"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100px">
        <template slot-scope="scope">
          <el-button @click="grantRole(scope.row)" type="primary" size="small">分配角色</el-button>
          <el-button @click="editUser(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
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
        <el-form-item label="帐号" prop="account" style="width:47%">
          <el-input v-model.trim="form.account" placeholder="请输入帐号名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username" style="width:47%">
          <el-input v-model.trim="form.username" placeholder="请输入姓名"></el-input>
        </el-form-item>
         <el-form-item label="手机号" prop="phone" style="width:47%">
          <el-input v-model.trim="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width:47%">
          <el-input v-model.trim="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item v-if="title == '编辑'">
          <el-button type="primary" @click="()=>saveOrUpdateUser()">更新</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
        <el-form-item v-if="title == '新增'">
          <el-button type="primary" @click="()=>saveOrUpdateUser()">保存</el-button>
          <el-button @click="()=>cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="分配当前角色权限" :visible.sync="userDialogVisible" center>
      <grant-role :userId="currentUserId" :userName="currentUserName"></grant-role>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, editUser, deleteUser } from '@/api/sys/user'
import grantRole from './componment/grantRole'
export default {
  components: {
    grantRole
  },
  data () {
    return {
      userList: [],
      listLoading: false,
      detailLoading: false,
      editDialogVisible: false,
      userDialogVisible: false,
      title: '',
      formModel: {
        account: undefined,
        username: undefined,
        password: undefined,
        phone:undefined,
        email:undefined,
        remark:undefined
      },
      form: {},
      currentUserId: undefined,
      currentUserName: undefined
    }
  },
  created () {
    this.loadUsers()
    this.resetForm()
  },
  watch: {

  },
  methods: {
    loadUsers () {
      let page = {
        currentPage: 1,
        size: 100
      }
      this.listLoading = true
      getUsers(page).then(res => {
        let data = res.data.data.records
        this.userList = data
        this.listLoading = false
      }).catch()
    },
    resetForm () {
      this.form = JSON.parse(JSON.stringify(this.formModel))
    },
    addUser () {
      this.editDialogVisible = true
      this.title = '新增'
    },
    editUser (row) {
      this.editDialogVisible = true
      this.title = '编辑'
      this.form = JSON.parse(JSON.stringify(row))
    },
    saveOrUpdateUser () {
      this.detailLoading = true
      editUser(this.form).then(res => {
        this.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })
        this.detailLoading = false
        this.editDialogVisible = false
        this.loadUsers()
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
    deleteUser (row) {
      this.listLoading = true
      deleteUser(row.id).then(res => {
        let { data } = res.data
        if (data) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.loadUsers()
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
    grantRole (row) {
      this.userDialogVisible = true
      this.$nextTick(() => {
        this.currentUserId = row.id
        this.currentUserName = row.username
      })
    }
  }
}
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
