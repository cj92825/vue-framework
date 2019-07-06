import request from '@/utils/request'

export function queryPermissionsGroup () {
  return request({
    url: '/sys/permissionsGroup',
    method: 'get'
  })
}

export function queryPermissions (data) {
  return request({
    url: '/sys/permissions',
    method: 'get',
    params: data
  })
}

export function editPermission (data) {
  return request({
    url: '/sys/editPermission',
    method: 'post',
    data
  })
}

export function deletePermission (data) {
  return request({
    url: '/sys/deletePermission',
    method: 'post',
    data
  })
}
