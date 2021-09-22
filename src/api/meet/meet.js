import request from '@/utils/request'

// 查询会议通知列表
export function meetList(query) {
  return request({
    url: '/meeting/advice/list',
    method: 'get',
    params: query
  })
}

// 添加会议列表
export function addMeet(data) {
  return request({
    url: '/meeting/advice/add',
    method: 'post',
    data: data
  })
}

//提交申请
export function submitApply(id) {
  return request({
    url: '/meeting/advice/submitApply/' + id,
    method: 'post'
  })
}

// 查询待办列表
export function taskList(query) {
  return request({
    url: '/meeting/advice/taskList',
    method: 'get',
    params: query
  })
}

// 查询流程详细
export function getMeet(id) {
  return request({
    url: '/meeting/advice/query/' + id,
    method: 'get'
  })
}
