<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="false" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false" @search="handleSearch"
      @reset="handleReset">
      <el-button slot="button" @click="handleUnlock">{{ $t('unlock') }}</el-button>
      <el-button slot="button" @click="handleImport">{{ $t('ImportBarcode') }}</el-button>
      <div slot="table" style="height: 100%;">
        <el-table ref="SNLockAndUnlockRef" :data="tableData" style="width: 100%;" height="100%"
          :row-style="handleRowStyle" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="SN" :label="$t('SN')" sortable min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LockMessage" :label="$t('LockReason')" sortable min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LockTime" :label="$t('date')" sortable min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </z-query>
    <ImportDialog ref="ImportDialogRef" @confirm="handleSearch"></ImportDialog>
  </div>
</template>

<script>
import {
  LockSNFindWithPagerSearchAsync,
  LockSNAsync
} from '@/api/config.js'
import mixin from '@/views/configManagement/mixin/index.js';
import { pageSize } from '@/config'
import ImportDialog from './importDialog.vue'

/* 条码锁定与解锁 */
export default {
  name: 'SNLockAndUnlock',
  components: {
    ImportDialog
  },
  mixins: [mixin],
  data() {
    return {
      title: '条码锁定与解锁',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        Keywords: '',
        "EnCode": "",
        "Order": "",
        "Sort": ""
      },
    }
  },
  mounted() {
    this.handleSearch();

    /* let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'SNLockAndUnlock/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    } */
  },
  methods: {
    handleUnlock() {
      if (this.selectList && this.selectList.length == 0) {
        return this.$message.warning(this.$t('SelectTheBarcodeYouWantToUnlock'))
      }
      this.$confirm(this.$t('unlock'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let sns = this.selectList.map(res => res.SN)
        LockSNAsync({ SNs: sns, isLock: false, lockMess: '' }).then(res => {
          if (res.Success) {
            this.handleSearch();
          }
        })

      }).catch(() => {

      });

    },
    handleImport() {
      this.$refs.ImportDialogRef.show()
    },

    handleSearch(item) {
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, 'CurrentPageIndex', 1)
      }
      this.tableData = []
      this.getData()
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.form))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.loading = true
      LockSNFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        console.log(data)
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
          this.$nextTick(function () {
            this.tableData.forEach(row => {
              this.$refs.SNLockAndUnlockRef.toggleRowSelection(row, true)
            })
          })
        }
        this.loading = false;
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  background-color: #fff;
  height: inherit;

  .el-table__expanded-cell {

    .el-row {
      margin: 2px 0;

      &:hover {
        &>.el-col {
          background-color: #ccc;
        }
      }
    }
  }

  ::v-deep {

    .el-table__expanded-cell[class*=cell] {
      padding: 0 50px;
      background-color: transparent !important
    }
  }
}
</style>
