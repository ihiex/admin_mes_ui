import request, { BaseUrl } from '@/utils/request'



export function GetAllArticleCategory(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlecategory/GetAllEnable`,
        method: 'get',
        params: data,
    })
}

/* 获取所有文章 */
export function GetAllArticleNews(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/GetAllEnable`,
        method: 'get',
        params: data,
    })
}

/* 获取分类及该分类文章标题 */
export function GetCategoryArticle(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/GetCategoryArticle`,
        method: 'get',
        params: data,
    })
}

/* 新增文章 */
export function Insert(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/Insert`,
        method: 'post',
        data,
    })
}

/* 更新文章 */
export function Update(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/Update`,
        method: 'post',
        data,
    })
}

/* 删除 */
export function Delete(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/Delete`,
        method: 'delete',
        params: data,
    })
}
/* 软删 */
export function DeleteSoft(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/DeleteSoft`,
        method: 'post',
        data,
    })
}


/* 根据id获取一个对象信息 */
export function GetById(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/GetById`,
        method: 'get',
        params: data,
    })
}
/* 根据条件分显示 */
export function FindWithPager(data) {
    return request({
        url: `${BaseUrl.api}/api/CMS/Articlenews/FindWithPager`,
        method: 'post',
        data,
    })
}


