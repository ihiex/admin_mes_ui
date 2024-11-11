<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-form-item :label="$t('ParentPart')" prop="ParentPartID">
          <el-select v-model="form.ParentPartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.PartNumber" :value="item.ID">
              <div class="select_option">
                <span>{{ item.PartNumber }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.PartNumber" :value="item.ID">
              <div class="select_option">
                <span>{{ item.PartNumber }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('StationType')" prop="StationTypeID">
          <!-- <el-input v-model="form.StationTypeID" :placeholder="$t('pleaseInput')" clearable></el-input> -->
          <el-select v-model="form.StationTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in stationOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SEQ" prop="SEQ">
         <!--  <el-select v-model="form.SEQ" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
            </el-option>
          </el-select> -->
          <el-input v-model.number="form.SEQ" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>

        </el-form-item>
        <el-form-item :label="$t('Status')" prop="Status">
          <el-select v-model="form.Status" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
  BOMProductStructureInsertAsync,
  BOMProductStructureUpdateAsync,
  PartFindWithAllPagerAsync
} from '@/api/config.js'
import { GetmesStationType, GetsysStatus } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      statusOptions: [],
      partOptions: [],
      stationOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        ParentPartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        StationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        Status: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },

  methods: {
    show(title, flag, item) {
      this.getPartOptions();
      this.getStationType();
      this.getStatus();
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
          // this.$set(this.form, key, item[key] + '')
        })
        // this.getPartFamilyOptions(item.PartFamilyTypeID)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            BOMProductStructureUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            BOMProductStructureInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } /* else {
            MesLineClone(this.form).then(res => {
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
    getPartOptions() {
      PartFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationOptions = [...res.ResData]
        }
      })
    },
    getStatus() {
      GetsysStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
