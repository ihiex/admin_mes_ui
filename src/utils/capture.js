import html2canvas from "html2canvas";
import { Message } from 'element-ui';
import { UploadFile, WinUploadFile } from '@/api/basebasic.js'

/**
 * @author Jason.zou 305043598@qq.com
 * @description 截屏并上传
 *
 */
export default function handleCanvas() {
    const canvas = document.createElement("canvas");//创建canvas标签
    let canvasItem = document.body;//获取生成图片的标签  document.querySelector('#Cosmo')
    const width = parseInt(window.getComputedStyle(canvasItem).width); // 获取父级元素的宽度
    const height = parseInt(window.getComputedStyle(canvasItem).height);// 获取父级元素的高度
    canvas.width = width * 2; // 宽高放大2倍，防止图片模糊
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    const options = {
        backgroundColor: null,
        canvas: canvas,
        useCORS: true, //开启跨域控制
    }
    html2canvas(canvasItem, options).then((canvas) => {
        let imageURL = canvas.toDataURL("image/png") //toDataURL图片格式转成 base64
        handleUpLoadFile(imageURL)//上传图片到后台
        // this.downloadImage(imageURL)//下载到本地浏览

        //截屏至剪切板
        if (document.body.createControlRange) { //IE 11 需要有个img标签
            var controlRange;
            var imgs = document.getElementById('hidImag');
            imgs.onload = function () {
                controlRange = document.body.createControlRange();
                imgs.contentEditable = 'true';
                controlRange.addElement(imgs);
                try {
                    var successful = controlRange.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log(err);
                }
            }
            imgs.src = 'data:image/png;base64,' + imageURL;
        }
        else { //chrome
            const blobInput = base64toFile(imageURL, 'image/png');
            const clipboardItemInput = new ClipboardItem({ 'image/png': blobInput });
            navigator.clipboard.write([clipboardItemInput]);
        }
        Message({
            message: 'Successful screen capture',
            type: 'success',
            showClose: true
        });
    })
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description
 * @param imageURL
 * @param filename
 */
export function base64toFile(imageURL, filename = 'file') {
    let arr = imageURL.split(',')
    let mime = arr[0].match(/:(.*?);/)[1] // image/x-icon    image/svg+xml
    let suffix = mime.split('/')[1] // x-icon  svg+xml
    if (mime.includes('x-icon')) {
        mime = 'image/ico'
        suffix = 'ico'
    } else if (mime.includes('svg+xml')) {
        mime = 'image/svg'
        suffix = 'svg'
    }
    let baseStr = atob(arr[1])
    let n = baseStr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = baseStr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 上传文件
 * @param url
 */
export function handleUpLoadFile(url) {
  // debugger
  // console.log(url)
    const result = base64toFile(url);
    // console.log(result)
    let formData = new FormData(); //参数的格式是formData格式的
    formData.append("file", result); //参数
    WinUploadFile(formData).then((res) => {    //xxx为请求地址
        // debugger
        if (res.Success) {
            Message({
                message: 'Successfully upload',
                type: 'success',
                showClose: true
            });
        } else {
            Message({
                message: res.ResultMsg ? res.ResultMsg : '上传失败',
                type: 'error',
                showClose: true
            });
        }
    }, error => {
        Message({
            message: error,
            type: 'error',
            showClose: true
        });
    })
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 下载文件
 * @param url
 */
export function downloadImage(url) {
    let screenshotImage = document.createElement('a');
    screenshotImage.href = url;
    screenshotImage.download = '网页截图';
    screenshotImage.click();
}

/**
 * @author Jason.zou 305043598@qq.com
 * 把url转换为 canvas对象
 * @param url 网络图片地址必须服务器设置允许跨域
 * @returns {Promise<any>}
 */
export function urlToCanvas(url) {
    return new Promise((resolve) => {
        var image = new Image();
        // 先设置图片跨域属性
        image.crossOrigin = 'Anonymous';
        // 再给image赋值src属性，先后顺序不能颠倒
        image.src = url;
        image.onload = function () {
            var canvas = document.createElement('CANVAS');
            // 设置canvas宽高等于图片实际宽高
            canvas.width = image.width
            canvas.height = image.height
            canvas.getContext('2d').drawImage(image, 0, 0)
            let dataURL = canvas.toDataURL("image/jpeg") // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
            resolve(dataURL)
        }
        image.onerror = () => {
            resolve({ message: '图片处理失败' })
        }
    })
}
