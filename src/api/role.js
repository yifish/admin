import request from '@/utils/request'

export function roleList(query) {
  return request({
    url: '/admin/roleList',
    method: 'get',
    params: query
  })
}

export function getCompetenceList(query) {
  return request({
    url: '/admin/competenceAll',
    method: 'get',
    params: query
  })
}

export function roleCreate(query) {
  return request({
    url: '/admin/roleCreate',
    method: 'post',
    params: query
  })
}

export function roleUpdate(query) {
  return request({
    url: '/admin/roleUpdate',
    method: 'post',
    params: query
  })
}
