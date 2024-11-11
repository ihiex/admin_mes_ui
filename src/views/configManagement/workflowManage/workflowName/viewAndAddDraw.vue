<!--
 * @Author: Jason.zou jason.zou1986@gmail.com
 * @Date: 2024-03-13 09:25:15
 * @LastEditors: Jason.zou jason.zou1986@gmail.com
 * @LastEditTime: 2024-08-26 17:43:37
 * @FilePath: \NewSFC_Web_UI\src\views\configManagement\workflowManage\workflowName\viewAndAddDraw.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="100%" hight="100vh"
    style="background-color: antiquewhite;" :close-on-click-modal="false" :fullscreen="true" :destroy-on-close="true"
    :before-close="handleClose">
    <div v-loading="loading" style="height: calc(100vh - 120px);">
      <Draw ref="Draw" @save="confirm"></Draw>
    </div>
    <!-- <div style="text-align: right;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirm()">{{ $t('confirm') }}</el-button>
      </span>
    </div> -->
  </el-dialog>
</template>

<script>
import Draw from 'go-draw'
import { ShowXMLRouteV2, SaveXMLRouteV2, ShowRouteHistory, WorkflowNameUndo } from '@/api/config'

export default {
  name: 'ViewAndAddDraw',
  components: {
    Draw
  },
  data() {
    return {
      dialogVisible: false,
      title: '',
      loading: false,
      flag: '',
      params: {}
    }
  },
  methods: {
    show(title, flag, item) {
      this.params = { ...item }
      this.flag = flag
      if (this.flag != 'ReturnDraw') {
        this.title = title + ' ' + item.Name
        this.getDrawData({ Id: item.ID })
      } else {
        this.title = title + ' ' + item.CreateDate
        this.getShowHistory(item)
      }

      this.dialogVisible = true
    },
    getShowHistory(params) {
      this.loading = true;
      ShowRouteHistory({ Id: params.ID }).then(res => {
        if (res.Success) {
          this.$refs.Draw.show(res.ResData, false)
        }
        this.loading = false;
      })
    },
    getDrawData(params) {
      this.loading = true;
      ShowXMLRouteV2(params).then(res => {
        if (res.Success) {
          this.$refs.Draw.show(res.ResData, this.flag === 'view')
        }
        this.loading = false;
      })
    },
    confirm(data) {
      // console.log(data)
      if (this.flag === 'ReturnDraw') {
        /* WorkflowNameUndo({ RouteId: this.params.RouteID, HistoryId: this.params.ID }).then(res => {
          if (res.Success) {
            this.handleClose()
          }
        }) */
        SaveXMLRouteV2({ Id: this.params.RouteID, XMLRouteV2: data }).then(res => {
          if (res.Success) {
            this.handleClose()
          }
        })
      } else {
        SaveXMLRouteV2({ Id: this.params.ID, XMLRouteV2: data }).then(res => {
          if (res.Success) {
            this.handleClose()
          }
        })
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
