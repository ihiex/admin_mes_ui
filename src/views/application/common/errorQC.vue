<template>
    <el-dialog :title="$t('hint')" :visible.sync="dialogVisible" width="50%" :destroy-on-close="true"
        :close-on-click-modal="false">
        <div style="color: red; font-size: 120px; text-align: center;">
            <i class="el-icon-error"></i>
            {{ msg }}
        </div>
        <div>
            <el-divider style="background-color: #ccc;" content-position="left">Message</el-divider>
            <p style="color: red; font-size: 16px;">
                {{ errorMsg.msg }}
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">{{ $t('confirm') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            msg: '',
            errorMsg: {}
        }
    },
    methods: {
        show(msg, errorMsg) {
            this.msg = msg;
            this.errorMsg = { ...errorMsg }
            this.dialogVisible = true;
        }
    }
}
</script>

<style lang="scss" scoped></style>