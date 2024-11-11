<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('SNFormat')" prop="SNFormatID">
          <el-select v-model="form.SNFormatID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable disabled>
            <el-option v-for="item in SNFormatOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('NodeTypes')" prop="SectionTypeID">
          <el-select v-model="form.SectionTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable @change="handleNodeTypeChange">
            <el-option v-for="item in nodeTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 节点参数 -->
        <!-- 存储过程 -->
        <el-form-item v-if="form.SectionTypeID && form.SectionTypeID == 2" :label="$t('NodeParams')" prop="SectionParam"
          :rules="[
            { required: true, message: $t('pleaseSelect'), trigger: 'change' }
          ]">
          <el-select v-model="form.SectionParam" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in paramsOptions" :key="item.ID" :label="item.Name" :value="item.Name">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 日期时间、计数 -->
        <el-form-item v-else-if="form.SectionTypeID && (form.SectionTypeID == 3 || form.SectionTypeID == 4)"
          :label="$t('NodeParams')" :rules="[
            { required: true, message: $t('canNotBeEmpty'), trigger: ['blur', 'change'] },
          ]" prop="SectionParam">
          <ZPopover v-model.trim="form.SectionParam" :options="cdOptions" :disabled="isEdit"></ZPopover>
        </el-form-item>
        <!-- 固定值 -->
        <el-form-item v-else :label="$t('NodeParams')" prop="SectionParam" :rules="[
          { required: true, message: $t('canNotBeEmpty'), trigger: 'blur' },
        ]">
          <el-input v-model="form.SectionParam" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <!-- 增量 -->
        <el-form-item :label="$t('Increment')" prop="Increment" :rules="[
          { required: form.SectionTypeID && form.SectionTypeID == 4 ? true : false, message: $t('pleaseSelect'), trigger: 'blur' }
        ]">
          <el-input v-model="form.Increment" type="number" :placeholder="$t('pleaseInput')" clearable
            :disabled="isIncrement"></el-input>
        </el-form-item>
        <!-- 无效字符 -->
        <el-form-item :label="$t('InvalidChar')" prop="InvalidChar">
          <el-input v-model="form.InvalidChar" :placeholder="$t('pleaseInput')" clearable
            :disabled="isInvalidChar"></el-input>
        </el-form-item>
        <!-- 允许重置 -->
        <el-form-item :label="$t('AllowReset')" prop="AllowReset" :rules="[
          { required: !isAllowReset, message: $t('pleaseSelect'), trigger: 'change' }
        ]">
          <el-select v-model="form.AllowReset" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable :disabled="isAllowReset">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Order')" prop="Order">
          <el-input v-model="form.Order" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <!-- 计数 为dhaon时 显示-->
        <template v-if="form.SectionTypeID && form.SectionTypeID == 4 && RegExp(/[dhaon]+/g).test(form.SectionParam)">
          <el-card v-for="(obj, index) in form.List_SNRange" :key="index" class="box-card add_SN">
            <el-form-item :label="$t('Start')" :prop="'List_SNRange.' + index + '.Start'" :rules="[
              { required: true, message: $t('canNotBeEmpty'), trigger: ['blur', 'change'] },
              { validator: validatePass, trigger: ['blur', 'change'] },
            ]">
              <ZSelect :ref="'ZSelect1' + index" v-model.trim="obj.Start"
                :target-value="form.SectionParam.replace(/[^dhaon]/g, '')" :disabled="obj.isEdit"></ZSelect>
            </el-form-item>
            <el-form-item :label="$t('End')" :prop="'List_SNRange.' + index + '.End'" :rules="[
              { required: true, message: $t('canNotBeEmpty'), trigger: ['blur', 'change'] },
              { validator: validatePass, trigger: ['blur', 'change'] },
            ]">
              <ZSelect :ref="'ZSelect2' + index" v-model.trim="obj.End"
                :target-value="form.SectionParam.replace(/[^dhaon]/g, '')" :disabled="obj.isEdit"></ZSelect>
            </el-form-item>
            <el-form-item :label="$t('Status')" :prop="'List_SNRange.' + index + '.StatusID'" :rules="[
              { required: true, message: $t('pleaseSelect'), trigger: 'change' },
            ]">
              <el-select v-model="obj.StatusID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                :collapse-tags="true" clearable :disabled="obj.isEdit">
                <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                  <div class="select_option">
                    <span>{{ item.Description }}</span>
                    <span>{{ item.ID }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Order')" :prop="'List_SNRange.' + index + '.Order'" :rules="[
              { required: true, message: $t('canNotBeEmpty'), trigger: 'blur' },
            ]">
              <el-input v-model="obj.Order" type="number" clearable :disabled="obj.isEdit"></el-input>
            </el-form-item>
            <div class="add_btn">
              <i class="el-icon-plus" @click="handleIncrease(index)"></i>
              <i class="el-icon-minus" @click="handleMinus(index)"></i>
            </div>
          </el-card>
        </template>
      </el-form>
      <div style="text-align: right;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirm('form')">{{ $t('confirm') }}</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  SNFormatChildInsert,
  SNFormatChildUpdate,
} from '@/api/config.js'
import {
  GetSectionType,
  GetmesSNFormat,
  GetProcesureUDP,
  GetSectionStatus,
} from '@/api/configCommon.js'
import ZPopover from 'z-popover'
import ZSelect from '@/components/ZSelect'

