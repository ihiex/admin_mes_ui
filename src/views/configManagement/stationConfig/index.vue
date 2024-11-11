<template>
  <div v-loading="loading" class="page_container">
    <div class="station_title">
      <h1>{{ $t('stationSet') }}</h1>
      <el-button type="primary" @click="submitForm('ruleForm')">
        {{ $t('save') }}
      </el-button>
    </div>
    <el-form
      ref="ruleForm"
      label-position="left"
      label-width="60px"
      :model="form"
    >
      <div
        v-for="(res, index) in form.stationList"
        :key="index"
        class="form_container"
      >
        <el-form-item
          :label="$t('Line')"
          :prop="'stationList.' + index + '.line'"
          :rules="{
            required: true,
            message: $t('PleaseSelectTheLine'),
            trigger: 'change',
          }"
        >
          <el-select
            v-model="res.line"
            style="width: 100%"
            clearable
            filterable
            :placeholder="$t('pleaseSelect')"
            value-key="ID"
            @change="handleLineChange($event, index)"
            @clear="handleLineClear(index)"
          >
            <el-option
              v-for="item in MesLine"
              :key="item.ID"
              :label="item.Description"
              :value="item"
            >
              <div class="option_container">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Station')"
          :prop="'stationList.' + index + '.station'"
          :rules="{
            required: true,
            message: $t('PleaseSelectTheStation'),
            trigger: 'change',
          }"
        >
          <el-select
            v-model="res.station"
            style="width: 100%"
            clearable
            filterable
            :placeholder="$t('pleaseSelect')"
            value-key="ID"
            @change="handleStationChange(res.station, index)"
          >
            <el-option
              v-for="item in options[index]"
              :key="item.ID"
              :label="item.Description"
              :value="item"
            >
              <div class="option_container">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Alias')"
          :prop="'stationList.' + index + '.pseudonym'"
          style="margin: 0"
          :rules="[
            { required: true, validator: pseudonymValidator, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model.trim="res.pseudonym"
            style="width: 100%"
            clearable
          ></el-input>
        </el-form-item>
        <div class="add_btn">
          <span class="el-icon-plus" @click.stop.prevent="add"></span>
          <span class="el-icon-minus" @click.stop.prevent="minus(index)"></span>
        </div>
      </div>
    </el-form>

    <!--  <div class="footer_btn">
      <el-button type="primary" @click="submitForm('ruleForm')">
        {{ $t('save') }}
      </el-button>
    </div> -->
  </div>
</template>

<script>
import IndexDB from 'indexdbforvue2'
import { mapActions, mapGetters } from 'vuex'
let { indexedDBName, indexedDBVersion } = require('@/config')
import { GetMesStation } from '@/api/common'
/* 配置管理 */
export default {
  name: 'StationConfig',
  data() {
    return {
      title: 'StationConfig',
      form: {
        stationList: [
          {
            line: null,
            pseudonym: '',
            station: null,
          },
        ],
      },
      options: [],
      db: new IndexDB(indexedDBName, indexedDBVersion, 't_station'),
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      MesLine: 'common/MesLine',
      MesStation: 'common/MesStation',
      srcCode: 'stationSet/srcTableCode',
    }),
  },
  mounted() {
    let that = this
    that.loading = true
    setTimeout(function () {
      that.db
        .getByKey('lineAndStation')
        .then((res) => {
          if (res.success) {
            let obj = res.data
            that.form.id = obj.id
            obj.stationList.forEach((item, index) => {
              that.$set(that.form.stationList, index, item)
              that.GetMesStation({ LineID: item.line.ID }, index)
            })
          }
          that.loading = false
        })
        .catch((error) => {
          that.loading = false
        })
    }, 1000)
    this.setMesLine()
  },
  methods: {
    add(val) {
      let obj = {
        line: null,
        station: null,
        pseudonym: '',
      }

      this.form.stationList.push(obj)
    },
    minus(val) {
      let dsc = this.form.stationList[val].station
      this.$confirm(
        // `删除${dsc ? '工站:' : ''} ${dsc ? dsc.Description : ''}, 是否继续?`,
        this.$t('deleteStationHint', {
          0: dsc ? this.$t('Station') + ':' : '',
          1: dsc ? dsc.Description : '',
        }),
        this.$t('hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.form.stationList.splice(val, 1)
          this.options.splice(val, 1)
          this.updateData()
          if (this.form.stationList.length === 0) {
            this.form.stationList.push({
              line: null,
              pseudonym: '',
              station: null,
            })
          }
        })
        .catch(() => {})
    },
    updateData() {
      this.db
        .update({ id: 'lineAndStation', ...this.form })
        .then((res) => {
          if (res.success) {
            this.$message({
              message: this.$t('successfullySet'),
              type: 'success',
            })
          } else {
            this.$message.error(this.$t('failedSet'))
          }
        })
        .catch((error) => {
          this.$message.error(`${this.$t('failedSet')}:` + error)
        })
    },
    ...mapActions({
      setMesLine: 'common/setMesLine',
      setMesStation: 'common/setMesStation',
      setTableCode: 'stationSet/setTableCode',
    }),
    handleStationChange(val, index) {
      this.form.stationList[index].pseudonym = val.Description
    },
    handleLineClear(index) {
      this.$set(this.form.stationList[index], 'station', null)
      this.GetMesStation({ LineID: '' }, index)
    },
    handleLineChange(val, index) {
      this.$set(this.form.stationList[index], 'station', null)
      this.GetMesStation({ LineID: val.ID }, index)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateData()
        } else {
          return false
        }
      })
    },
    GetMesStation(params, index) {
      GetMesStation(params).then((res) => {
        if (res.Success) {
          this.$set(this.options, index, res.ResData)
        }
      })
    },
    pseudonymValidator(rule, value, callback) {
      if (!value) {
        callback(new Error(this.$t('PleaseEnterAlias')))
      } else if (value.length < 2) {
        callback(new Error(this.$t('TheLengthCannotBeLessThan3')))
      } else {
        let count = 0
        this.form.stationList.forEach((el, index) => {
          if (el.pseudonym === value) {
            count++
          }
        })
        if (count > 1) {
          callback(new Error(this.$t('TheAliasIsRepeatedPleaseReenterIt')))
        } else {
          callback()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  position: relative;
  height: inherit;
  background-color: #fff;
  overflow: hidden;
  .el-form {
    border-top: 1px solid #efefef;
    padding-top: 20px;
    overflow: auto;
    height: calc(100vh - 243px);
    .form_container {
      position: relative;
      padding: 20px;
      width: 410px;
      margin: 0 15px 20px;
      border-radius: 5px;
      box-shadow: 2px 2px 15px 2px #e0e0e0;
      .el-form-item {
        width: 400px;
      }
      &:hover {
        .add_btn {
          display: block;
        }
      }
      .add_btn {
        display: none;
        position: absolute;
        right: -28px;
        bottom: -5px;
        span {
          display: block;
          border: 1px solid #aaa;
          border-radius: 5px;
          height: 20px;
          width: 20px;
          margin: 5px;
          cursor: pointer;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
  .station_title {
    width: 465px;
    position: relative;
    h1 {
      padding: 0 15px;
      font-size: 18px;
      font-weight: normal;
      display: inline-block;
    }
    .el-button {
      position: absolute;
      right: 0;
      top: 5px;
    }
  }
}
</style>
