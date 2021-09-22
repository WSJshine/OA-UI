import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询会议通知列表
export function projectList(query) {
  return request({
    url: '/construction/list',
    method: 'get',
    params: query
  })
}

// 添加
export function addProject(data) {
  return request({
    url: '/construction/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateProject(data) {
  return request({
    url: '/construction/modify',
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

// 查询详细
export function getProjectDetail(id) {
  return request({
    url: '/construction/query/' + id,
    method: 'get'
  })
}

// 删除
export function delProject(id) {
  return request({
    url: '/construction/delete/' + id,
    method: 'delete'
  })
}

//导出模板
export function exportProject(){
  return request({
    url: '/construction/model',
    method: 'get'
  })
}

//导入
export function importModel(data){
  return request({
    url: '/construction/import',
    method: 'post',
    params: data
  })
}

//导出
export function exportOutModel(query){
  return request({
    url: '/construction/export',
    method: 'get',
    params: query
  })
}
// 查询企业详细
export function getEnterDetail(name) {
  return request({
    url: '/enterprise/queryName?name=' + name,
    method: 'get'
  })
}
//附件上传成功之后传地址
export function importAnnexUrl(data){
  return request({
    url: '/construction/upload',
    method: 'post',
    params: data
  })
}
//需求更改  流程信息查详情
export function getDetailEngineer(data){
  return request({
    url: '/engineer/query?projectId='+data,
    method: 'get',
  })
}
//需求更改  流程信息修改
export function importEngineer(data){
  return request({
    url: '/engineer/update',
    method: 'put',
    data: data
  })
}
//需求修改  附件上传成功之后
export function afterUpload(data){
  return request({
    url: '/engineer/upload',
    method: 'put',
    data: data
  })
}
//附件下载
export function fileDownload(fileName) {
  window.location.href = baseURL + "/construction/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

//设置备案
export function record(data) {
  return request({
    url: '/construction/update/'+data,
    method: 'put',
  })
}

//下载
export function tableDownload(data) {
  return request({
    url: '/construction/export',
    method: 'get',
    params: data
  })
}
