import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/party/building/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/party/building/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/party/building/add',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/party/building',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/party/building/delete/' + noticeId,
    method: 'delete'
  })
}

//获取文章评论
export function getComment(query) {
  return request({
    url: '/party/comment/list',
    method: 'get',
    params: query
  })
}

// 删除评论
export function delComment(id) {
  return request({
    url: '/party/comment/delete/' + id,
    method: 'delete'
  })
}

// 新增评论
export function addComment(data) {
  return request({
    url: '/party/comment/add',
    method: 'post',
    data: data
  })
}
