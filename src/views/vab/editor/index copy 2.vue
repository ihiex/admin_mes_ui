<template>
  <div id="VueQuillEditorJason" :style="{ height }">
    <quillEditor ref="VueQuillEditor" v-model="content" style="height: inherit;" :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"
      @change="onEditorChange($event)"></quillEditor>
  </div>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
// import QuillBetterTable from 'quill-better-table';

Quill.register('modules/ImageResize', ImageResize)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/ImageExtend', ImageExtend)
// Quill.register({
//   'modules/better-table': QuillBetterTable
// }, true)
import {
  getAccessToken
} from '@/utils/accessToken'
import { base64toFile } from '@/utils/capture.js'

import { UploadFile } from '@/api/basebasic.js'

/* 
vue-quill-editor version 3.0+
注：如果要使用table 须降版本至2.0, 但要牺牲图片拖拽功能
*/
export default {
  components: { quillEditor },
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: '',
        modules: {
          imageDrop: true,
          ImageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
          },
          toolbar: {
            container: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            // [{ 'table': 'Table' }],
            ['clean']],
            handlers: {
              'image': function () {
                console.log('image')
                QuillWatch.emit(this.quill.id)
              }
            }                                        // remove formatting button
          },
          ImageExtend: {  //添加图片上传至服务器功能
            loading: true,
            name: 'img',
            headers: (xhr) => {
              xhr.setRequestHeader('Authorization', getAccessToken())
            },
            action: this.$baseUrl + 'api/Files/Upload',
            response: (res) => {
              return /* this.$baseUrl */process.env.VUE_APP_BASE_URL + '/' + res.ResData.FilePath
            }
          },
          /* ImageExtend: {  // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入 
            name: 'img',  // 图片参数名
            size: 3,  // 可选参数 图片大小，单位为M，1M = 1024kb
            action: updateUrl,  // 服务器地址, 如果action为空，则采用base64插入图片
            // response 为一个函数用来获取服务器返回的具体图片地址
            // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
            // 则 return res.data.url
            response: (res) => {
              return res.info
            },
            headers: (xhr) => {
              // xhr.setRequestHeader('myHeader','myValue')
            },  // 可选参数 设置请求头部
            sizeError: () => { },  // 图片超过大小的回调
            start: () => { },  // 可选参数 自定义开始上传触发事件
            end: () => { },  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => { },  // 可选参数 上传失败触发的事件
            success: () => { },  // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('token', 'myToken')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          }, */
          /* table: false,
          'better-table': {
            operationMenu: {
              items: {
                unmergeCells: {
                  text: 'Another unmerge cells name'
                }
              },
              color: {
                colors: ['green', 'red', 'yellow', 'blue', 'white'],
                text: 'Background Colors:'
              }
            }
          } */
        }
      },
      height: '400px',
    }
  },
  watch: {

  },
  mounted() {
    this.pasteOption()
  },
  methods: {
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.Base64ToFileUpload()
    },
    /* 
    处理base64格式的图片转成文件上传至服务器，仅限jpg/jpeg/png格式图片
    */
    Base64ToFileUpload() {
      let imgs = this.$el.querySelectorAll('img[src^="data:image/"]')
      imgs.forEach(res => {
        /* 
        data:image/svg+xml;base64
        data:image/x-icon;base64
        data:image/jpeg;base64
        data:image/png;base64
        */
        //只处理以下两种图片格式
        if (res.src.includes('data:image/jpeg;base64') || res.src.includes('data:image/png;base64')) {
          //将base64的图片转成文件上传至服务器后再显示于页面上，以节省空间
          const result = base64toFile(res.src);
          // console.log(result)
          let formData = new FormData(); //参数的格式是formData格式的
          formData.append("file", result); //参数
          UploadFile(formData).then(item => {
            res.src = process.env.VUE_APP_BASE_URL + '/' + item.ResData.FilePath
          })
        }
      })
    },
    /* 
    获取剪贴板中和图片并粘贴于富文本中
    */
    pasteOption() {
      let that = this;
      this.$el.querySelector('.ql-container').addEventListener("paste", function (e) {
        let items = e.clipboardData && e.clipboardData.items;
        let file = null;
        if (items && items.length) {
          // 检索剪切板items
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              file = items[i].getAsFile();
              break;
            }
          }
        }
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
          // 图片内容 base64格式
          const imgContent = event.target.result;
          let dom = document.createElement('div')
          dom.innerHTML = that.content
          let img = document.createElement('img')
          img.src = imgContent
          dom.appendChild(img)
          that.content = dom.innerHTML
          that.Base64ToFileUpload()
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
