<template>
  <div v-loading="loading" class="app_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :show-fold="false"
      :total="total" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @search="handleSearch"
      @reset="handleReset" @add="handleAdd">
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('StartDateTime')">
                <el-date-picker v-model="form.CreateTimeStart" type="date" style="width: 100%;"
                  :placeholder="$t('optionDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('EndDateTime')">
                <el-date-picker v-model="form.CreateTimeEnd" type="date" style="width: 100%;"
                  :placeholder="$t('optionDate')"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Line')">
                <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Station')">
                <el-select v-model="form.StationID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Part')">
                <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in partOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('ProductionOrder')">
                <el-select v-model="form.ProductionOrderID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable
                  :filter-method="handleProductionFilter">
                  <el-option v-for="item in productionOrderOptions" :key="item.ID" :label="item.SN" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.SN }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="hidden-sm-and-up">
              <el-form-item :label="$t('keywords')">
                <el-input v-model.trim="form.LikeQuery" :placeholder="$t('keywords')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="table" style="height: 100%; display: flex; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;">
        <div style="height: 100%;width: 100%; overflow-y: auto;">
          <div v-for="item in listData" :key="item.Id" class="item_list">
            <div class="item">
              <div>
                <!-- FilePath -->
                <!-- {{ item.IMGURL }} -->
                <el-image style="width: 100px; height: 100px;" :src="$imgBaseUrl + item.IMGURL"
                  :preview-src-list="[$imgBaseUrl + item.IMGURL]" fit="scale-down" lazy>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div style="padding: 0 15px; box-sizing: border-box; width: 100%; position: relative;">
                <h1 style="margin: 5px 0; font-size: 20px; ">{{ item.CreateTime }}</h1>
                <div class="item_content" @click="ShowDetail(item)">
                  <p>
                    IP: {{ item.IP }}
                  </p>
                  <p>
                    {{ $t('Line') + ': ' + item.Line }}
                  </p>
                  <p>
                    {{ $t('Station') + ': ' + item.Station }}
                  </p>
                  <p>
                    {{ $t('status') + ': ' + feedbackStatus[item.IsFeedback] }}
                  </p>
                  <!-- (item.IsFeedback === '0' ? $t('NoResponse') : $t('Response')) -->
                </div>
                <!-- v-if="!item.Feedback" -->
                <div style="position: absolute; right: 20px; bottom: 0;">
                  <el-button size="mini" @click="handleClickItemContent(item)">{{ $t('Feedback') }}</el-button>
                  <el-button v-hasPermi="['problemFeedback/Delete']" type="danger" size="mini"
                    @click="handleDelete(item.ID)">{{ $t('delete') }}</el-button>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
        </div>
      </div>
    </z-query>

    <!-- <Add ref="Add"></Add> -->
    <Feedback ref="FeedbackRef" @getContent="getContent"></Feedback>
    <FeedbackDetail ref="FeedbackDetailRef" @getContent="getContent"></FeedbackDetail>
  </div>
</template>

<script>
// import { GetUploadFileById, GetAllUploadFile } from '@/api/basebasic.js'
// import Add from './add'
import Feedback from './feedback'
import FeedbackDetail from './feedbackDetail'
import { getUploadFileList, deleteScreenItem } from '@/api/basebasic.js'
import ZQuery from '@/components/configQuery/ZQuery.vue';
import { pageSize } from '@/config'
import {
  GetmesProductionOrder,
  GetmesStationType,
  GetmesLine,
  GetmesPart
} from '@/api/configCommon.js'

export default {
  name: 'ProblemFeedback',
  components: {
    // Add,
    ZQuery,
    Feedback,
    FeedbackDetail
  },
  data() {
    return {
      title: '问题反馈列表',
      value: '',
      path: '',
      listData: [],
      cacheData: [],
      loading: false,
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
      },
      total: 0,
      showAdd: false,
      productionOrderOptions: [],
      productionCache: [],
      lineOptions: [],
      partOptions: [],
      stationTypeOptions: [],
      feedbackStatus: {
        "0": this.$t('QuestionSubmit'),
        "1": this.$t('QuestionDispose'),
        "2": this.$t('UserConfirm')
      },
      ids: []
    }
  },
  mounted() {
    this.handleGetAll()
    this.getProductionOrder();
    this.getPart()
    this.getLine()
    this.getStationType()
    /*  let per = this.$store.getters['user/modulePermissions']
     let res = per.some(r => r === 'attributeConfig/Add')
     if (res) {
       this.showAdd = true
     } else {
       this.showAdd = false
     } */
  },
  methods: {
    handleDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.delete(id)
      }).catch(() => {
      });
    },
    delete(id) {
      deleteScreenItem(id).then(res => {
        if (res.Success) {
          /* if(this.ids && this.ids.length === 0){
            this.handleGetAll();
          } */
          this.handleGetAll();
        }
      })
    },
    getContent(val) {
      let obj = this.listData.find(res => res.ID === val.ID);
      if (obj) {
        Object.keys(val).forEach(k => {
          this.$set(obj, k, val[k])
        })
      }
    },
    ShowDetail(data) {
      // this.$router.push({ name: 'ProblemDetails', params: data })
      this.$refs.FeedbackDetailRef.show(data)
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
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
    getProductionOrder() {
      GetmesProductionOrder().then(res => {
        if (res.Success) {
          this.productionCache = [...res.ResData]
          this.productionOrderOptions = this.productionCache.slice(0, 100)
        }
      })
    },
    handleProductionFilter(val) {
      let r = this.productionCache.filter(res => res.SN.includes(val) || (res.ID + '').includes(val))
      this.productionOrderOptions = r.slice(0, 200)
    },
    handleReset() {
      Object.keys(this.form).forEach(key => {
        if (key != 'PageSize' && key != 'CurrentPageIndex') {
          this.$set(this.form, key, '')
        }
      })
    },
    handleSearch(val) {
      Object.keys(val).forEach(key => {
        this.$set(this.form, key, val[key])
      })
      this.handleGetAll()
    },
    handleClickItemContent(data) {
      this.$refs.FeedbackRef.show(data)
    },
    handleAdd() {
      this.$refs.Add.show()
    },
    handleGetAll() {
      this.listData = []
      this.loading = true
      let params = {}
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(this.form[key])) {
          params[key] = this.form[key].join(',')
        } else {
          params[key] = this.form[key]
        }
      })
      getUploadFileList(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.listData = data.Items
            this.total = data.TotalItems
          }
        } catch (error) {

        } finally {
          this.loading = false
        }
      }, error => {
        this.loading = false
      })
    }
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

.app_container {
  box-sizing: border-box;

  .item_title {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 101;
    margin: 0;
    padding: 10px;
    box-shadow: #ccc 1px 1px 8px 1px;

    .el-button {
      position: absolute;
      right: 10px;
      top: 7px;
    }
  }

  .item_list {
    height: 120px;
    width: 100%;
    padding: 15px 25px;
    box-sizing: border-box;

    // border-bottom: 1px solid #ccc;
    .item {
      display: flex;
      flex-direction: row;

      .item_content {
        // border: 1px solid red;
        padding: 0;
        margin: 0;
        // height: 65px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% - 100px);
        display: -webkit-box;
        -webkit-line-clamp: 4;
        word-break: break-all;
        -webkit-box-orient: vertical;

        p {
          padding: 0;
          margin: 0;
        }

      }
    }
  }
}
</style>
