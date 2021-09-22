import request from '@/utils/request'

// 查询会议通知列表
export function meetList(query) {
  return request({
    url: '/document/send/acceptRegisterList',
    method: 'post',
    data: query
  })
}
// 查询流程模型
export function getTypeList() {
  return request({
    url: '/document/send/acceptTypeList',
    method: 'get'
  })
}
// 添加收文登记
export function addMeet(data) {
  return request({
    url: '/document/send/addAccept ',
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
//修改
export function updateSend(data){
  return request({
    url: '/document/send/modifyAccept',
    method: 'put',
    data: data
  })
}
// 查询流程详细
export function getMeet(query) {
  return request({
    url: '/document/send/queryDetail',
    method: 'post',
    data: query
  })
}

//主管领导部门
export function getDeptUser(query) {
  return request({
    url: '/document/send/getDeptUser',
    method: 'get',
    params: query
  })
}
