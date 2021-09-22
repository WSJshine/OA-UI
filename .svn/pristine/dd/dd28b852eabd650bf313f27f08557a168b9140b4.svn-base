import request from '@/utils/request'


// 项目招商
export function getTask(data) {
  return request({
    url: '/website/projectList?pageNum=1&pageSize=5',
    method: 'get'
  })
}

//企业信息
export function getEnterprise(data) {
  return request({
    url: '/website/enterpriseList?pageNum=1&pageSize=5',
    method: 'get'
  })
}

//通知公告
export function getPost(data) {
  return request({
    url: '/website/policyList?pageNum=1&pageSize=5',
    method: 'get',
    params: data
  })
}

//已收公文
export function getPark(data) {
  return request({
    url: '/website/parkList?pageNum=1&pageSize=5',
    method: 'get'
  })
}

// 查询详细
export function getWebsiteDetail(data) {
  return request({
    url: '/website/query',
    method: 'get',
    params: data
  })
}

// 通知公告查询详细
export function getNoticeDetail(id) {
  return request({
    url: '/document/notice/query/' + id,
    method: 'get'
  })
}
//园区动态、企业信息、项目招商查看详情

export function getPackDetail(id) {
  return request({
    url: '/website/query?id=' + id,
    method: 'get'
  })
}
