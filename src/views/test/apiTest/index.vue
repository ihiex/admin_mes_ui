<template>
  <el-container class="print_container">
    <el-main>
      <div id="ACE" ref="ace"></div>
    </el-main>
    <el-aside width="500px" style="padding: 20px">
      <!-- <el-button @click="handleGetData">将数据显示到控制台</el-button> -->

      <div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="URL">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-input v-model="form.method"></el-input>
          </el-form-item>
          <el-form-item label="请求参数">
            <div ref="params" style="width: 100%"></div>
          </el-form-item>
        </el-form>
        <div class="confirm_btn">
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </div>
      </div>
      <div style="opacity: 0.7">
        请求参数示例：
        <img src="./options.png" alt="" style="width: 200px" />
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-monokai' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-javascript' // 默认设置的语言模式
/* import 'ace-builds/src-noconflict/snippets/html'
import 'ace-builds/src-noconflict/snippets/css'
import 'ace-builds/src-noconflict/snippets/scss'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/text'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-monokai' */

import {
  HandleGetMethodApiTest,
  HandlePostMethodApiTest,
  HandleRequestApi,
} from './testApi'

export default {
  name: 'ApiTest',
  data() {
    return {
      title: 'api-test',
      resData: {},
      aceEditor: null,
      aceParams: null,
      themePath: 'ace/theme/monokai', // 不导入 webpack-resolver，该模块路径会报错
      modePath: 'ace/mode/javascript', // 同上
      form: {
        url: '',
        method: 'get',
        params: '',
      },
    }
  },
  mounted() {
    this.aceParams = ace.edit(this.$refs.params, {
      maxLines: 20, // 最大行数，超过会自动出现滚动条
      minLines: 20, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
    })
    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: 44, // 最大行数，超过会自动出现滚动条
      minLines: 44, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: this.themePath, // 默认设置的主题
      mode: this.modePath, // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
    })
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
    })
    this.aceParams.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true,
    })

    this.aceParams.getSession().setValue(JSON.stringify({"api-version":"2.0"}, null, '\t'))
  },
  methods: {
    handleGetData() {
      let s = this.aceParams.getSession().getValue().replace(/\s/g, '')
      console.log(JSON.parse(s))
    },
    handleSubmit() {
      let str = this.aceParams.getSession().getValue().replace(/\s/g, '')
      let data = {}
      if (str) {
        try {
          data = JSON.parse(str)
        } catch (error) {
          this.$message('请求参数有误, 请检查！')
        }
      }

      HandleRequestApi(
        this.form.url,
        this.form.method ? this.form.method : 'get',
        data
      ).then(
        (res) => {
          this.resData = res
          console.log(res)
          this.aceEditor
            .getSession()
            .setValue(JSON.stringify(this.resData, null, '\t'))
        },
        (error) => {
          console.log(error)
          this.aceEditor
            .getSession()
            .setValue(JSON.stringify(error, null, '\t'))
        }
      )

      //页面的参数可以在这里加
      /* let params = {
        'api-version': '2.0',
        // id: 1
      } */
      //get请求
      /* HandleGetMethodApiTest(
        '/api/Security/Public/MesGetPartFamilyType', //替换成你要测试的url
        params
      ).then(
        (res) => {
          this.resData = res
          console.log(res)
          this.aceEditor
            .getSession()
            .setValue(JSON.stringify(this.resData, null, '\t'))
        },
        (error) => {
          console.log(error)
          this.aceEditor
            .getSession()
            .setValue(JSON.stringify(error, null, '\t'))
        }
      ) */

      //post请求
      /* HandlePostMethodApiTest('',params).then(
        (res) => {
          console.log(res)
        },
        (error) => {
          console.log(error)
        }
      ) */
    },
  },
}
</script>

<style lang="scss" scoped>
.print_container {
  height: calc(100vh - 180px);
  .confirm_btn {
    text-align: right;
  }
}
</style>
