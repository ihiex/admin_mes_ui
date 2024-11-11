<template>
    <div id="ProblemDetail" class="app_container">
      <!--   <h1>
            {{ data.title }}
        </h1> -->
        <el-image ref="ElImage" :src="$baseUrl + data.FilePath" alt="#" :lazy="true" :scroll-container="$el">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
       <!--  <p style="padding: 0 10px;">
            {{ data.content }} <br />
        </p>

        <div v-if="data.title" style="text-align: right;">
            <span class="read_back" plain @click="handleReadBack">回复</span>
        </div> -->
       <!--  <div v-for="(res, index) in data.readBackList" :key="index">
            <h3 @click="handleReadBackTo(res.name)">{{ res.name }} <span
                    style="color: #ccc; font-size: 12px;">回复了你的问题</span> <span
                    style="padding-left: 10px; color: #ccc; font-size: 12px;">{{ new Date().format('yyyy-MM-dd hh:mm:ss')
                    }}</span></h3>
            <p>{{ res.content }}</p>
        </div> -->

        <div v-if="flag" class="return_content">
            <div v-if="readBackTo">你正在回复 {{ readBackTo }}</div>

            <QuillEditor ref="QuillEditor" v-model="ruleForm.desc" height="150px" :is-image-upload="false"></QuillEditor>

            <div style="text-align: right; margin-top: 10px;">
                <el-button size="mini" plain @click="flag = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleReadBack">回复</el-button>
            </div>
        </div>
    </div>
</template>

<script>
// import { urlToCanvas } from '@/utils/capture.js'
import { DeleteFile } from '@/api/basebasic.js'
import QuillEditor from '@/components/QuillEditor'


export default {
    name: 'ProblemDetails',
    components: {
        QuillEditor
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // debugger
            if (JSON.stringify(to.params) != '{}' && (to.params.title != vm.data.title)) {
                vm.data = { ...to.params }
                console.log(vm.data)
                vm.flag = false
                vm.readBackTo = ''
                // vm.id = to.params.Id
            }
        })
    },

    data() {
        return {
            title: '详情页',
            data: {},
            flag: false,
            readBackTo: '',
            // imgUrl: '',
            id: '',
            ruleForm: {}
        }
    },
    created() {
        /*  console.log(this.$route)
         let data = this.$route.params
         console.log(data) */

    },
    methods: {

        test(id) {
            DeleteFile({ id }).then(res => {
                console.log(res)
                //  this.imgUrl = res
                if (res.Success) {
                    this.id = ''
                }
            }).catch(error => {
                console.log(error)
            })
        },
        handleReadBack() {
            this.readBackTo = ''
            this.flag = true;
            this.$nextTick(function () {
                this.$refs.QuillEditor.setHeight('150px')
            })
        },
        handleReadBackTo(name) {
            this.flag = true;
            this.readBackTo = name
            this.$nextTick(function () {
                this.$refs.QuillEditor.setHeight('150px')
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.app_container {
    padding: 10px 10px 0 10px;
    position: relative;

    .read_back {
        cursor: pointer;
        margin: 0 10px;
        padding: 5px 10px;
        background-color: #eee;
        border-radius: 3px;
    }

    .return_content {
        height: 250px;
        // border: 1px solid red;
        position: sticky;
        bottom: 0px;
        background-color: #fff;
        z-index: 101;
        padding: 5px;
        box-shadow: #ccc -1px -1px 5px -1px;
    }
}
</style>
