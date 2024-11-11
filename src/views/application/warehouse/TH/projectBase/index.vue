<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false" @search="handleSearch"
      @add="handleAdd">
      <div slot="table" style="height: 100%;">
        <el-table :data="tableData" style="width: 100%;" height="100%">
          <el-table-column prop="FID" label="ID" sortable width="60"></el-table-column>
          <el-table-column prop="FProjectNO" :label="$t('Project')" sortable min-width="110"></el-table-column>
          <el-table-column prop="FCountByPallet" :label="$t('FullPalletQty')" sortable
            min-width="140"></el-table-column>
          <el-table-column prop="FCountByCase" :label="$t('FullBoxQty')" sortable min-width="140"></el-table-column>
          <el-table-column prop="FWeightByCase" :label="$t('WeightByBox')" sortable min-width="150"></el-table-column>
          <el-table-column prop="FWeightByPallet" :label="$t('WeightByPallet')" sortable
            min-width="150"></el-table-column>
          <el-table-column prop="FTotalWeight" :label="$t('TotalWeight')" sortable min-width="140"></el-table-column>
          <el-table-column prop="FWeightByEmptyPallet" :label="$t('WeightByEmptyPallet')" sortable
            min-width="180"></el-table-column>
          <el-table-column prop="FWeightByPiece" :label="$t('WeightByPiece')" sortable
            min-width="150"></el-table-column>
          <el-table-column prop="TypeID" :label="$t('TypeID')" sortable min-width="100"></el-table-column>
          <el-table-column prop="IsMixedPO" :label="$t('IsMixedPO')" sortable min-width="120">
            <template slot-scope="props">
              {{ props.row.IsMixedPO ? 'Yes' : 'No' }}
            </template>
          </el-table-column>
          <el-table-column prop="" :label="$t('operation')" fixed="right" width="130">
            <template slot-scope="props">
              <el-button v-hasPermi="['projectBase/EditTH']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['projectBase/DeleteTH']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
              <el-button v-hasPermi="['projectBase/EditTH']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <AddOrEdit ref="AddOrEdit" @confirm="handleConfirm"></AddOrEdit>
  </div>
</template>

<script>
import ZQuery from '@/components/configQuery/ZQuery.vue'
import { DGProjectBaseNewDeleteAsync, DGProjectBaseNewFindWithPagerAsync } from '@/api/application.js'
import { pageSize } from '@/config'
import AddOrEdit from './primaryAddOrEdit.vue'

export default {
  name: 'THProjectBase',
  components: {
    ZQuery,
    AddOrEdit
  },
  data() {
    return {
      title: 'TH project base',
      form: {
        "CurrentPageIndex": 1,
        "PageSize": pageSize,
        "RecordCount": 0,
        "Keywords": "",
        "EnCode": "",
        "Order": "asc",
        "Sort": "FID",
      },
      showAdd: false,
      total: 0,
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.handleSearch()
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'projectBase/AddTH')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    handleClone(val) {
      let data = JSON.parse(JSON.stringify(val))
      data.FProjectNO = data.FProjectNO + 'copy'
      data.FID = ""
      this.$refs.AddOrEdit.show(this.$t('clone'), 'Clone', data)
    },
    handleConfirm(flag) {
      if (flag === 'Add') {
        this.handleSearch()
      } else {
        this.getData();
      }
    },
    handleSearch(item) {
      if (item && JSON.stringify(item) != '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, 'CurrentPageIndex', 1);
      }
      this.getData();
    },

    getData() {
      this.loading = true
      DGProjectBaseNewFindWithPagerAsync(this.form).then(res => {
        this.loading = false
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.tableData = [...data.Items];
            this.total = data.TotalItems
          }
        } catch (error) {
          this.$message.error(error.toString())
        }
      })
    },

    handleAdd() {
      this.$refs.AddOrEdit.show(this.$t('Added'), 'Add')
    },
    handleEdit(val) {
      this.$refs.AddOrEdit.show(this.$t('edit'), 'Edit', val)
    },
    handleDelete(val) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        DGProjectBaseNewDeleteAsync(val).then(res => {
          if (res.Success) {
            this.handleSearch()
          }
        })
      }).catch(() => {
      });

    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  background-color: #fff;
  height: inherit;
}
</style>
