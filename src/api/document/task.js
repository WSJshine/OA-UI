import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询请假流程列表
export function listLeave(query) {
  return request({
    url: '/document/send/mylist?pageNum='+query.pageNum+'&pageSize='+query.pageSize,
    method: 'post',
    data: query
  })
}

// 查询请假流程待办列表
export function taskList(query) {
  return request({
    url: '/document/send/taskList?pageNum='+query.pageNum+'&pageSize='+query.pageSize,
    method: 'post',
    data: query
  })
}// 查询请假流程已办列表
export function taskDoneList(query) {
  return request({
    url: '/document/send/taskDoneList?pageNum='+query.pageNum+'&pageSize='+query.pageSize,
    method: 'post',
    data: query
  })
}

// 查询请假流程详细
export function getLeave(query) {
  return request({
    url: '/document/send/queryDetail',
    method: 'post',
    data: query
  })
}

export function getLeave1(id) {
  return request({
    url: '/workflow/leave/' + id,
    method: 'get'
  })
}
// 提交请假流程
export function submitApply(id) {
  return request({
    url: '/workflow/leave/submitApply/' + id,
    method: 'post'
  })
}

// 新增请假流程
export function addLeave(data) {
  return request({
    url: '/workflow/leave',
    method: 'post',
    data: data
  })
}

// 修改请假流程
export function updateLeave(data) {
  return request({
    url: '/workflow/leave',
    method: 'put',
    data: data
  })
}
//修改公告
export function updateNotice(data) {
  return request({
    url: '/document/notice/modify',
    method: 'put',
    data: data
  })
}
//修改收文登记
export function updateAccept(data) {
  return request({
    url: '/document/send/modifyAccept',
    method: 'put',
    data: data
  })
}
//发文拟稿修改
export function updateSend(data) {
  return request({
    url: '/document/send/modifySend',
    method: 'put',
    data: data
  })
}
// 删除请假流程
export function delLeave(id) {
  return request({
    url: '/workflow/leave/' + id,
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

// 查询任务类型
export function getTypeList() {
  return request({
    url: '/document/send/typeList',
    method: 'get'
  })
}

//附件下载
export function fileDownload(fileName) {
  window.location.href = baseURL + "/construction/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

//下一步审核人
export function getDeptUser(query) {
  return request({
    url: '/document/send/getDeptUser',
    method: 'get',
    params: query
  })
}

//获取下一步审核人标题
export function getDeptUserTitele(query,data) {
  return request({
    url: '/document/send/getNextName?key='+query+'&taskName='+data,
    method: 'get',
    params: query
  })
}

//归档
export function finishArchive(data) {
  return request({
    url: '/workflow/leave/updSupervision/'+data,
    method: 'post',
  })
}

export function sendDocument1(data) {
  return request({
    url: '/document/send/addDocument',
    method: 'post',
    data: data
  })
}
