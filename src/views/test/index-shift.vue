<template>
  <div class='shift_content'>
    <div class="content">
      <el-button @click="handleAdd">新增</el-button>
      <ZTimePick></ZTimePick>
      <el-divider></el-divider>
      <el-table :data="list" style="width: 100%" border height="calc(100% - 100px)">
        <el-table-column prop="shift" label="班次" width="80">
        </el-table-column>
        <el-table-column prop="quantum" label="时间段" show-overflow-tooltip min-width="200">
          <template slot-scope="scope">
            <span v-for="(res, i) in scope.row.quantum" :key="i" style="margin-left: 3px;"> {{ res.join('-') }} {{ (i ==
              scope.row.quantum.length - 1) ? '' : ','
              }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="70"></el-table-column>
        <el-table-column prop="desc" label="描述" min-width="100"></el-table-column>
        <el-table-column prop="" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <AddShift ref="AddShiftRef" @Confirm="handleConfirm"></AddShift>
  </div>
</template>


<script>
import AddShift from './components/addShift.vue'
import { uuid } from '@/utils'
import { aesEncrypt, aesDecrypt } from '@/utils/encrypt.js'
import ZTimePick from './components/zTimePick.vue'

/* shift */
export default {
  components: {
    AddShift,
    ZTimePick
  },
  data: function () {
    return {
      /* params: {},
      pickerOptions: {
        start: '00:00',
        step: '00:15',
        end: '24:00'
      } */
      list: [],
    }
  },

  methods: {

    async handleAdd() {

      /*   let e = aesEncrypt('123456789', '12345')
        console.log(e)
        let d = aesDecrypt(e, '12345')
        console.log(d) */

      this.$refs.AddShiftRef.show({}, '新增', true)

    },
    handleConfirm(data, flag) {
      if (flag) {
        this.list.push({ ...JSON.parse(JSON.stringify(data)), id: uuid() })
      } else {
        let index = this.list.findIndex(res => res.id === data.id)
        if (index >= 0) {
          this.list.splice(index, 1, data)
        }
      }
    },
    handleEdit(item) {
      console.log(item)
      this.$refs.AddShiftRef.show(item, '编辑', false)

    },
    handleDelete(item) {
      console.log(item)
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let index = this.list.findIndex(res => res.id === item.id)
        if (index >= 0) {
          this.list.splice(index, 1)
        }
      }).catch(() => {

      });
    },
  }
}
</script>



<style lang='scss'>
.shift_content {
  height: 100%;
  background-color: #fff;
  display: flex;

  .content {
    margin: 20px auto;
    // border-top: 2px solid #ccc;
    width: 90%;
  }
}
</style>
