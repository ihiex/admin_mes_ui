<template>
    <el-dialog title="Print server" :visible.sync="dialogVisible" width="820px" :close-on-click-modal="false"
        :before-close="handleClose" :destroy-on-close="true">
        <div style="box-sizing: border-box; width: inherit; height: 600px; overflow-y: auto;">
            <div :id="id" style="background-color: #fff;">
                <div v-for="item in list" :key="item.FInterID" style="height: 1046px; box-sizing: border-box;">
                    <p style="text-align: right; padding-right: 11px; margin: 0;">
                        <span style="position: relative; bottom: 12px; right: 20px">
                            {{ item.FBillNO }}
                        </span>
                        <vue-qr :text="item.FBillNO" :size="65" :margin="0"></vue-qr>
                    </p>
                    <p style="font-size: 36px; padding: 0; margin: 0;">
                        <span style="display: inline-block; width: 20%;">HAWB:</span>
                        <span style="display: inline-block; width: 80%; text-align: center; ">{{ item.HAWB }}</span>
                    </p>
                    <p style="font-size: 36px; padding: 0; margin: 0;">
                        <span style="display: inline-block; width: 20%;">Pallet:</span>
                        <span style="display: inline-block; width: 80%; text-align: center; ">
                            {{ item.FPalletSeq }}/{{ item.FPalletCount }}
                        </span>
                    </p>
                    <p style="font-size: 36px; padding: 0; margin: 0;">
                        <span style="display: inline-block; width: 35%;">Gross Weight:</span>
                        <span
                            style="display: inline-block; width: 65%; text-align: right; box-sizing: border-box; padding-right: 15px;">{{
                                item.FGrossweight }}
                            KG</span>
                    </p>
                    <p style="font-size: 36px; padding: 0; margin: 0;">
                        <span style="display: inline-block; width: 35%;">Total Carton:</span>
                        <span
                            style="display: inline-block; width: 65%; text-align: right; box-sizing: border-box; padding-right: 15px;">{{
                                item.FCTN }}
                            CTN</span>
                    </p>
                    <p style="font-size: 36px; padding: 0; margin: 0 0 5px 0;">
                        <span style="display: inline-block; width: 35%;">Empty Carton:</span>
                        <span
                            style="display: inline-block; width: 65%; text-align: right; box-sizing: border-box; padding-right: 15px;">{{
                                item.FEmptyCarton }}
                            CTN</span>
                    </p>
                    <div style="height: 625px; width: inherit;">
                        <table style=" border-collapse: collapse; width: 100%; border-color: #000;" border="1">
                            <tr style="background-color: #000; color: #fff;">
                                <th>Project</th>
                                <th>PO</th>
                                <th>MPN</th>
                                <th>CTN</th>
                            </tr>
                            <tr v-for="(res, index) in item.list" :key="index" style="text-align: center;">
                                <td>{{ res.FProjectNO2 }}</td>
                                <td>{{ res.FKPONO }}</td>
                                <td>{{ res.FMPNNO }}</td>
                                <td>{{ res.FCTN2 }}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="display: flex;">
                        <div style="height: 140px; font-size: 20px; width: 300px;">
                            <div style="padding: 5px 0;">DONOT BREAK BULK</div>
                            <div style="padding: 5px 0;">备货人/Prepare goods:</div>
                            <div style="padding: 5px 0;">组长/Supervisor:</div>
                            <div style="padding: 5px 0;">QC:</div>
                        </div>
                        <div
                            style="height: 140px;flex: 4; line-height: 140px; text-align: center; font-size: 46px; text-overflow: ellipsis; white-space: nowrap;overflow: hidden; width: inherit;">
                            {{ item.FShipNO }}</div>
                        <div style="height: 140px;width: 200px; font-size: 20px; text-align: right;">
                            <div
                                style="margin:5px; text-overflow: ellipsis; white-space: nowrap;overflow: hidden; width: 190px;box-sizing: border-box;">
                                {{ item.FProjectNO }}</div>
                            <div
                                style="margin:5px; text-overflow: ellipsis; white-space: nowrap;overflow: hidden; width: 190px;box-sizing: border-box;">
                                {{
                                    item.FShipNO }}</div>
                            <div style="margin: 5px;">Date: {{ new Date(item.FDate.replace(/-/g, '/')).format('yyyy-MM-dd')
                            }}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
            <el-button v-print="`#${id}`" type="primary" @click="dialogVisible = false">{{ $t('Print') }}</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { uuid } from '@/utils'
import VueQr from 'vue-qr'

export default {
    name: 'BrowserPrint',
    components: {
        VueQr
    },
    data() {
        return {
            dialogVisible: false,
            id: uuid(),
            list: [],
        }
    },
    methods: {
        show(data) {
            //数据分组
            let printList = [];
            data.forEach(res => {
                if (printList.length === 0) {
                    res['list'] = [res]
                    printList.push(res)
                } else {
                    let obj = printList.find(item => item.FInterID === res.FInterID);
                    if (obj) {
                        obj.list.push(res)
                    } else {
                        res['list'] = [res]
                        printList.push(res)
                    }
                }
            })

            //截断
            let sec = 30
            for (let i = 0; i < printList.length; i++) {
                let len = printList[i].list.length
                if (len > sec) {
                    let objs = Object.assign({}, printList[i])
                    let section = Math.ceil(len / sec)
                    let arr = [];
                    for (let j = 0; j < section; j++) {
                        printList[i].list = objs.list.slice(j * sec, j * sec + sec)
                        arr.push(Object.assign({}, printList[i]))
                    }
                    arr.forEach((res, index) => {
                        if (index == 0) {
                            printList[i] = res
                        } else {
                            printList.splice(i + index, 0, res)
                        }
                    })
                }
            }

            this.list = [...printList]

            this.dialogVisible = true
        },
        handleClose() {
            this.dialogVisible = false
        }
    }
}
</script>