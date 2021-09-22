import request from '@/utils/request'

// 查询请假流程列表
export function listLeave(query) {
  return request({
    url: '/party/activity/tasklist?'+'pageNum='+query.pageNum+'&pageSize='+query.pageSize,
    method: 'post',
    data: query
  })
}

// 查询请假流程待办列表
export function taskList(query) {
  return request({
    url: '/workflow/leave/taskList',
    method: 'get',
    params: query
  })
}// 查询请假流程已办列表
export function taskDoneList(query) {
  return request({
    url: '/workflow/leave/taskDoneList',
    method: 'get',
    params: query
  })
}

// 查询请假流程详细
export function getLeave(id) {
  return request({
    url: '/party/activity/query/' + id,
    method: 'get'
  })
}

// 提交请假流程
export function submitApply(id) {
  return request({
    url: '/party/activity/submitApply/' + id,
    method: 'post'
  })
}

// 新增
export function addLeave(data) {
  return request({
    url: '/party/activity/add',
    method: 'post',
    data: data
  })
}

// 修改请假流程
export function updateLeave(data) {
  return request({
    url: '/party/activity/modify',
    method: 'put',
    data: data
  })
}

// 删除请假流程
export function delLeave(id) {
  return request({
    url: '/party/activity/delete/' + id,
    method: 'delete'
  })
}

// 导出请假流程
export function exportLeave(query) {
  return request({
    url: '/workflow/leave/export',
    method: 'get',
    params: query
  })
}



// 查询会议通知列表
export function meetList(query) {
  return request({
    url: '/meeting/advice/list',
    method: 'get',
    params: query
  })
}

// 查询接收党支部列表
export function getlistDept(query) {
  return request({
    url: '/party/branch/allList',
    method: 'get',
    params: query
  })
}
