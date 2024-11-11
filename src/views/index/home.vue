<template>
  <div class="main_content">
    <!-- Welcome -->
    <!--  <el-date-picker v-model="value3" type="datetime" placeholder="选择日期时间">
    </el-date-picker>
    <el-button type="primary" @click='handleSetShift'>主要按钮</el-button> -->
    <!--  <el-select v-model="form.timeType" placeholder="请选择" @change="handleTimeType">
    <el-option
      v-for="item in timeOption"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    <el-button style="width: 106px" type="warning"  @click="test">test</el-button>
 -->
    <!-- {{ $t('standardValues', { 0: $t('ceil') }) }} -->
    <!-- <img :src="require('@/assets/svg/warning_height_active.svg')" alt=""> -->
     <!-- <el-button @click="test">test</el-button> -->
  </div>
</template>
<script>
// import warn from '@/assets/svg/warning_height_active.svg'
export default {
  data() {
    return {
      value3: new Date().format('yyyy-MM-dd hh:mm:ss'),
      // shift: this.$store.getters['user/userShiftTable']
      form: {},
      timeOption: this.$store.getters['common/timeOptions'],
      shiftInfo: {
        D: {
          end: 20,
          start: 8,
          isSpan: false,
          s_end: '20:00:00',
          s_start: '08:00:00'
        },
        N: {
          end: 8,
          start: 20,
          isSpan: true,
          s_end: '08:00:00',
          s_start: '20:00:00'
        }
      }
    }
  },
  methods: {
    test() {
      console.log(this.timeOption)
      GetPartNumber()
    },
    handleTimeType(val) {
      console.log(val)
    },
    handleSetShift() {
      let res = this.getShift(this.shiftInfo, this.value3)
      console.log(res)
    },
    getUserShift(shiftInfo, dt) {
      let shift = [];
      let d = new Date(dt)
      let currentHours = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600

      Object.keys(shiftInfo).forEach(key => {
        if (shiftInfo[key].isSpan && (shiftInfo[key].start <= currentHours && currentHours <= 24 || currentHours >= 0 && currentHours < shiftInfo[key].end)) {
          shift = [key]
        } else if (currentHours >= shiftInfo[key].start && currentHours < shiftInfo[key].end) {
          shift = [key]
        }
      })

      return shift
    },
    getShift(shiftInfo, dt) {
      let currentShift = this.getUserShift(shiftInfo, dt)
      let shift = { sTime: '', eTime: '' };
      let d = new Date(dt)
      // debugger
      let item = shiftInfo[currentShift[0]]

      if (item.isSpan) {
        let oDate = new Date(dt);
        let hour = oDate.getHours() + oDate.getMinutes() / 60 + oDate.getSeconds() / 3600
        if (hour >= 0 && hour < item.end) {
          oDate.setDate(d.getDate() - 1)
          shift.sTime = `${oDate.format('yyyy-MM-dd')} ${item.s_start}`
          shift.eTime = `${d.format('yyyy-MM-dd')} ${item.s_end}`
        } else if (hour >= item.start && hour < 24) {
          oDate.setDate(d.getDate() + 1)
          shift.sTime = `${d.format('yyyy-MM-dd')} ${item.s_start}`
          shift.eTime = `${oDate.format('yyyy-MM-dd')} ${item.s_end}`
        }

      } else {
        shift.sTime = `${d.format('yyyy-MM-dd')} ${item.s_start}`
        shift.eTime = `${d.format('yyyy-MM-dd')} ${item.s_end}`
      }

      return shift
    }

  }
}
</script>
<style scoped lang="scss"></style>
