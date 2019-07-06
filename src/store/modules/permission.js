import { constantRoutes } from '@/router'
import { getMenus } from '@/api/sys/menu'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function formatAsyncRoutes (list) {
  const res = []
  list.forEach(node => {
    const temp = {}
    temp.meta = {
      title: node.name,
      icon: 'table'
    }
    if (node.component !== 'Layout') {
      const value = node.component
      temp.component = () => import(`@/views/${value}`)
    } else {
      temp.component = Layout
    }

    Object.assign(node, temp)
    if (node.parentId === 0) {
      res.push(node)
    } else {
      list.forEach(item => {
        if (item.id === node.parentId) {
          if (!item.children) {
            item.children = []
          }
          item.children.push(node)
        }
      })
    }
  })
  res.push({ path: '*', redirect: '/404', hidden: true })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      getMenus().then(res => {
        const { data } = res.data
        accessedRoutes = formatAsyncRoutes(data)
        console.log(JSON.stringify(accessedRoutes))
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
      // if (roles.includes('ADMIN')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
