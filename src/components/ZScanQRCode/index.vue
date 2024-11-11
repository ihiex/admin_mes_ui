<template>
    <div class="scan_qr_code">
        <el-input v-model="inputValue" :placeholder="placeholder" @input="handleInput" @change="handleChange">
            <i slot="suffix" class="el-input__icon images" @click="handleShowScan"></i>
        </el-input>
        <Scan ref="Scan" :is-continuously="isContinuously" @ScanValue="getValue"></Scan>
    </div>
</template>

<script>
import Scan from './scan.vue'
import i18n from '@/language'

export default {
    components: {
        Scan
    },
    props: {
        placeholder: {
            type: String,
            default: i18n.t('scanOrEnter')
        },
        value: {
            type: String,
            default: ''
        },
        isContinuously: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            title: '二维码',
            inputValue: this.value
        }
    },
    watch: {
        value: function (val, oval) {
            this.inputValue = val
        }
    },
    methods: {
        handleChange(val) {
            this.$emit('change', val)
        },
        handleInput(val) {
            this.$emit('input', val)
        },
        getValue(val) {
            this.inputValue = val
            this.$emit('input', val)
        },
        handleShowScan() {
            this.$refs.Scan.show()
        },
    }
}
</script>

<style lang="scss" scoped>
.scan_qr_code {
    .images {
        display: block;
        background: url('../../assets/images/scan.png') no-repeat center;
        background-size: 20px;
        cursor: pointer;
    }
}
</style>