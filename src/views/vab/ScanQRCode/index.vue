<template>
  <div class="scan_qr_code">
    <div style="width: 200px; padding: 10px;">
      <ZScanQRCode v-model="val" @change="handleChange" @input="handleInput"></ZScanQRCode>
    </div>
  </div>
</template>

<script>
import ZScanQRCode from '@/components/ZScanQRCode'
export default {
  name: 'ScanQRCode',
  components: {
    ZScanQRCode
  },
  data() {
    return {
      val: ''
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    handleInput(val){
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.scan_qr_code {
  height: inherit;
  // padding: 10px;
  box-sizing: border-box;
  background-color: #fff
}
</style>