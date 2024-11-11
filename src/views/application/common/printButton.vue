<template>
    <!--  @click="init(url)" -->
    <!-- :disabled="isConnectPrint" -->
    <el-button class="print-button" type="text" :disabled="disabled">
        <slot name="prepend"></slot>
        <img v-if="isConnectPrint" src="@/assets/svg/print.svg" alt="">
        <img v-else src="@/assets/svg/print-disabled.svg" alt="">
        <slot name="append"></slot>
    </el-button>
</template>

<script>
/* 连接websocket and print */
export default {
    props: {
        disabled: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data() {
        return {
            isConnectPrint: false,
            url: '',
            socketContext: null,
            count: 0
        }
    },
    watch: {
        count: function (val, oval) {
            let that = this;

            val > 1 && setTimeout(function () {
                that.count = 0
            }, 1000 * 60)
        }
    },
    beforeDestroy() {
        this.socketContext && this.socketContext.close()
    },
    methods: {
        init(url) {
            if (this.socketContext || !url) return
            if ('WebSocket' in window) {

            } else {
                that.$emit('error', {
                    result: 'error',
                    msg: '当前浏览器不支持WebSocket'
                })
                return
            }
            let httpStr = window.location.protocol
            if (httpStr === 'https:') {
                if (/^wss:\/\/+/.test(url)) {
                    this.url = url
                } else {
                    this.url = `wss://${url}`
                }
            } else {
                if (/^ws:\/\/+/.test(url)) {
                    this.url = url
                } else {
                    this.url = `ws://${url}`
                }
            }

            let storage = window.localStorage;
            storage.setItem('firstFlag', 'true')

            this.socketContext = new WebSocket(this.url)

            let that = this
            that.socketContext.onerror = () => {
                that.isConnectPrint = false
                that.$emit('IsConnectPrint', false)
                that.$emit('error', {
                    result: 'error',
                    msg: `${(new Date()).format('yyyy-MM-dd hh:mm:ss')} ${that.$t('printConnectError')}` //+ ',' + that.$t('pleaseOpenServiceAndRefreshPage')
                })
            }
            that.socketContext.onopen = () => {
                that.isConnectPrint = true;
                that.$emit('IsConnectPrint', true)
                that.$emit('success', {
                    result: 'success',
                    msg: `${(new Date()).format('yyyy-MM-dd hh:mm:ss')} ${that.$t('printServiceConnectSuccessfully')}` //that.$t('printConnectError') //+ ',' + that.$t('pleaseOpenServiceAndRefreshPage')
                })
            }
            that.socketContext.onclose = () => {
                that.socketContext = null
                that.isConnectPrint = false
                that.$emit('IsConnectPrint', false)
                that.$emit('error', {
                    result: 'error',
                    msg: `${(new Date()).format('yyyy-MM-dd hh:mm:ss')} ${that.$t('printServiceDisconnected')}` //that.$t('printConnectError') //+ ',' + that.$t('pleaseOpenServiceAndRefreshPage')
                })
                //重连
                that.count++;
                setTimeout(function () {
                    that.count <= 5 && that.init(that.url)
                }, 1000 * 5)
            }
            that.socketContext.onmessage = (res) => {
                if (res.data.includes('ServerMSG')) {
                    let obj = JSON.parse(res.data)
                    that.$emit('success', {
                        result: 'success',
                        msg: obj.ServerMSG
                    })
                } else {
                    that.$emit('error', {
                        result: 'error',
                        msg: res.data
                    })
                }
            }
        },
        send(data) {
            this.socketContext.send(data)
        },
        close() {
            this.socketContext && this.socketContext.close()
        }
    },

}
</script>

<style lang="scss" scoped>
.print-button {
    padding: 0;

    img {
        position: relative;
        top: 3px;
    }
}
</style>
