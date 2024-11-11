<template>
    <el-drawer title="新增" :visible.sync="drawer" direction="rtl" size="90%" :before-close="handleClose"
        :destroy-on-close="true" :wrapper-closable="false" @open="handleOpen">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="问题描述" prop="desc">
                <QuillEditor ref="QuillEditor" v-model="ruleForm.desc" height="500px" :is-image-upload="true">
                </QuillEditor>

            </el-form-item>
            <el-form-item style="text-align: right;">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script>
import { GetAllArticleCategory, GetAllArticleNews, Insert } from '@/api/articleNews.js'
import QuillEditor from '@/components/QuillEditor'

export default {
    components: {
        QuillEditor
    },
    data() {
        return {
            drawer: false,
            params: {
                "Id": "string",
                "CategoryId": "string",
                "CategoryName": "string",
                "Title": "string",
                "SubTitle": "string",
                "LinkUrl": "string",
                "ImgUrl": "string",
                "SeoTitle": "string",
                "SeoKeywords": "string",
                "SeoDescription": "string",
                "Tags": "string",
                "Zhaiyao": "string",
                "Description": "string",
                "SortCode": 0,
                "IsMsg": true,
                "IsTop": true,
                "IsRed": true,
                "IsHot": true,
                "IsSys": true,
                "IsNew": true,
                "IsSlide": true,
                "Click": 0,
                "LikeCount": 0,
                "TotalBrowse": 0,
                "Source": "string",
                "Author": "string",
                "EnabledMark": true
            },
            ruleForm: {
                title: '',
                desc: '',
            },
            rules: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' },
                ],
                desc: [
                    { required: true, message: '请填写问题描述', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        /*  this.$nextTick(function () {
             document.querySelector('#TextArea').onpaste = this.test
         }) */
    },
    methods: {
        handleOpen() {
            this.$nextTick(function(){
                this.$refs.QuillEditor.setHeight('500px')
            })

        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    console.log(this.ruleForm)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleAdd() {
            let user = this.$store.getters['user/userInfo']
            let params = {
                // "Id": "",
                "CategoryId": "1",
                "CategoryName": "异常问题",
                "Title": "QC异常反馈",
                "SubTitle": "页面显示",
                "LinkUrl": "https:// www.baidu.com",
                "ImgUrl": "http://172.16.10.165:44328/upload/2020/9/17/2020091720402857303176.png",
                "SeoTitle": "搜索标题",
                "SeoKeywords": "搜索关键字",
                "SeoDescription": "探索描述",
                "Tags": "tags1",
                "Zhaiyao": "异常问题",
                "Description": "粘性定位常作用在导航和概览信息(标题，表头，操作栏，底部评论等)上。这样，用户在浏览详细信息时，也能看到信息的概览和做一些操作，给用户带来便捷的使用体验",
                "SortCode": 0,
                "IsMsg": true,
                "IsTop": true,
                "IsRed": true,
                "IsHot": true,
                "IsSys": true,
                "IsNew": true,
                "IsSlide": true,
                "Click": 0,
                "LikeCount": 10,
                "TotalBrowse": 20,
                "Source": "源",
                "Author": JSON.stringify({ userName: user.Name, userId: user.UserId, org: user.OrganizeId, createIP: user.CurrentLoginIP }),
                "EnabledMark": true
            }
            Insert(params).then(res => {
                console.log(res)
            })
        },
        handleTest() {
            /*   GetAllArticleCategory().then(res => {
                  console.log(res)
              }) */
            GetAllArticleNews().then(res => {
                console.log(res)
            })

            // console.log()
        },
        show() {
            this.drawer = true
        },
        handleClose() {
            Object.keys(this.ruleForm).forEach(key => {
                this.$set(this.resetForm, key, '')
            })
            this.drawer = false
        }
    }
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
    padding-right: 15px;
    box-sizing: border-box;
}
</style>
