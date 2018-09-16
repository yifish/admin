/* eslint-disable prefer-promise-reject-errors */
import { adminLogin, logout, getAdminInfo, adminLogout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import avatar from '@/assets/images/admin_portrait.gif'

const admin = {
  state: {
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: avatar,
    introduction: '',
    menu: [],
    competence: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    SET_COMPETENCE: (state, competence) => {
      state.competence = competence
    }
  },

  actions: {
    // 后台登录
    AdminLogin({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim()
      return new Promise((resolve, reject) => {
        adminLogin(loginName, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetAdminInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getAdminInfo(state.token).then(response => {
          const data = response.data
          if (data.menu && data.menu.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_MENU', data.menu)
            commit('SET_COMPETENCE', data.competence)
          } else {
            reject('GetAdminInfo: menu must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 后端登出
    AdminLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        adminLogout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_MENU', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_MENU', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default admin
