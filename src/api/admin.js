import request from '@/utils/request'

export function adminList(query) {
  return request({
    url: '/admin/adminList',
    method: 'get',
    params: query
  })
}

export function adminRoleAll(query) {
  return request({
    url: '/admin/roleAll',
    method: 'get',
    params: query
  })
}

export function adminUpdate(query) {
  return request({
    url: '/admin/adminUpdate',
    method: 'post',
    params: query
  })
}
