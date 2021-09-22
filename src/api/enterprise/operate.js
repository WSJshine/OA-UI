import request from '@/utils/request'

// 查询会议通知列表
export function projectList(query) {
  return request({
    url: '/operation/list',
    method: 'get',
    params: query
  })
}

// 添加
export function addProject(data) {
  return request({
    url: '/operation/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateProject(data) {
  return request({
    url: '/operation/modify',
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
//按月---修改前查看详情
export function getDataDetail(query) {
  return request({
    url: '/operation/query/'+query,
    method: 'get',
    // params: query
  })
}
// 按年查询详细
export function getProjectDetail(query) {
  return request({
    url: '/operation/selectYearInfo',
    method: 'get',
    params: query
  })
}
// 按月查询详细
export function getMonthDetail(query) {
  return request({
    url: '/operation/selectMonthInfo',
    method: 'get',
    params: query
  })
}
// 删除
export function delProject(id) {
  return request({
    url: '/operation/delete/' + id,
    method: 'delete'
  })
}

//导出模板
export function exportProject(query){
  return request({
    url: '/operation/model',
    method: 'get',
  })
}

//导入
export function importModel(data){
  return request({
    url: '/operation/excel',
    method: 'post',
    params: data
  })
}

//导出
export function exportOutModel(query){
  return request({
    url: '/operation/export',
    method: 'get',
    params: query
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

//下载
export function tableDownload(data) {
  return request({
    url: '/operation/export',
    method: 'get',
    params: data
  })
}
export function tableDownload1(data) {
  return request({
    url: '/operation/export1',
    method: 'get',
    params: data
  })
}
