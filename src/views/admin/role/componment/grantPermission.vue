<!--  -->
<template>
  <div class="app-container">
    <el-row style="width:100%;">
      <el-col :span="7">
        <el-card shadow="hover">
          <div slot="header">
            <span>
              当前选择角色：
              <label>{{roleName}}</label>
            </span>
          </div>
          <el-scrollbar>
            <el-tree
              style="height:320px;"
              :data="treeData"
              @node-click="handleNodeClick"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              v-loading.body="loading"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card shadow="hover">
          <div slot="header">
            <el-button @click="grantPermission" type="primary">保存</el-button>
          </div>
          <el-table
            ref="table"
            :data="filterPermissionData"
            v-loading="listLoading"
            max-height="650px"
            border
            fit
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            highlight-current-row
            style="width: 100%;"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="请求地址" min-width="120" prop="uri"></el-table-column>
            <el-table-column label="资源名" min-width="80" prop="name"></el-table-column>
            <el-table-column label="描述" min-width="120" prop="description"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryPermissionsGroup, queryPermissions } from '@/api/sys/permission'
import { getPermissionByRoleId, grantPermissions } from '@/api/sys/role'
export default {
  data () {
    return {
      treeData: [],
      permissionData: [],
      filterPermissionData: [],
      loading: false,
      waitPermissionData: false,
      waitRolePermission: false,
      waitGrant:false,
      currentGroupId: 1,
      existPermission: [],
      selectedPermission: [],
    }
  },
  created () {
    this.getGroup()
    this.getPermissionData()
  },
  computed: {
    listLoading () {
      return this.waitPermissionData || this.waitRolePermission||this.waitGrant
    }
  },
  props: {
    roleId: Number,
    roleName: String
  },
  watch: {
    roleId (newVal, oldVal) {
      if (newVal) {
        this.currentGroupId = 1
        this.loadPermissionByRoleId()
      }
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
      this.waitPermissionData = true
      queryPermissions(page).then(res => {
        let data = res.data.data.records
        this.permissionData = data
        this.waitPermissionData = false
        this.filterTableData()
      }).catch()
    },
    formatTree (data) {
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
    filterTableData () {
      this.filterPermissionData = this.permissionData.filter(item => {
        return this.currentGroupId == 1 || item.groupId == this.currentGroupId
      })
      this.authoritiedFunc()
    },
    loadPermissionByRoleId () {
      this.waitRolePermission = true
      getPermissionByRoleId(this.roleId).then(res => {
        let { data } = res.data
        this.existPermission = data
        this.waitRolePermission = false
        this.authoritiedFunc()
      })
    },
    authoritiedFunc () {
      if (!this.waitRolePermission && !this.waitPermissionData) {
        this.$nextTick(() => {
          let authoritied = []
          this.toggleSelection(authoritied)
          this.filterPermissionData.forEach(row => {
            let exist = this.existPermission.some(item => {
              return item.permissionId == row.id
            })
            if (exist) {
              authoritied.push(row)
            }
          })
          this.toggleSelection(authoritied)
        })
      }
    },
    toggleSelection (rows) {
      if (rows && rows.length) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    selectionChange (val) {
      this.selectedPermission = JSON.parse(JSON.stringify(val))
    },
    grantPermission () {
      let addPermission = []
      let deletePermission = []
      //本来是想前段直接传列表后端处理的，但是后端没有分组这个概念，统一来搞不好处理。所以还是前段来判断哪些该删除新增
      //如果是existPermission中有但是selectedPermission中没有的将deleted置为1
      //如果两个list都有的不处理
      //如果是selectedPermission中有但是existPermission中没有则新增
      let hadMap = {}
      this.existPermission.forEach(it => {
        hadMap[it.permissionId] = 1
      })
      let selectedMap = {}
      this.selectedPermission.forEach(it => {
        selectedMap[it.id] = 1
        if (!hadMap[it.id]) {
          addPermission.push(it.id)
        }
      })
      this.existPermission.forEach(it => {
        if (!selectedMap[it.permissionId]) {
          deletePermission.push(it.id)
        }
      })
      this.waitGrant = true
      grantPermissions(this.roleId, addPermission, deletePermission).then(res => {
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        this.waitGrant =false
        this.loadPermissionByRoleId()
      }).catch(err => {
        this.$notify({
          title: '失败',
          message: '授权成功',
          type: 'error',
          //duration: 2000 
        })
        this.listLoading = false
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
