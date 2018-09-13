import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param menu
 * @param route
 */
function hasPermission(menu, route) {
  if (route.meta && route.meta.roles) {
    return menu.indexOf(route.meta.roles) >= 0
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param menu
 */
function filterAsyncRouter(asyncRouterMap, menu) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menu, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menu)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      // state.routers = constantRouterMap.concat(routers)
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menu } = data
        // console.log(menu)
        // console.log(constantRouterMap)
        // let accessedRouters
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menu)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
