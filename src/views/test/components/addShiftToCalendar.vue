<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :append-to-body="true"
    :close-on-click-modal="false" :destroy-on-close="true">
    <div class="dialog_content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="UPHTarget" prop="UPHTarget">
          <el-input v-model.number="ruleForm.UPHTarget" type="number"></el-input>
        </el-form-item>
        <el-form-item label="班次" prop="shift">
          <el-select v-model="ruleForm.shift" multiple collapse-tags clearable placeholder="请选择班次" style="width: 100%;">
            <el-option label="白班" value="D"></el-option>
            <el-option label="夜班" value="N"></el-option>
            <el-option label="假日" value="H"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model.trim="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-checkbox-group v-model="ruleForm.checkList">
            <el-checkbox label="周末"></el-checkbox>

          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <!-- <el-input v-model="value"></el-input> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button style="position: absolute; left: 0;" type="danger" @click="handleDelete">删 除</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      title: '添加事件',
      value: '',
      events: null,
      isAdd: true,
      ruleForm: {
        UPHTarget: 270,
        checkList: []
      },
      rules: {}
    }
  },
  methods: {
    show(title, data, isAdd) {
      this.isAdd = isAdd
      this.events = data
      this.title = title;
      this.$set(this.ruleForm, 'desc', data.title)
      this.$set(this.ruleForm, 'shift', data?.extendedProps?.shift ?? '')
      this.$set(this.ruleForm, 'UPHTarget', data?.extendedProps?.UPHTarget ?? 270)
      console.log(data)
      this.dialogVisible = true
    },
    handleConfirm() {
      // this.$set(this.events.extendedProps, 'shift', this.ruleForm.shift)
      // this.$set(this.events.extendedProps, 'UPHTarget', this.ruleForm.UPHTarget)
      /* this.events.extendedProps.shift = this.ruleForm.shift
      this.events.extendedProps.UPHTarget = this.ruleForm.UPHTarget */

      this.$emit('setData', this.ruleForm, this.events, this.isAdd)
      this.dialogVisible = false
    },
    handleDelete() {
      let hit = this.events.startStr + (this.events.endStr ? '--' + this.events.endStr : '')

      this.$confirm('是否删除' + hit + ': ' + this.events.title + '的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', this.events)
        this.dialogVisible = false
      }).catch(() => {

      });


    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_content {
  width: 100%;
  // border: 1px solid red;
  height: 300px;
}

.dialog-footer {
  width: 100%;
  display: inline-block;
  position: relative;
}
</style>
