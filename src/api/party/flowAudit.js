import request from '@/utils/request'

// 查询党员列表
export function memberList(query) {
  return request({
    url: '/party/member/flowList',
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
    url: '/party/member',
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


// 撤销流程
export function cancelApply(partyId) {
  return request({
    url: '/party/member/revoke/' + partyId,
    method: 'get'
  })
}

// 退回
export function callBack(partyId) {
  return request({
    url: '/party/member/ren/' + partyId,
    method: 'get'
  })
}

// 通过
export function callPass(partyId) {
  return request({
    url: '/party/member/adopt/' + partyId,
    method: 'get'
  })
}
