import request, { BaseUrl } from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    // url: `${BaseUrl.api}/api/Login/GetCheckUser`, //旧登录
    url: `${BaseUrl.api}/api/Login/GetCheckUserMES`,
    method: 'get',
    params: data
  })
}

export async function GetCheckUserMES(data) {
  return request({
    url: `${BaseUrl.api}/api/Login/GetCheckUserMES`,
    method: 'get',
    params: data,
    timeout: 0,
  })
}

export async function loginNoKey(data, api) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Login/GetCheckUserNoKey`,
    method: 'get',
    params: data
  })
}

export function getUserInfo(api) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Login/GetUserInfo`,
    method: 'get',
    timeout: 0,
  })
}

export function getToken(data, api) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Token`,
    method: 'get',
    params: data
  })
}

export function logout() {
  return request({
    url: `${BaseUrl.api}/api/Login/logout`,
    method: 'get',
    isShowLoading: true,
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}

export function Captcha() {
  return request({
    url: `${BaseUrl.api}/api/Captcha`,
    method: 'get'
  })
}
export function SetSyncUserData() {
  return request({
    url: `${BaseUrl.api}/api/Security/User/SetSyncUserData`,
    method: 'get'
  })
}
