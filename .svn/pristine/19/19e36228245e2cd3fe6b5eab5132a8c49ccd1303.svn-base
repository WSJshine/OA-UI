import request from '@/utils/request'


// 待办
export function getTask(data) {
  return request({
    url: '/document/send/taskList?pageNum=1&pageSize=5',
    method: 'post',
    data: data
  })
}

//待收
export function getWait(data) {
  return request({
    url: '/document/send/acceptList?pageNum=1&pageSize=5',
    method: 'post',
    data: data
  })
}

//通知公告
export function getPost(data) {
  return request({
    url: '/document/send/selectNoticeList?pageNum=1&pageSize=5',
    method: 'get',
  })
}

//已收公文
export function getDocument(data) {
  return request({
    url: '/document/send/documentedList?pageNum=1&pageSize=5',
    method: 'get'
  })
}

//消息通知
export function getNewMessage(data) {
  return request({
    url: '/message/getMessageCount',
    method: 'get'
  })
}