export default {
  components: {
    ZPopover,
    ZSelect
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "SNFormatID": "",
        "SectionTypeID": "",
        "SectionParam": "",
        "Increment": "",
        "InvalidChar": "",
        "LastUsed": "",
        "Order": "",
        "AllowReset": false,
        "List_SNRange": []
      },
      options: [
        {
          value: true,
          label: 'true'
        },
        {
          value: false,
          label: 'false'
        }
      ],
      title: '',
      loading: false,
      isAllowReset: false,
      isIncrement: false,
      isInvalidChar: false,
      nodeTypeOptions: [],
      SNFormatOptions: [],
      storedProcedureOptions: [],
      paramsOptions: [],
      rules: {
        Order: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        /*  SectionParam: [
           { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
         ], */
        /*  AllowReset: [
           { required: !this.isAllowReset, message: this.$t('pleaseSelect'), trigger: 'change' }
         ], */
        SNFormatID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        SectionTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
      counterOptions: [
        { value: 'd', id: 'D', label: "Decimal number(0-9)" },
        { value: 'h', id: 'H', label: "Hexadecimal number(0-9, A-F)" },
        { value: 'a', id: 'A', label: "Alphabetical counter(A-Z)" },
        { value: 'o', id: 'O', label: "Octal counter(0-8)" },
        { value: 'n', id: 'N', label: "Alphanumeric counter(0-9, A-Z)" },
        { value: 'y', id: 'Y', label: "Year digit(1 to 4 digits)-- > y" },
        { value: 'v', id: 'V', label: "Year digit of the Man - Week(1 to 4 digits)-- > y" },
        { value: 'm', id: 'M', label: "Month digit.Integer represents the month('mm': 01-12, 'm'-1-9, A, B, C)" },
        { value: 't', id: 'T', label: "Day of month. Count from 1 to 31.('tt': 01-31, 't'-1-9, A-V)" },
        { value: 'c', id: 'C', label: "Day of the week(1-7)" },
        { value: 'w', id: 'W', label: "Week number of the year or month('ww': 01-53 'w': 1-5)" },
      ],
      dateTimeOptions: [
        { value: 'y', id: 'Y', label: "Year: Representation of the year. (Y,YY,YYY,YYY)" },
        { value: 'v', id: 'V', label: "Year: Representation of the year of ManWeek. (VVV,VWV,vwWW)" },
        { value: 'm', id: 'M', label: "Month: Representation of the month. (M,MM)" },
        { value: 'd', id: 'D', label: "Day: Representation of the day in a month.(DD,D)" },
        { value: 'ww', id: 'WW', label: "Week: Representation of the week in a year.(ww)" },
        { value: 'w', id: 'W', label: "Week: Representation of the week in a month.(W)" },
        { value: 'h', id: 'H', label: "Hour(24): Representation of the 24 based hour.(HH,H)" },
        { value: 'nn', id: 'NN', label: "Minute: Representation of the minutes.(NN)" },
        { value: 'ss', id: 'SS', label: "Second: Representation of the seconds.(SS)" },
        { value: 'b', id: 'B', label: "Hour(12): Representation of 12 based hour(BB,B)." },
        { value: 'a', id: 'A', label: "'A' or 'p' indicates it is AM or PM.(A)" },
        { value: 'c', id: 'C', label: "Day: Representation of the day of week(C)" },
      ],
      cdOptions: [],
      statusOptions: [],
      isEdit: false,
      isShow: true
    }
  },
  watch: {
    "form.Increment": function (val, oval) {
      if (val && val < 1) {
        this.$set(this.form, 'Increment', 1)
      }
    },
    "form.List_SNRange": function (val, oval) {
      console.log(val)
    }
  },
  created() {

  },
  methods: {
    handleIncrease(index) {
      this.form.List_SNRange.splice(index + 1, 0, {
        "ID": "",
        "SNSectionID": "",
        "Start": "",
        "End": "",
        "Order": "",
        "StatusID": "",
        isEdit: false
      })
    },
    handleMinus(index) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.form.List_SNRange.splice(index, 1)
      }).catch(() => {
      });
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('canNotBeEmpty')));
      } else if (value.length != (this.form.SectionParam.replace(/[^dhaon]/g, '')).length) {
        callback(new Error(this.$t('ValueLengthError')));
      } else {
        callback();
      }
    },
    handleNodeTypeChange(val) {
      this.isAllowReset = false;
      this.isIncrement = false
      this.isInvalidChar = false
      this.$set(this.form, 'Increment', '')
      this.$set(this.form, 'InvalidChar', '')
      this.$set(this.form, 'SectionParam', '')
      this.$set(this.form, 'AllowReset', false)

      switch (val) {
        case '1':
          this.isIncrement = true
          this.isInvalidChar = true
          break;
        case '2':
          this.paramsOptions = this.storedProcedureOptions
          this.isIncrement = true
          this.isInvalidChar = true
          break;
        case '3':
          this.paramsOptions = []
          this.isIncrement = true
          this.isInvalidChar = true
          this.cdOptions = this.dateTimeOptions
          break;
        case '4':
          this.paramsOptions = []
          this.isAllowReset = true;
          this.$set(this.form, 'AllowReset', false)
          this.$set(this.form, 'Increment', 1)
          if (this.form.List_SNRange && Array.isArray(this.form.List_SNRange)) {
            if (this.form.List_SNRange.length === 0) {
              this.form.List_SNRange.push({
                "ID": "",
                "SNSectionID": "",
                "Start": "",
                "End": "",
                "Order": "",
                "StatusID": ""
              })
            }
          } else {
            this.$set(this.form, 'List_SNRange', [{
              "ID": "",
              "SNSectionID": "",
              "Start": "",
              "End": "",
              "Order": "",
              "StatusID": ""
            }])
          }
          this.cdOptions = this.counterOptions
          break;
        default:
      }
    },
    show(title, item, id) {
      this.getStationType()
      this.getSNFormat()
      this.getStoredProcedure()
      this.GetSectionStatus()
      this.dialogVisible = true

      this.title = title
      this.isEdit = false
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })

        this.isAllowReset = false;
        this.isIncrement = false
        this.isInvalidChar = false
        if (this.form.SectionTypeID == 1) {
          this.isIncrement = true
          this.isInvalidChar = true
        } else if (this.form.SectionTypeID == 2) {
          this.paramsOptions = this.storedProcedureOptions
          this.isIncrement = true
          this.isInvalidChar = true
        } else if (this.form.SectionTypeID == 3) {
          this.paramsOptions = []
          this.isIncrement = true
          this.isInvalidChar = true
          this.cdOptions = this.dateTimeOptions
        } else if (this.form.SectionTypeID == 4) {
          this.paramsOptions = []
          this.isAllowReset = true;
          this.cdOptions = this.counterOptions

          if (Array.isArray(this.form.List_SNRange) && this.form.List_SNRange.length == 0) {
            this.$set(this.form, "List_SNRange", [
              {
                "ID": "",
                "SNSectionID": "",
                "Start": "",
                "End": "",
                "Order": "",
                "StatusID": ""
              }
            ])
          }

          for (let obj of this.form.List_SNRange) {
            if (obj.StatusID && obj.StatusID != 0) {
              obj.isEdit = true;
            } else {
              obj.isEdit = false;
            }
          }

          let arr = JSON.parse(JSON.stringify(this.form.List_SNRange))
          this.form.List_SNRange.forEach(obj => {
            Object.keys(obj).forEach(k => {
              obj[k] = ''
            })
          })
          this.$nextTick(function () {
            arr.forEach((r, i) => {
              Object.keys(r).forEach(k => {
                this.form.List_SNRange[i][k] = r[k]
              })
            })
          })
        }

      } else if (id) {
        this.$set(this.form, 'ParentId', id)
        this.$set(this.form, 'SNFormatID', id)
        this.$set(this.form, 'List_SNRange', null)
      }
      console.log(this.form)
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$set(this.form, 'Increment', this.form.Increment + '')
          this.$set(this.form, 'Order', this.form.Order + '')
          this.loading = true
          if (this.form.ID) {
            SNFormatChildUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            SNFormatChildInsert({ ParentId: this.form.ParentId }, this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                // this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          }
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.form = {}
      this.dialogVisible = false
    },
    getStoredProcedure() {
      GetProcesureUDP().then(res => {
        if (res.Success) {
          this.storedProcedureOptions = [...res.ResData]
          this.storedProcedureOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getStationType() {
      GetSectionType().then(res => {
        if (res.Success) {
          this.nodeTypeOptions = [...res.ResData]
          this.nodeTypeOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getSNFormat() {
      GetmesSNFormat().then(res => {
        if (res.Success) {
          this.SNFormatOptions = [...res.ResData]
          this.SNFormatOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    GetSectionStatus() {
      GetSectionStatus().then(res => {
        if (res.Success) {
          this.statusOptions = res.ResData
          this.statusOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.add_SN {
  position: relative;
  padding-right: 30px;

  .add_btn {
    position: absolute;
    right: 5px;
    top: 35%;
    z-index: 100;

    &>i {
      display: none;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin: 5px 0;
      cursor: pointer;
      font-size: 22px;
    }

  }

  &:hover {
    .add_btn {

      &>i {
        display: block;
      }
    }
  }
}
</style>
