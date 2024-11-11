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
            <el-form-item label="LineItem" prop="FLineItem">
                <el-input v-model="form.FLineItem" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="MPN" prop="FMPNNO">
                <el-input v-model="form.FMPNNO" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="MPN Desc" prop="FPartNumberDesc">
                <el-input v-model="form.FPartNumberDesc" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="CTN" prop="FCTN">
                <el-input v-model="form.FCTN" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="QTY" prop="FQTY">
                <el-input v-model="form.FQTY" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="GrossWeight" prop="FCrossWeight">
                <el-input v-model="form.FCrossWeight" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="NetWeight" prop="FNetWeight">
                <el-input v-model="form.FNetWeight" autocomplete="off" clearable></el-input>
            </el-form-item>

            <el-form-item label="CarrierNo" prop="FCarrierNo">
                <el-input v-model="form.FCarrierNo" autocomplete="off" clearable></el-input>
            </el-form-item>

            <el-form-item label="CommercialInvoice" prop="FCommercialInvoice">
                <el-input v-model="form.FCommercialInvoice" autocomplete="off" clearable></el-input>
            </el-form-item>
            <!--  <el-form-item label="FStatus" prop="S_FStatus">
                <el-input v-model="form.S_FStatus" autocomplete="off" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="ProjectNO" prop="FProjectNO">
                <el-input v-model="form.FProjectNO" autocomplete="off" clearable></el-input>
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
                FCarrierNo: '',
                FCommercialInvoice: '',
                FCrossWeight: '',
                FCTN: '',
                FKPONO: '',
                FLineItem: '',
                FMPNNO: '',
                FNetWeight: '',
                FOutSN: 0,
                FPartNumberDesc: '',
                FQTY: '',
                FStatus: 0,
                FProjectNO: '',
                Type: '', //New,Mod
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
            this.$set(this.form, 'Type', type)
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