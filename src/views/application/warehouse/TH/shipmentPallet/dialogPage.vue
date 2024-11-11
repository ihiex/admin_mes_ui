<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible" :destroy-on-close="true"
        width="40%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="150px">
            <el-form-item :label="label.label1" prop="params1">
                <el-input v-model.trim="form.params1" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item :label="label.label2" prop="params2">
                <el-input v-model.trim="form.params2" autocomplete="off" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{ $t('cancel') }}</el-button>
            <el-button v-if="!isView" type="primary" @click="handleConfirm">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            dialogFormVisible: false,
            form: {
                params1: '',
                params2: ''
            },
            rules: {
                params1: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                params2: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
            },
            isView: false,
            label: {
                label1: '',
                label2: ''
            }
        }
    },
    methods: {
        show(label, title) {
            this.title = title
            this.$set(this.form, 'params1', '')
            this.$set(this.form, 'params2', '')
            this.$set(this.label, 'label1', label.label1)
            this.$set(this.label, 'label2', label.label2)
            this.dialogFormVisible = true
        },
        handleConfirm() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$emit('confirm', JSON.parse(JSON.stringify(this.form)))
                    this.dialogFormVisible = false
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped></style>