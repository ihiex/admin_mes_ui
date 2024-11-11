<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
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
        <el-form-item :label="$t('DeviceSN')" prop="SN">
          <el-input v-model="form.SN" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('MaximumUsage')" prop="MaxUseQuantity">
          <el-input v-model="form.MaxUseQuantity" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('RunCapacityQTY')" prop="RuningCapacityQuantity">
          <el-input v-model="form.RuningCapacityQuantity" type="number" :placeholder="$t('pleaseInput')"
            clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('CapacityQTY')" prop="CapacityQuantity">
          <el-input v-model="form.CapacityQuantity" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
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

        <el-form-item :label="$t('WarningState')" prop="WarningStatus">
          <el-select v-model="form.WarningStatus" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in warningStateOptions" :key="item.Key" :label="item.Value" :value="item.Key">
              <div class="select_option">
                <span>{{ item.Value }}</span>
                <span>{{ item.Key }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('CheckState')" prop="CheckStatus">
          <el-select v-model="form.CheckStatus" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in checkOptions" :key="item.value" :label="item.label" :value="item.value">
              <div class="select_option">
                <span>{{ item.label }}</span>
                <span>{{ item.value }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('BindStationType')" prop="ValidFrom">
          <el-select v-model="form.ValidFrom" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" :reserve-keyword="true" multiple filterable clearable>
            <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 需改成下拉 -->
        <el-form-item :label="$t('EffectiveDistribution')" prop="ValidDistribution">
          <el-select v-model="form.ValidDistributions" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" :reserve-keyword="true" value-key="ID" multiple filterable clearable>
            <el-option v-for="item in stationTypes" :key="item.ID" :label="item.Description" :value="item">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <!-- <span style="width: 60px">{{ item.ID }}</span> -->
                <span @click.stop.prevent>
                  <el-input v-model.number="item.Count" type="number"
                    @input="handleInputCount(item.Count, item)"></el-input>
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('UnbindStationType')" prop="ValidTo">
          <el-select v-model="form.ValidTo" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            :reserve-keyword="true" multiple filterable clearable>
            <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Status')" prop="StatusID">
          <el-select v-model="form.StatusID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in machineStatusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('ParentFixture')" prop="ParentFixture">
          <el-select v-model="form.ParentFixture" :placeholder="$t('pleaseSelect')" value-key="ID" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in parentOption" :key="item.ID" :label="item.SN" :value="item">
              <div class="select_option">
                <span>{{ item.SN }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
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
  MachineInsertAsync,
  MachineUpdateAsync,
  MachineCloneAsync,
  getMachineFamily,
  GetWarningState, //警告状态
} from '@/api/config.js'
import {
  GetmesStationType,
  GetmesPart,
  GetluMachineStatus, //设备状态
  FindWithAllPagerAsync
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        ID: 0,
        ParentFixture: ''
      },
      stationTypeOptions: [],
      stationTypes: [],
      partOptions: [],
      machineFamilyOptions: [],
      machineStatusOptions: [],
      warningStateOptions: [],
      parentOption: [],
      checkOptions: [
        {
          value: 0,
          label: this.$t('NoCheck')
        },
        {
          value: 1,
          label: this.$t('ConsistencyCheck')
        }
      ],
      title: '',
      loading: false,
      flag: '',
      rules: {
        StationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],

        SN: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' }
        ],

        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        MaxUseQuantity: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' }
        ],
        MachineFamilyID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        StatusID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        WarningStatus: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
      multipleSelection: [],
      refresh: true
    }//设备SN 手输
  },

  methods: {
    getParentOption() {
      this.parentOption = []
      FindWithAllPagerAsync().then(res => {
        if (res.ResData && res.Success) {
          this.parentOption = [...res.ResData]
        }
      })
    },
    handleInputCount(val, row) {
      if (!val) {
        this.$set(row, 'Count', 1)
      }
      this.form.ValidDistributions.forEach(res => {
        if (res.ID === row.ID) {
          this.$set(res, 'Count', val)
        }
      })
    },
    getWarningState() {
      GetWarningState().then(res => {
        if (res.Success) {
          this.warningStateOptions = [...res.ResData]
        }
      })
    },
    getMachineStatus() {
      GetluMachineStatus().then(res => {
        if (res.Success) {
          this.machineStatusOptions = [...res.ResData]
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
          this.stationTypes = JSON.parse(JSON.stringify(this.stationTypeOptions))
          this.stationTypes.forEach(item => {
            this.$set(item, 'Count', 1)
          })
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
      this.getWarningState();
      this.getMachineStatus();
      this.getParentOption();

      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'WarningStatus') {
            this.$set(this.form, key, item[key] + '')
          } else {
            if (key === 'ValidFrom' || key === 'ValidTo') {
              let arr = item[key].split(';');
              arr.forEach((item, index) => {
                arr[index] = parseInt(item)
              })
              this.$set(this.form, key, arr)
            } else {
              this.$set(this.form, key, item[key])
            }

          }
        })
        if(item.ParentID){
          this.$set(this.form, 'ParentFixture', {
            ID: item.ParentID,
            SN: item.ParentName
          })
        }
        console.log(this.form)
        item.ValidDistributions.forEach((res, index) => {
          this.stationTypes.find(item => {
            if (item.ID === res.ID) {
              this.$set(item, 'Count', res.Count)
            }
          })
        })
        console.log(this.form)
      }
      this.dialogVisible = true
    },
    formatValidAllot(list) {
      let arr = []
      list.forEach(res => {
        arr.push(res.ID + ',' + parseInt(res.Count))
      })
      return arr.join(';')
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = {};
          Object.keys(this.form).forEach(key => {
            if (this.form[key] && Array.isArray(this.form[key]) && key !== 'ValidDistributions' && key != 'ValidFroms' && key != 'ValidTos') {
              this.$set(params, key, this.form[key].join(';'))
            } else {
              this.$set(params, key, this.form[key])
            }
          })

          if(this.form.ParentFixture){
            this.$set(params, 'ParentID', this.form.ParentFixture.ID)
            this.$set(params, 'ParentName', this.form.ParentFixture.SN)
          }else{
            this.$set(params, 'ParentID', null)
            this.$set(params, 'ParentName', '')
          }

          this.$set(params, 'ValidDistribution', this.formatValidAllot(this.form.ValidDistributions))

          if (this.flag === 'Edit') {
            MachineUpdateAsync(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            MachineInsertAsync(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            MachineCloneAsync(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
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
  },
}
</script>

<style lang="scss" scoped></style>
