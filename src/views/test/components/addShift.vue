<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" :destroy-on-close="true"
    :close-on-click-modal="false">
    <div>
      <el-form ref="ruleForm" :model="params" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="班次" prop="shift">
          <el-input v-model.trim="params.shift" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="时间段" prop="region">
          <div v-for="(item, index) in params.quantum" :key="index" class="add_minus">
            <el-time-picker v-model="params.quantum[index]" is-range range-separator="-" start-placeholder="start"
              end-placeholder="end" placeholder="选择时间范围" value-format="HH:mm:ss" class="time_quantum">
            </el-time-picker>
            <i class="el-icon-minus minus" @click="handleMinus(index)"></i>
            <i class="el-icon-plus add" @click="handleAdd(index)"></i>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="params.state" clearable placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in [{ value: '1', label: '启用' }, { value: '2', label: '停用' }]" :key="item.value"
              :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="shift">
          <el-input v-model="params.desc"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '新增',
      dialogVisible: false,
      params: {
        quantum: [[`08:00:00`, `12:00:00`], [`13:00:00`, `20:00:00`]]
      },
      rules: {},
      isAdd: true
    }
  },
  methods: {
    show(data, title, isAdd) {
      this.cleanData()
      this.title = title
      this.isAdd = isAdd
      if (data && Object.keys(data).length > 0) {
        this.params = JSON.parse(JSON.stringify(data));
      }
      this.dialogVisible = true
    },
    handleConfirm() {
      console.log(this.params)
      this.$emit('Confirm', this.params, this.isAdd)
      this.dialogVisible = false
    },
    handleCancel() {
      this.dialogVisible = false
    },
    handleMinus(index) {
      console.log('minus')
      if (this.params.quantum.length == 1) return;
      this.$confirm('是否移除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$delete(this.params.quantum, index)
      }).catch(() => {

      });

    },
    handleAdd(index) {
      console.log('add')
      // this.$set(this.params.quantum, index + 1, [])
      let h = new Date().getHours()
      this.params.quantum.splice(index + 1, 0, [`${h - 1}:00:00`, `${h}:00:00`])
    },
    cleanData() {
      Object.keys(this.params).forEach(key => {
        if (Array.isArray(this.params[key])) {
          this.$set(this.params, key, [[`08:00:00`, `12:00:00`], [`13:00:00`, `20:00:00`]])
        } else {
          this.$set(this.params, key, '')
        }
      })
    },
    /*  beforeClose(done){
       this.cleanData()
       done()
     } */
  }
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  .add_minus {
    position: relative;
    margin-bottom: 5px;

    .time_quantum {
      width: 100%;
      margin-right: 5px;
    }

    i {
      position: absolute;
      right: -20px;
      cursor: pointer;
      display: none;
      width: 20px;
      text-align: right;
      // border: 1px solid red;
      height: 19px;
    }

    &:hover {
      i {
        display: inline-block;
      }
    }

    .add {
      bottom: -3px;
      line-height: 22px;
    }

    .minus {
      top: -3px;
    }
  }


}
</style>
