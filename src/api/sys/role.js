import request from '@/utils/request'

/**
 * 获取所有角色
 */
export function getRoles (data) {
  return request({
    url: '/sys/roles',
    method: 'get',
    params: data
  })
}

export function editRole (data) {
  return request({
    url: '/sys/editRole',
    method: 'post',
    data
  })
}

export function deleteRole (data) {
  return request({
    url: '/sys/deleteRole',
    method: 'post',
    data
  })
}

export function getPermissionByRoleId (data) {
  return request({
    url: '/sys/getPermissionByRoleId',
    method: 'get',
    params: {
      roleId: data
    }
  })
}

export function grantPermissions (roleId, addIds, deleteIds) {
  return request({
    url: '/sys/grantPermissions',
    method: 'post',
    data: {
      roleId: roleId,
      addPermissionIds: addIds,
      deletePermissionIds: deleteIds
    }
  })
}
