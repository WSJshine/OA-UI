import request from '@/utils/request'

// 查询党员列表
export function memberList(query) {
  return request({
    url: '/party/member/list',
    method: 'get',
    params: query
  })
}

// 添加会议列表
export function addMember(data) {
  return request({
    url: '/party/member/add',
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
export function getMember(id) {
  return request({
    url: '/party/member/query/' + id,
    method: 'get'
  })
}

//删除
export function delMember(id) {
  return request({
    url: '/party/member/delete/' + id,
    method: 'delete'
  })
}

// 修改
export function updateLeave(data) {
  return request({
    url: '/party/member/modify',
    method: 'put',
    data: data
  })
}

//获取党组织
export function getParty(data) {
  return request({
    url: '/party/branch/allList',
    method: 'get',
    data: data
  })
}

//组额定转移
export function changeParty(data) {
  console.log(data)
  return request({
    url: '/party/member/transfer/'+data.id+'/'+data.branchId,
    method: 'get',
    data: data
  })
}

//获取党支部列表
export function getlistParty(query) {
  return request({
    url: '/party/branch/allList',
    method: 'get',
    params: query
  })
}

//获取企业列表
export function getlistPrise(query) {
  return request({
    url: '/enterprise/getSelect',
    method: 'get',
    params: query
  })
}

//导出模板
export function exportProject(){
  return request({
    url: '/party/member/importTemplate',
    method: 'get'
  })
}

//导入
export function importModel(data){
  return request({
    url: '/party/member/importData',
    method: 'post',
    params: data
  })
}

//导出
export function exportOutModel(query){
  return request({
    url: '/party/member/export',
    method: 'get',
    params: query
  })
}

//下载
export function tableDownload(data) {
  return request({
    url: '/party/member/export',
    method: 'get',
    params: data
  })
}
