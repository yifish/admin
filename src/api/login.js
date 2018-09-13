import request from '@/utils/request'

export function adminLogin(loginName, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      loginName,
      password
    }
  })
}

export function getAdminInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function adminLogout(token) {
  return request({
    url: '/admin/logout',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
