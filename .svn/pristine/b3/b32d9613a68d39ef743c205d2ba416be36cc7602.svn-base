import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询会议通知列表
export function projectList(query) {
  return request({
    url: '/contract/list',
    method: 'get',
    params: query
  })
}

// 添加
export function addProject(data) {
  return request({
    url: '/contract/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateProject(data) {
  return request({
    url: '/contract/modify',
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
    url: '/contract/query/' + id,
    method: 'get'
  })
}

// 删除
export function delProject(id) {
  return request({
    url: '/contract/delete/' + id,
    method: 'delete'
  })
}
//导出附件
export function exportText(query){
  return request({
    url: '/document/send/downloadfile',
    method: 'get',
    params: query
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
export function importAnnexUrl(data){
  return request({
    url: '/contract/upload',
    method: 'post',
    params: data
  })
}

//附件下载
export function fileDownload(fileName) {
  window.location.href = baseURL + "/construction/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}
