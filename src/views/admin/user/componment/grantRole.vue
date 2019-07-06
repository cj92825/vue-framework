<!--  -->
<template>
  <div class="app-container">
    <el-row style="width:100%;">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header">
            <span>
              当前选择用户：
              <label>{{userName}}</label>
            </span>
          </div>
          <el-table
            ref="table"
            :data="roleData"
            v-loading="listLoading"
            max-height="650px"
            border
            fit
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="角色名" min-width="120" prop="name"></el-table-column>
            <el-table-column label="备注" min-width="80" prop="remark"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="100px">
              <template slot-scope="scope">
                <el-button
                  @click="grantRole(scope.row)"
                  type="primary"
                  v-if="!scope.row.grant"
                  size="small"
                >授权</el-button>
                <el-button
                  @click="revokeRole(scope.row)"
                  type="warning"
                  v-else
                  size="small"
                >回收</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoles } from '@/api/sys/role'
import { getRoleByUserId, grantRole,revokeRole } from '@/api/sys/user'
export default {
  data () {
    return {
      roleData: [],
      loading: false,
      waitRoleData: false,
      waitUserRole: false,
      waitGrant:false,
      existRole: [],
      selectedRole: [],
    }
  },
  created () {
    this.getRoleData()
  },
  computed:{
    listLoading(){
      return this.waitRoleData||this.waitUserRole||this.waitGrant
    }
  },
  props: {
    userId: Number,
    userName: String
  },
  watch: {
    userId (newVal, oldVal) {
      if (newVal) {
        this.loadRoleByUserId()
      }
    }
  },
  methods: {
    getRoleData () {
      let page = {
        currentPage: 1,
        size: 100
      }
      this.waitRoleData = true
      getRoles(page).then(res => {
        let data = res.data.data.records
        this.roleData = data
        this.waitRoleData = false
        this.handleExistRole()
      }).catch()
    },
    loadRoleByUserId () {
      this.waitUserRole = true
      getRoleByUserId(this.userId).then(res => {
        let { data } = res.data
        this.existRole = data
        this.waitUserRole = false
        this.handleExistRole()
      })
    },
    handleExistRole () {
      if (!this.waitRoleData&&!this.waitUserRole) {
        this.roleData.forEach(it => {
          it.grant = false
          let exist = this.existRole.some(item => {
            return it.id == item.roleId
          })
          if (exist) {
            it.grant = true
          }
        })
      }
    },
    grantRole(row){
      let userRole={
        userId:this.userId,
        roleId:row.id
      }
      this.waitGrant=true
      grantRole(userRole).then(res=>{
        let {data}=res.data
        if(data){
          this.loadRoleByUserId()
          this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        }else{
          this.$notify({
          title: '失败',
          message: '授权失败',
          type: 'success'
          })
        }
        this.waitGrant=false
      })

    },
    revokeRole(row){
      
      let userRole=this.existRole.find(item=>{
        return item.roleId==row.id
      })
      this.waitGrant=true
      revokeRole(userRole).then(res=>{
        let {data}=res.data
        if(data){
          row.grant=false
          this.$notify({
          title: '成功',
          message: '回收成功',
          type: 'success',
          duration: 2000
        })
        }else{
          this.$notify({
          title: '失败',
          message: '回收失败',
          type: 'success'
          })
        }
        this.waitGrant=false
      })
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
