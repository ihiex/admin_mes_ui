<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible" :destroy-on-close="true" width="500px">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="180px" >
            <el-row>
                <el-col :span="24">
                    <!-- Shipment -->
                    <el-form-item label="HAWB" prop="HAWB">
                        <el-input v-model="form.HAWB" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="ShipDate" prop="FDate">
                        <el-date-picker v-model="form.FDate" type="date" :placeholder="$t('optionDate')" clearable
                            :disabled="isView" style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Pallet Count" prop="FPalletCount">
                        <el-input v-model="form.FPalletCount" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Pallet Seq" prop="FPalletSeq">
                        <el-input v-model="form.FPalletSeq" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Gross weight" prop="FGrossweight">
                        <el-input v-model="form.FGrossweight" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Empty carton" prop="FEmptyCarton">
                        <el-input v-model="form.FEmptyCarton" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Project NO" prop="FProjectNO">
                        <el-input v-model="form.FProjectNO" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Ship NO" prop="FShipNO">
                        <el-input v-model="form.FShipNO" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

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
            title: '新增',
            dialogFormVisible: false,
            form: {
                FInterID: '',
                HAWB: '',
                FDate: '',
                FPalletCount: '',
                FPalletSeq: '',
                FGrossweight: '',
                FEmptyCarton: '',
                FProjectNO: '',
                FShipNO: '',
                S_Type: '', //New,Mod
            },
            rules: {
                HAWB: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FDate: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FPalletCount: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FPalletSeq: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FGrossweight: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FEmptyCarton: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FProjectNO: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                FShipNO: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ]
            },
            isView: false
        }
    },
    methods: {
        show(data, title, type) {
            if (JSON.stringify(data) === "{}") {
                Object.keys(this.form).forEach(key => {
                    this.$set(this.form, key, '')
                })
                this.$set(this.form, 'FDate', new Date().format('yyyy-MM-dd'))
            } else {
                Object.keys(data).forEach(key => {
                    this.$set(this.form, key, data[key])
                })
            }
            if (type) {
                this.$set(this.form, 'S_Type', type)
                this.isView = false
            } else {
                this.isView = true
            }
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