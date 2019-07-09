import request from '@/utils/request'

export function getInfo () {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function getUsers (data) {
  return request({
    url: '/sys/users',
    method: 'get',
    params: data
  })
}

export function editUser (data) {
  return request({
    url: '/sys/editUser',
    method: 'post',
    data
  })
}

export function deleteUser (data) {
  return request({
    url: '/sys/deleteUser',
    method: 'post',
    data
  })
}

export function getRoleByUserId (data) {
  return request({
    url: '/sys/getRolesByUserId',
    method: 'get',
    params: {
      userId: data
    }
  })
}

export function grantRole (data) {
  return request({
    url: '/sys/grantRole',
    method: 'post',
    data
  })
}

export function revokeRole (data) {
  return request({
    url: '/sys/revokeRole',
    method: 'post',
    data
  })
}
