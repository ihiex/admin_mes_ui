<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" :append-to-body="true"
    :close-on-click-modal="false" :destroy-on-close="true">
    <div class="dialog_content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="UPH" prop="UPH">
          <el-input v-model.number="ruleForm.UPH" type="number"></el-input>
        </el-form-item>

        <el-form-item label="YieldTarget" prop="YieldTarget">
          <el-input v-model.number="ruleForm.YieldTarget" type="number"></el-input>
        </el-form-item>

        <el-form-item :key="sKey" :label="$t('Shift')" prop="ShiftID">
          <el-select v-model="ruleForm.ShiftID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" :reserve-keyword="true" filterable :multiple="isAdd" clearable>
            <el-option v-for="item in shiftOptions" :key="item.ID" :label="item.ShiftCode" :value="item.ID">
              <div class="select_option">
                <span>{{ item.ShiftCode }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :key="lKey" :label="$t('Line')" prop="LineID">
          <el-select v-model="ruleForm.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" :reserve-keyword="true" filterable :multiple="isAdd" clearable>
            <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('status')" prop="State">
          <el-select v-model="ruleForm.State" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in stateOptions" :key="item.Id" :label="item.ItemName" :value="item.ItemCode">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <!-- <el-input v-model="value"></el-input> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <span style="position: absolute; left: 0;">
        <el-button v-hasPermi="['calendar/Delete']" type="danger" @click="handleBatchDelete">{{ $t('DeleteInBatches')
          }}</el-button>
        <el-button v-hasPermi="['calendar/Delete']" type="danger" @click="handleDelete">{{ $t('delete') }}</el-button>
      </span>
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button v-hasPermi="['calendar/Save']" type="primary" @click="handleConfirm">{{ $t('save') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { GetDictDataDetail } from '@/api/common'
import {
  GetmesLine,
} from '@/api/configCommon.js'
import {
  ShiftUPHDelete,
  ShiftUPHGetList,
  ShiftGetAllEnable,
  ShiftUPHUpdate,
  ShiftUPHInsert,
  ShiftUPHBatchInsert,
  ShiftUPHDeleteBulkAsync
} from '@/api/config.js'

import { uuid } from '@/utils'


export default {
  data() {
    return {
      dialogVisible: false,
      title: '添加事件',
      value: '',
      events: null,
      isAdd: true,
      ruleForm: {
        ShiftID: '',
        LineID: '',
        UPH: 270,
        YieldTarget: 98,
        CreateTime: '',
        UpdateTime: '',
        State: '1',
        ShiftDate: ''
      },
      rules: {
        ShiftID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        LineID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        State: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        YieldTarget: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' }
        ],
        UPH: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' }
        ]
      },
      stateOptions: [],
      shiftOptions: [],
      lineOptions: [],
      catchData: {},
      lKey: uuid(),
      sKey: uuid(),
    }
  },
  mounted() {
    this.getShift()
    this.getState()
    this.getLine()
  },
  methods: {
    handleBatchDelete() {
      this.$confirm(`${this.$t('isDelete')} ${this.catchData.startStr} / ${this.catchData.endStr} ${this.$t('FStatus999')}${this.$t('data')}`, this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {

        /*  this.checkedList.forEach((item, index) => {
           ShiftUPHDelete(item?.extendedProps).then(res => {
             if (res.Success) {
               item.remove();
               if (this.checkedList.length - 1 === index) {
                 this.checkedList.length = 0;
               }
             }
           })
         }) */
        let { endStr, startStr } = this.catchData
        let end = new Date(endStr);
        end = end.setDate(end.getDate() - 1)

        ShiftUPHDeleteBulkAsync({
          StartTime: startStr,
          EndTime: new Date(end).format('yyyy-MM-dd')
        }).then(res => {
          console.log(res)
          if (res.Success) {
            this.clearCache()
            this.dialogVisible = false
            this.$parent.getData()
          }
        })

      }).catch(() => {

      });
    },
    show(title, data, isAdd) {
      this.clearCache()

      this.sKey = uuid();
      this.lKey = uuid();

      this.catchData = data
      this.isAdd = isAdd
      this.events = data
      this.title = title;
      if (data.extendedProps) {
        if (isAdd) {
          this.$set(this.ruleForm, 'ShiftID', [])
          this.$set(this.ruleForm, 'LineID', [])
        } else {
          this.$set(this.ruleForm, 'ShiftID', data?.extendedProps?.ShiftID ?? '')
          this.$set(this.ruleForm, 'LineID', data?.extendedProps?.LineID ?? '')
        }

        this.$set(this.ruleForm, 'YieldTarget', data?.extendedProps?.YieldTarget ?? 98)
        this.$set(this.ruleForm, 'UPH', data?.extendedProps?.UPH ?? 270)
        this.$set(this.ruleForm, 'State', data?.extendedProps?.State + '' ?? '1')
        this.$set(this.ruleForm, 'ID', data?.extendedProps?.ID ?? '')
      }
      // console.log(data)
      this.dialogVisible = true
    },
    handleConfirm() {
      // debugger
      let { startStr, end, endStr } = this.catchData;
      // console.log(this.catchData)
      /*  let start = new Date(startStr)
       let end = new Date(endStr) */
      let params = JSON.parse(JSON.stringify(this.ruleForm))
      // 单个 新增
      /* Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }) */
      // for (; ;) {
      //   params.ShiftDate = new Date(start).format('yyyy-MM-dd hh:mm:ss')
      //   if (this.isAdd) {
      //     ShiftUPHInsert(params)
      //     // ShiftUPHBatchInsert(this.ruleForm)
      //   } else {
      //     ShiftUPHUpdate(params)
      //   }

      //   if (start.setDate(start.getDate() + 1) >= end) {
      //     this.$parent.getData()
      //     break;
      //   }
      // }
      // 批量新增

      if (this.isAdd) {
        // 只取整天
        let endStr = new Date(end)
        endStr.setDate(endStr.getDate() - 1)
        params.StartTime = startStr;
        params.EndTime = endStr.format('yyyy-MM-dd')
        params['ShiftIds'] = params.ShiftID
        params['LineIds'] = params.LineID
        delete params.ShiftID
        delete params.LineID
        delete params.CreateTime
        delete params.UpdateTime
        delete params.ShiftDate
        ShiftUPHBatchInsert(params).then(res => {
          if (res.Success) {
            this.$parent.getData()
          }
        })
      } else {
        Object.keys(params).forEach(key => {
          if (Array.isArray(params[key])) {
            params[key] = params[key].join(',')
          }
        })
        params.ShiftDate = startStr //new Date(start).format('yyyy-MM-dd hh:mm:ss')
        ShiftUPHUpdate(params).then(res => {
          if (res.Success) {
            this.$parent.getData()
          }
        })
      }

      this.dialogVisible = false
    },
    handleDelete() {
      // debugger
      let {startStr, endStr, title} = this.events

      if(!title){
        return this.$message.warning(this.$t('PleaseSelectAPieceOfDataThatCanBeDeleted'))
      }
      let hit = startStr + (endStr ? '--' + endStr : '')

      this.$confirm(this.$t('isDelete') + hit + ': ' + title + this.$t('data') + '?', this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        // this.$emit('delete', this.events)

        ShiftUPHDelete(this.catchData?.extendedProps).then(res => {
          if (res.Success) {
            // this.$parent.getData()
            this.events.remove()
          }
          this.dialogVisible = false
        }, error => {
          this.dialogVisible = false

        })

      }).catch(() => {

      });
    },

    clearCache() {
      Object.keys(this.ruleForm).forEach(key => {
        this.$set(this.ruleForm, key, '')
      })

      delete this.ruleForm.extendedProps

      this.$set(this.ruleForm, 'UPH', 270)
      this.$set(this.ruleForm, 'YieldTarget', 98)
      this.$set(this.ruleForm, 'State', '1')
    },

    getState() {
      GetDictDataDetail({ S_EnCode: 'ShiftStateItem' }).then(res => {
        if (res.Success) {
          this.stateOptions = [...res.ResData]
        }
      })
    },

    getShift() {
      ShiftGetAllEnable().then(res => {
        if (res.Success) {
          this.shiftOptions = [...res.ResData]
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
          /* this.lineOptions.forEach(item => {
            item.ID = item.ID + ''
          }) */
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.select_option {
  display: flex;
  justify-content: space-between;

  &>span:last-child {
    padding-left: 15px;
  }
}

.dialog_content {
  width: 100%;
  // border: 1px solid red;
  height: 300px;
}

.dialog-footer {
  width: 100%;
  display: inline-block;
  position: relative;
}
</style>
