<template>
  <div v-loading="loading" class="page_container">
    <el-container style="height: 40%">
      <el-aside width="50%">
        <el-table :data="tableData" style="width: 100%" size="mini" :show-header="false" cell-class-name="cell_class_name"
          height="100%">
          <el-table-column prop="Type" label="Type" width="200">
            <template slot-scope="scope">
              {{ scope.row.Type }}
              <i :class="icons[scope.row.Type]"></i>
              <vab-icon :icon="['fas', icons[scope.row.Type]]"></vab-icon>
            </template>
          </el-table-column>
          <el-table-column prop="Num" label="Num" min-width="150"></el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <el-table :data="LeftTableData" style="width: 100%" class="left_table" size="small" :show-header="false"
          cell-class-name="cell_class_name" height="100%">
          <el-table-column prop="ProductionOrderDetailDef" label="ProductionOrderDetailDef" width="200">
            <template slot-scope="scope">
              <div class="attr_title">
                {{ scope.row.ProductionOrderDetailDef }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="Content" label="Content" min-width="150"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-footer style="height: 60%">
      <el-table :data="FooterTableData" style="width: 100%" size="mini" stripe :fit="true" height="100%" border>
        <el-table-column v-for="item in FooterTableHead" :key="item" :prop="item" :label="item" sortable
          :min-width="item == 'ID' ? '90' : '180'" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'ProductionOrder',
  props: {
    loading: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    return {
      title: 'unitInfo',
      tableData: [],
      LeftTableData: [],
      LeftTableHead: [],
      FooterTableData: [],
      FooterTableHead: [],
      icons: {
        ProductionOrderNumber: 'luggage-cart',
        Description: 'el-icon-tickets',
        OrderQuantity: 'sort-numeric-up',
        PartNumber: 'dice-d6',
        Employee: 'el-icon-user-solid',
        Status: '',
        CreationTime: 'el-icon-timer',
        LastUpdate: 'hourglass-end',
        UOM: '',
        PriorityByERP: '',
        IsLotAuditCompleted: '',
      },
    }
  },
  methods: {
    show(data) {
      this.LeftTableData = []
      this.FooterTableData = []
      this.tableData = data ? data[0] : []
      this.LeftTableHead =
        data[1] && data[1].length > 0 ? Object.keys(data[1][0]) : []
      this.FooterTableHead =
        data[2] && data[2].length > 0 ? Object.keys(data[2][0]) : []
      this.$nextTick(function () {
        this.LeftTableData = data ? data[1] : []
        this.FooterTableData = data ? data[2] : []
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  overflow: auto;

  ::v-deep .el-table {
    &::before {
      background-color: transparent;
    }
  }

  ::v-deep .cell_class_name {
    border: none;
  }

  .el-container {
    .el-aside {
      padding: 10px;
      box-sizing: border-box;

      .el-table {
        &:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 6px 16px rgb(200 200 200 / 94%);
        }
      }
    }

    .el-main {
      padding: 10px;

      .left_table {
        &:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 6px 16px rgb(200 200 200 / 94%);
        }
      }
    }
  }

  .el-footer {
    padding: 0;
    padding-top: 10px;
    box-sizing: border-box;
  }
}
</style>
