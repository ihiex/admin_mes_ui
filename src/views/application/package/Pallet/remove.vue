<template>
    <el-dialog :title="$t('remove')" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" :close-on-click-modal="false">
        <el-form label-width="100px" :model="params">
            <el-form-item :label="$t('ScanPalletSN')">
                <el-input v-model="params.S_SN" :autofocus="true"></el-input>
            </el-form-item>
            <el-form-item :label="$t('BoxSN')">
                <el-input v-model="params.S_BoxSN"></el-input>
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
                S_BoxSN: '',
            }
        };
    },
    methods: {
        handleCancel(){
            this.dialogVisible = false
        },
        handleClose(done) {
            this.$set(this.params, 'S_SN', '')
            this.$set(this.params, 'S_BoxSN', '')
            done();
        },
        show(data){
            this.$set(this.params, 'S_SN', data.S_SN)
            this.$set(this.params, 'S_BoxSN', data.S_BoxSN)
            this.dialogVisible = true;
        },
        handleConfirm(){
            this.$emit('confirm', JSON.parse(JSON.stringify(this.params)))
            this.dialogVisible = false;
        },
    }
};
</script>