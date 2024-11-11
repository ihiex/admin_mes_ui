<template>
  <el-drawer :title="$t('view')" :visible.sync="drawer" direction="rtl" size="90%" :before-close="handleClose"
    :destroy-on-close="true" :wrapper-closable="false">
    <div class="item_list" style="padding-left: 30px;">
      <div class="item">
        <div>
          <el-image style="width: 600px; " :src="$imgBaseUrl + ruleForm.IMGURL"
            :preview-src-list="[$imgBaseUrl + ruleForm.IMGURL]" fit="scale-down" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
        <div style="padding: 0 15px; box-sizing: border-box; width: 100%; position: relative;">
          <h1 style="margin: 5px 0; font-size: 20px; ">{{ ruleForm.CreateTime }}</h1>
          <div class="item_content">
            <p>
              IP: {{ ruleForm.IP }}
            </p>
            <p>
              {{ $t('Line') + ': ' + ruleForm.Line }}
            </p>
            <p>
              {{ $t('Station') + ': ' + ruleForm.Station }}
            </p>
            <p>
              {{ $t('status') + ': ' + feedbackStatus[ruleForm.IsFeedback] }}
            </p>
            <p>
              {{ $t('content') + ': ' + ruleForm.Feedback }}
            </p>
            <!-- (item.IsFeedback === '0' ? $t('NoResponse') : $t('Response')) -->
          </div>
          <!-- v-if="!item.Feedback" -->
          <el-button style="position: absolute; right: 20px; bottom: 0;" size="mini" @click="handleClickItemContent()">{{
            $t('Feedback') }}</el-button>
        </div>
      </div>
    </div>
    <Feedback ref="FeedbackRef" @getContent="getContent"></Feedback>
  </el-drawer>
</template>

<script>
import Feedback from './feedback'


export default {
  components: {
    Feedback
  },
  data() {
    return {
      drawer: false,
      ruleForm: {},
      feedbackStatus:
      {
        "0": this.$t('QuestionSubmit'),
        "1": this.$t('QuestionDispose'),
        "2": this.$t('UserConfirm')
      }
    }
  },

  methods: {
    getContent(val) {
      Object.keys(val).forEach(k => {
        this.$set(this.ruleForm, k, val[k])
      })
      this.$emit('getContent', val)
    },

    handleClickItemContent() {
      this.$refs.FeedbackRef.show(this.ruleForm)
    },

    show(data) {
      this.ruleForm = { ...data }
      this.drawer = true
    },

    handleClose() {
      Object.keys(this.ruleForm).forEach(key => {
        this.$set(this.ruleForm, key, '')
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
