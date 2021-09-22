import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API;
// 查询会议通知列表
export function websiteList(query) {
  return request({
    url: '/website/list',
    method: 'get',
    params: query
  })
}

// 添加
export function addWebsite(data) {
  return request({
    url: '/website/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateWebsite(data) {
  return request({
    url: '/website/modify',
    method: 'put',
    data: data
  })
}

// 查询详细
export function getWebsiteDetail(id) {
  let data={
    id:id
  }
  return request({
    url: '/website/query1' ,
    method: 'get',
    params:data
  })
}

// 删除
export function delWebsite(id) {
  return request({
    url: '/website/delete/' + id,
    method: 'delete'
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
