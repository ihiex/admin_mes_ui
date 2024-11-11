<template>
  <div class="main_content">
    <el-upload ref="upload" class="upload-demo" drag :action="action" :multiple="false" :name="name" :auto-upload="false"
      :headers="$requestHeaders" :data="params" :show-file-list="false" accept=".xlsx,.xls,.csv"
      :on-success="handleSuccess" :before-upload="handleUploadBefore" :on-change="handleChange" :on-error="handleError">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传xlsx/xls/csv文件,且不超过500kb</div>
    </el-upload>

    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <!-- <el-button @click="test">test</el-button> -->
    <p v-for="item in tableHeader" :key="item">{{ item }}</p>
  </div>
</template>
<script>
import { readFile, readFileToCSV } from '@/utils/excel.js'

/* 上传excel */
/* readFile() if(res && JSON.stringify(res) === '{}'){
         this.$message('文件内容为空')
         return
       } */
/*  let data = {};
 Object.keys(res).forEach(key => {
   data[key] = [];
   res[key].forEach(item => {
     let obj = {}
     Object.keys(item).forEach(k => {
       // obj[k.replace(/'|#|\s/g, '_')] = item[k]// + '' 去除表头key的空格
       obj[k] = item[k]// + ''
     })
     data[key].push(JSON.parse(JSON.stringify(obj)))
   })
 })
 let arr = data[Object.keys(data)[0]];
 this.tableHeader = Object.keys(arr[0])
 console.log(this.tableHeader) */
/*  this.$nextTick(function () {
   this.tableData = [...arr]

   this.$nextTick(function () {
     this.tableData.forEach(row => {
       this.$refs.multipleTable.toggleRowSelection(row, true)
     })
   })

 })
 this.loading = false */
export default {

  data() {
    return {
      name: '',
      action: this.$baseUrl + 'api/Files/Upload',
      params: {
        author: 'Jason',
        upload: 'excel文件'
      },
      tableHeader: []
    }
  },

  mounted() {

  },
  methods: {
    test() {
      console.log(this.action)
      console.log(this.$requestHeaders)
    },
    handleError(err, file, fileList) {
      console.log('上传失败');
    },
    handleChange(file, fileList) {
      this.name = file.name
      console.log(file)
      console.log(fileList)

      readFileToCSV(file.raw).then(res => {
        console.log(res)
        let keys = Object.keys(res)
        let kObj = {}
        keys.forEach(key => {
          // debugger
          kObj[key] = res[key].split('\n')
        })
        Object.keys(kObj).forEach(key => {
          kObj[key].forEach((item, index) => {
            kObj[key][index] = item.split(',')
          })
        })
        Object.keys(kObj).forEach(key => {
          kObj[key].forEach((item, index) => {
            if (index > 0) {
              kObj[key][0].forEach((k, i) => {
                kObj[key][index][i] = {[k]: kObj[key][index][i]}
              })
            }
          })
        })


        console.log(kObj)
      })
    },
    handleUploadBefore(file) {
      console.log(file)
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      this.$refs.upload.clearFiles()

    },
    submitUpload() {
      this.$refs.upload.submit();
    },
  }

}
</script>
<style scoped lang="scss"></style>
