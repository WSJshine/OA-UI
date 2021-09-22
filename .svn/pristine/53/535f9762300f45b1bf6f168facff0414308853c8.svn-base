import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询会议通知列表
export function  enterList(query) {
  return request({
    url: '/enterprise/list',
    method: 'get',
    params: query
  })
}
//新增前调接口   看分包人员
export function  beforeAdd(query) {
  return request({
    url: '/enterprise/checkPermission',
    method: 'get',
    // params: query
  })
}
//查看所有租赁厂院名称
export function  getAllUps1(query) {
  return request({
    url: '/enterprise/selectList',
    method: 'get',
    // params: query
  })
}
//查看所有人员
export function getDeptUser(query) {
  return request({
    url: '/document/send/getDeptUser',
    method: 'get',
    params: query
  })
}

// 添加会议列表
export function addEnter(data) {
  return request({
    url: '/enterprise/add',
    method: 'post',
    data: data
  })
}
// 查询企业详细
export function getEnterDetail(id) {
  return request({
    url: '/enterprise/query/' + id,
    method: 'get'
  })
}
// 修改
export function updateEnter(data) {
  return request({
    url: '/enterprise/modify',
    method: 'put',
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

// 删除
export function delEnter(id) {
  return request({
    url: '/enterprise/delete/' + id,
    method: 'delete'
  })
}

//导出模板
export function exportModel(){
  return request({
    url: '/enterprise/model',
    method: 'get'
  })
}

//导入
export function importModel(data){
  return request({
    url: '/enterprise/excel',
    method: 'post',
    params: data
  })
}

//导出
export function exportOutModel(query){
  return request({
    url: '/enterprise/export',
    method: 'get',
    params: query
  })
}

//下载
export function tableDownload(data) {
  return request({
    url: '/enterprise/export',
    method: 'get',
    params: data
  })
}
