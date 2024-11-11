<template>
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="dialogFormVisible" :destroy-on-close="true" width="900px">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="180px" style="height: 600px; overflow-y: auto;">
            <el-row>
                <el-col :span="12">
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
                    <el-form-item label="Ship ID" prop="ShipID">
                        <el-input v-model="form.ShipID" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <!-- Shipping Data -->
                    <el-form-item label="Region" prop="Region">
                        <el-input v-model="form.Region" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="ReferenceNO" prop="ReferenceNO">
                        <el-input v-model="form.ReferenceNO" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Country" prop="Country">
                        <el-input v-model="form.Country" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Carrier" prop="Carrier">
                        <el-input v-model="form.Carrier" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="HubCode" prop="HubCode">
                        <el-input v-model="form.HubCode" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="TruckNO" prop="TruckNo">
                        <el-input v-model="form.TruckNo" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>

                    <!-- Other data -->
                    <el-form-item label="OceanContainerNumber" prop="MAWB_OceanContainerNumber">
                        <el-input v-model="form.MAWB_OceanContainerNumber" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Origin" prop="Origin">
                        <el-input v-model="form.Origin" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="TotalVolume" prop="TotalVolume">
                        <el-input v-model="form.TotalVolume" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="POE_COC" prop="POE_COC">
                        <el-input v-model="form.POE_COC" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="TransportMethod" prop="TransportMethod">
                        <el-input v-model="form.TransportMethod" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="POE" prop="POE">
                        <el-input v-model="form.POE" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Pallet SN" prop="PalletSN">
                        <el-input v-model="form.PalletSN" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <!-- Delivery data -->
                    <el-form-item label="ReturnAddress" prop="ReturnAddress">
                        <el-input v-model="form.ReturnAddress" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryStreetAddress" prop="DeliveryStreetAddress">
                        <el-input v-model="form.DeliveryStreetAddress" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryRegion" prop="DeliveryRegion">
                        <el-input v-model="form.DeliveryRegion" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryToName" prop="DeliveryToName">
                        <el-input v-model="form.DeliveryToName" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryCityName" prop="DeliveryCityName">
                        <el-input v-model="form.DeliveryCityName" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryCountry" prop="DeliveryCountry">
                        <el-input v-model="form.DeliveryCountry" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="AdditionalDeliveryToName" prop="AdditionalDeliveryToName">
                        <el-input v-model="form.AdditionalDeliveryToName" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryPostalCode" prop="DeliveryPostalCode">
                        <el-input v-model="form.DeliveryPostalCode" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="TelNo" prop="TelNo">
                        <el-input v-model="form.TelNo" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>

                    <el-form-item label="CTRY" prop="CTRY">
                        <el-input v-model="form.CTRY" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="SHA" prop="SHA">
                        <el-input v-model="form.SHA" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Sales" prop="Sales">
                        <el-input v-model="form.Sales" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="WebJ" prop="WebJ">
                        <el-input v-model="form.WebJ" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="UUI" prop="UUI">
                        <el-input v-model="form.UUI" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DNJ" prop="DNJ">
                        <el-input v-model="form.DNJ" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="DeliveryJ" prop="DeliveryJ">
                        <el-input v-model="form.DeliveryJ" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="Special" prop="Special">
                        <el-input v-model="form.Special" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="SCAC" prop="SCAC">
                        <el-input v-model="form.SCAC" autocomplete="off" clearable :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="OEMSpecificPO1" prop="OEMSpecificPO1">
                        <el-input v-model="form.OEMSpecificPO1" autocomplete="off" clearable
                            :disabled="isView"></el-input>
                    </el-form-item>
                    <el-form-item label="OEMSpecificPO2" prop="OEMSpecificPO2">
                        <el-input v-model="form.OEMSpecificPO2" autocomplete="off" clearable
                            :disabled="isView"></el-input>
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
                FPalletCount: '',
                FGrossweight: '',
                FProjectNO: '',
                FDate: '',
                FPalletSeq: '',
                FEmptyCarton: '',
                PalletSN: '',
                FShipNO: '',
                ShipID: '',
                Region: '',
                ReferenceNO: '',
                Country: '',
                Carrier: '',
                HubCode: '',
                TruckNo: '',
                ReturnAddress: '',
                DeliveryStreetAddress: '',
                DeliveryRegion: '',
                DeliveryToName: '',
                DeliveryCityName: '',
                DeliveryCountry: '',
                AdditionalDeliveryToName: '',
                DeliveryPostalCode: '',
                TelNo: '',
                MAWB_OceanContainerNumber: '',
                Origin: '',
                TotalVolume: '',
                POE_COC: '',
                TransportMethod: '',
                POE: '',

                CTRY: '',
                SHA: '',
                Sales: '',
                WebJ: '',
                UUI: '',
                DNJ: '',
                DeliveryJ: '',
                Special: '',
                SCAC: '',
                OEMSpecificPO1: '',
                OEMSpecificPO2: '',

                Type: '', //New,Mod
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
                // PalletSN: [
                //     { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                // ],
                FShipNO: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                ShipID: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                Region: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                ReferenceNO: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                Country: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                Carrier: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                HubCode: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                TruckNo: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                MAWB_OceanContainerNumber: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                Origin: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                TotalVolume: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                POE_COC: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                TransportMethod: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
                POE: [
                    { required: true, message: this.$t('ParameterCannotBeNull'), trigger: 'blur' },
                ],
            },
            isView: false
        }
    },
    methods: {
        show(data, title, type) {
            console.log(data)
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
                this.$set(this.form, 'Type', type)
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