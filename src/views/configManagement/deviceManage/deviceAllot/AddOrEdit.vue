<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item :label="$t('PathName')" prop="RouteID">
          <el-select v-model="form.RouteID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable clearable>
            <el-option v-for="item in pathNameOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('StationType')" prop="StationTypeID">
          <el-select v-model="form.StationTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('DeviceSN')" prop="MachineID">
          <el-select v-model="form.MachineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable clearable>
            <el-option v-for="item in SNOptions" :key="item.ID" :label="item.SN" :value="item.ID">
              <div class="select_option">
                <span>{{ item.SN }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable clearable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.PartNumber" :value="item.ID">
              <div class="select_option">
                <span>{{ item.PartNumber }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('DevicePart')" prop="MachinePartID">
          <el-select v-model="form.MachinePartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.PartNumber" :value="item.ID">
              <div class="select_option">
                <span>{{ item.PartNumber }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('DeviceFamily')" prop="MachineFamilyID">
          <el-select v-model="form.MachineFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in machineFamilyOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
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
  MachineRouteInsertAsync,
  MachineRouteUpdateAsync,
  // MachineRouteCloneAsync,
  getMachineFamily,
  getMachine, //设备SN

} from '@/api/config.js'
import { GetmesRoute, GetmesStationType, GetmesPart } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        ID: 0,
      },
      SNOptions: [],
      pathNameOptions: [],
      stationTypeOptions: [],
      partOptions: [],
      machineFamilyOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        RouteID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        StationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },

  methods: {
    getSN() {
      getMachine().then(res => {
        if (res.Success) {
          this.SNOptions = [...res.ResData]
        }
      })
    },
    getPathName() {
      GetmesRoute().then(res => {
        if (res.Success) {
          this.pathNameOptions = [...res.ResData]
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
        }
      })
    },
    getPart() {
      GetmesPart().then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
    getMachineFamily() {
      getMachineFamily().then(res => {
        if (res.Success) {
          this.machineFamilyOptions = [...res.ResData]
        }
      })
    },
    show(title, flag, item) {
      this.getMachineFamily();
      this.getStationType();
      this.getPart();
      this.getPathName();
      this.getSN();
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            MachineRouteUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            MachineRouteInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } /* else {
            MachineRouteCloneAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } */
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.form = {}
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
