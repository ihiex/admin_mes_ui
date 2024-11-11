<template>
  <div class="vab-ad">
    <el-carousel v-if="$store.getters['stationSet/announcement']" height="30px" direction="vertical" :autoplay="true"
      :interval="3000" indicator-position="none">
      <!-- <el-carousel-item v-for="(item, index) in $store.getters['stationSet/announcement']" :key="index"> -->
      <el-carousel-item style="position: relative;">
        <span v-for="(item, index) in $store.getters['stationSet/announcement']" :key="index" style="margin-right: 10px;">
          <el-tag type="warning">{{ item.title }}</el-tag>
          <a target="">{{ item.desc }}</a>
        </span>
        <span v-if="networkError" class="network_error">
          <!-- <el-tag type="danger" size="small">网络错误:</el-tag> -->
          <a target="">{{ $t('NetworkError') }}</a>
        </span>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
/* 信息提示 公告*/
export default {
  name: 'VabAd',
  data() {
    return {
      networkError: false
    }
  },
  mounted() {
    let that = this
    window.ononline = function () {
      that.networkError = false
    }
    window.onoffline = function () {
      that.networkError = true
    }
  }
}
</script>
<style lang="scss" scoped>
.vab-ad {
  height: 30px;
  padding-right: $base-padding;
  padding-left: $base-padding;
  margin-bottom: -20px;
  line-height: 30px;
  // cursor: pointer;

  a {
    color: #999;
  }
}

.network_error {
  position: absolute;
  font-size: 20px;
  right: 0;
  animation: 10s RightLeftMove infinite linear;
  user-select: none;
  a{
    color: #ff0000;
  }
}

@keyframes RightLeftMove {
  0% {
    right: -10%;
  }

  25%{
    right: 25%;
  }

  50%{
    right: 50%;
  }

  75% {
    right: 75%;
  }

  100%{
    right: 110%;
  }
}</style>
