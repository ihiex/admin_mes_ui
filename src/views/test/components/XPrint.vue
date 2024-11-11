<template>
  <el-dialog title="Print server" :visible.sync="dialogVisible" width="820px" :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="box-sizing: border-box; width: inherit; height: 600px; overflow-y: auto;">
      <div :id="id" style="background-color: #fff;">
        <div
          style="height: 700px; width: 460px; box-sizing: border-box; border: 2px solid #ccc; border-radius: 10px; overflow: hidden;">
          <!-- <p v-for="item in 100" :key="item">{{ item }}</p> -->
          <!-- <div v-for="(item, index) in list" :key="index" style="font-size: 40px; font-weight: 800; margin: 20px 0; padding: 10px 0;"> -->
          <!-- <span style="display: inline-block; width: 100%; text-align: center;">
              {{ item.title }}
            </span> -->
          <!-- <span style="display: inline-block; width: 100%; text-align: center;">
              {{ item.subTitle }}
            </span>
          </div> -->

          <!--  <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 800; padding: 5px; margin-top: 20px;">
              COSMO 3厂机房巡检
            </div>
            <img src="../images/3.png" alt="#" style="width: 250px; height: 250px;">
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 800; padding: 5px; margin-top: 55px;">
              COSMO 3B厂机房巡检
            </div>
            <img src="../images/3B.png" alt="#" style="width: 250px; height: 250px;">
          </div> -->
          <div v-for="item in 40" :key="item" style="width: 100%; font-weight: 600; text-align: right; padding: 0; margin: 0;">
            {{item}}-a123456789b123456789c123456789d123456789e123456789f12345
          </div>
         <!--  <div style="height: 40px; width: 100%; line-height: 40px;font-weight: 600; text-align: right;">
            2-a123456789b123456789c123456789d123456789e123456789f12345
          </div> -->
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-print="`#${id}`" type="primary" @click="dialogVisible = false">打 印</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { uuid } from '@/utils'
// import VueQr from 'vue-qr'
// import Img3 form '../images/3.jpg'

export default {
  name: 'XPrint',
  components: {
    // VueQr
  },
  data() {
    return {
      dialogVisible: false,
      id: uuid(),
      list: []

            /* [data[1], data[2]] */,

    }
  },
  mounted() {
    let item = {
      // title: 'IT 已检查',
      subTitle: '须拿到IT处理'
    }

    for (let i = 0; i < 7; i++) {
      this.list.push(item)
    }
  },
  methods: {
    show() {
      // debugger
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
