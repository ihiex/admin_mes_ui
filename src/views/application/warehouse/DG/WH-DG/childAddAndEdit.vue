<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="500px"
    :destroy-on-close="true">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="No." prop="FEntryID">
        <el-input v-model="form.FEntryID" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="PO" prop="FKPONO">
        <el-input v-model="form.FKPONO" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="MPN" prop="FMPNNO">
        <el-input v-model="form.FMPNNO" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="CTN" prop="FCTN">
        <el-input v-model="form.FCTN" autocomplete="off" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '新增',
      dialogFormVisible: false,
      form: {
        FDetailID: '',
        FInterID: '',
        FEntryID: '',
        FKPONO: '',
        FMPNNO: '',
        FCTN: '',
        FStatus: 0,
        S_Type: '', //New,Mod
      },
      rules: {}
    }
  },
  methods: {
    show(data, title, type) {
      console.log(data)
      Object.keys(data).forEach(key => {
        this.$set(this.form, key, data[key])
      })
      console.log(this.form)
      this.$set(this.form, 'S_Type', type)
      this.title = title
      this.dialogFormVisible = true
    },
    handleConfirm() {
      this.$emit('confirm', JSON.parse(JSON.stringify(this.form)))
      this.dialogFormVisible = false
    },
  }
}
</script>

<style lang="scss" scoped></style>