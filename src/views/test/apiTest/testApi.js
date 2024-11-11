import request, { BaseUrl } from '@/utils/request'
/**
 * get请求测试
 * @param {*} url 请求的url 如 '/api/Security/Public/MesGetPartFamilyType'
 * @param {*} params 请求的参数
 * @returns 
 */
export function HandleGetMethodApiTest(url, params) {
    return request({
        url: `${BaseUrl.api}${url}`,
        method: 'get',
        params: params,
    })
}
/**
 * post请求测试
 * @param {*} url 请求的url 如 '/api/Security/Public/MesGetPartFamilyType'
 * @param {*} params 请求的参数
 * @returns 
 */
export function HandlePostMethodApiTest(url, data) {
    return request({
        url: `${BaseUrl.api}${url}`,
        method: 'post',
        data: data,
    })
}

export function HandleRequestApi(url, method, data) {
    if (method.toLowerCase() == 'get') {
        return request({
            url: `${BaseUrl.api}${url}`,
            method: method,
            params: data,
        })
    } else if (method.toLowerCase() == 'post') {
        return request({
            url: `${BaseUrl.api}${url}`,
            method: method,
            data: data,
        })
    } else {
        return request({
            url: `${BaseUrl.api}${url}`,
            method: method,
            data,
        })
    }
}