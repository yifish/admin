import request from '@/utils/request'
// 总后台登录
export function adminLogin(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
// 总后台获取详情
export function adminInfo() {
  return request({
    url: '/admin/info',
    method: 'post'
  })
}
// 总后台退出登录
export function adminLogout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
// 管理员列表
export function getAdminList(post) {
  return request({
    url: '/admin/list',
    method: 'post',
    data: post
  })
}
// 修改管理员
export function updateAdmin(post) {
  return request({
    url: '/admin/update-admin',
    method: 'post',
    data: post
  })
}
// 新增管理员
export function addAdmin(post) {
  return request({
    url: '/admin/add-admin',
    method: 'post',
    data: post
  })
}
// 新增菜单权限
export function addMenuRule(post) {
  return request({
    url: '/admin/add-auth-menu',
    method: 'post',
    data: post
  })
}
// 全部菜单
export function menuAll() {
  return request({
    url: '/admin/menu-all',
    method: 'post'
  })
}
// 全部菜单
export function updateMenuRule(post) {
  return request({
    url: '/admin/update-menu-rule',
    method: 'post',
    data: post
  })
}
// 角色列表
export function roleList(post) {
  return request({
    url: '/admin/role-list',
    method: 'post',
    data: post
  })
}
// 添加角色
export function addRole(post) {
  return request({
    url: '/admin/add-role',
    method: 'post',
    data: post
  })
}
// 修改角色
export function updateRole(post) {
  return request({
    url: '/admin/update-role',
    method: 'post',
    data: post
  })
}
