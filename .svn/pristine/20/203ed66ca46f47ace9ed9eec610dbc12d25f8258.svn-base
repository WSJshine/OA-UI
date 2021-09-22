import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/party/branch/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/party/branch/query/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/party/branch/add',
    method: 'post',
    data: data
  })
}

// 新增党员
export function addMember(data) {
  return request({
    url: '/party/branch/addMember?id='+data.id+'&ids='+data.ids,
    method: 'put',
    data: data
  })
}

// 新增账户
export function addAccount(data) {
  return request({
    url: '/party/branch/addUser?id='+data.id+'&userName='+data.userName,
    method: 'put',
  })
}
// 修改用户
export function updateUser(data) {
  return request({
    url: '/party/branch/modify',
    method: 'put',
    data: data
  })
}



// 删除用户
export function delUser(userId) {
  return request({
    url: '/party/branch/delete/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/party/branch/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/party/branch/template',
    method: 'get'
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

//获取企业列表
export function getAccountList(query) {
  return request({
    url: '/party/branch/getUser',
    method: 'get',
    params: query
  })
}

//获取企业列表
export function getMemberList(query) {
  return request({
    url: '/party/member/getInfo',
    method: 'get',
    params: query
  })
}
