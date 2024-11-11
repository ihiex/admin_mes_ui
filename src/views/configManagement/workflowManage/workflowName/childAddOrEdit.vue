<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('PathName')" prop="RouteID">
          <el-select v-model="form.RouteID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable disabled>
            <el-option v-for="item in pathNameOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('StationType')" prop="StationTypeID">
          <el-select v-model="form.StationTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Unit_State')" prop="UnitStateID">
          <el-select v-model="form.UnitStateID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in unitStateOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Order')" prop="SequenceMod">
          <el-input v-model="form.SequenceMod" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
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
  WorkflowConfigInsert,
  WorkflowConfigUpdate,
} from '@/api/config.js'
import {
  GetmesStationType,
  GetmesRoute,
  GetmesUnitState
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "RouteID": "",
        "StationTypeID": "",
        "UnitStateID": "",
        "SequenceMod": "",
        "Sequence": "",
        "Description": ""
      },
      title: '',
      loading: false,
      isAllowReset: false,
      isIncrement: false,
      isInvalidChar: false,
      stationTypeOptions: [],
      pathNameOptions: [],
      unitStateOptions: [],
      rules: {
        SequenceMod: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        RouteID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        StationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        UnitStateID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
      cachesRow: [],
      isAdd: true
    }
  },
  created() {

  },
  methods: {

    show(title, item, row) {
      this.getStationType()
      this.getPathName()
      this.GetUnitState()
      this.dialogVisible = true
      this.cachesRow = row;
      this.title = title
      this.isAdd = true
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
        this.isAdd = false
      } else if (row) {
        this.$set(this.form, 'ID', row.ID)
        this.$set(this.form, 'RouteID', row.ID)
      }
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (!this.isAdd) {
            WorkflowConfigUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.cachesRow)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkflowConfigInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.cachesRow)
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
      this.form = {
        "ID": "",
        "RouteID": "",
        "StationTypeID": "",
        "UnitStateID": "",
        "SequenceMod": "",
        "Sequence": "",
        "Description": ""
      }
      this.dialogVisible = false
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
          this.stationTypeOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getPathName() {
      GetmesRoute().then(res => {
        if (res.Success) {
          this.pathNameOptions = [...res.ResData]
          this.pathNameOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    GetUnitState() {
      GetmesUnitState().then(res => {
        if (res.Success) {
          this.unitStateOptions = res.ResData
          this.unitStateOptions.forEach(item => {
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
