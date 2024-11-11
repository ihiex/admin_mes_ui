<template>
    <el-dialog :title="$t('remove')" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
        <el-form label-width="80px" :model="params">
            <el-form-item :label="$t('BoxSN')">
                <el-input v-model="params.S_SN" :autofocus="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('SN')">
                <el-input v-model="params.InnerSN"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">{{ $t('cancel') }}</el-button>
            <el-button type="primary" @click="handleConfirm">{{ $t('confirm') }}</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            params: {
                S_SN: '',
                InnerSN: '',
            }
        };
    },
    methods: {
        handleCancel(){
            this.dialogVisible = false
        },
        handleClose(done) {
            this.$set(this.params, 'S_SN', '')
            this.$set(this.params, 'InnerSN', '')
            done();
        },
        show(data){
            this.$set(this.params, 'S_SN', data.S_SN)
            this.$set(this.params, 'InnerSN', data.InnerSN)
            this.dialogVisible = true;
        },
        handleConfirm(){
            this.$emit('confirm', JSON.parse(JSON.stringify(this.params)))
            this.dialogVisible = false;
        },
    }
};
</script>