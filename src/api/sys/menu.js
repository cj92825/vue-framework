import request from '@/utils/request'

/**
 * 获取所有菜单
 */
export function getMenus () {
  return request({
    url: '/sys/menus',
    method: 'get'
  })
}

/**
 * 更新或新增菜单
 */
export function editMenu (data) {
  return request({
    url: '/sys/editMenu',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export function deleteMenu (data) {
  return request({
    url: '/sys/deleteMenu',
    method: 'post',
    data
  })
}
