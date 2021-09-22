import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询会议通知列表
export function projectList(query) {
  return request({
    url: '/engineer/list',
    method: 'get',
    params: query
  })
}

// 环评添加
export function addProject(data) {
  return request({
    url: '/engineer/eia',
    method: 'post',
    data: data
  })
}
//控规添加
export function addTipTwo(data) {
  return request({
    url: '/engineer/plan',
    method: 'post',
    data: data
  })
}
// 修改
export function updateProject(data) {
  return request({
    url: '/engineer/modifyEia',
    method: 'put',
    data: data
  })
}
// 查询控规详情
export function getTipTwoDetail(id) {
  return request({
    url: '/engineer/getPlan',
    method: 'get',
    params: id
  })
}
//控规修改
export function updateTipTwo(data) {
  return request({
    url: '/engineer/modifyPlan',
    method: 'put',
    data: data
  })
}
//获取第二步之后的详情
export function getDrawerDetail(url,id) {
  return request({
    url: url + id,
    method: 'get'
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
    url: '/engineer/getEia',
    method: 'get',
    params: id
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

//附件上传成功之后传地址
export function importAnnexUrl(data,urlData){
  return request({
    url: urlData,
    method: 'post',
    params: data
  })
}

//附件下载
export function fileDownload(fileName) {
  window.location.href = baseURL + "/construction/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}
