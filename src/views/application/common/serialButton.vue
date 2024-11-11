<template>
    <div style="display:inline-block">
        <el-popover v-if="isHttps" placement="bottom" :title="$t('SerialConfig')" trigger="click">
            <div v-show="defaultCom" class="default_com">{{ $t('default') }}: {{ defaultCom }}</div>
            <el-form ref="ruleForm" :model="serialOptions" status-icon label-width="90px" class="demo-ruleForm">
                <!-- 波特率 -->
                <el-form-item :label="$t('baudRate')" prop="baudRate">
                    <el-autocomplete v-model="serialOptions.baudRate" class="inline-input" style="width: 100%;"
                        :disabled="disabledSerialOption" :fetch-suggestions="querySearch" placeholder=""
                        :trigger-on-focus="false">
                    </el-autocomplete>
                </el-form-item>
                <!-- 数据位 -->
                <el-form-item :label="$t('dataBits')" prop="dataBits">
                    <el-select v-model.number="serialOptions.dataBits" placeholder="" :disabled="disabledSerialOption">
                        <el-option v-for="item in [7, 8]" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 停止位 -->
                <el-form-item :label="$t('stopBits')" prop="stopBits">
                    <el-select v-model.number="serialOptions.stopBits" placeholder="" :disabled="disabledSerialOption">
                        <el-option v-for="item in [1, 2]" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 校验位 -->
                <el-form-item :label="$t('checkBits')" prop="parity">
                    <el-select v-model="serialOptions.parity" placeholder="" :disabled="disabledSerialOption">
                        <el-option v-for="item in ['None', 'Even', 'Odd']" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 缓冲区 -->
                <el-form-item :label="$t('Buffer')" prop="bufferSize">
                    <el-autocomplete v-model="serialOptions.bufferSize" class="inline-input"
                        :disabled="disabledSerialOption" style="width: 100%;" :fetch-suggestions="bufferQuerySearch"
                        placeholder="" :trigger-on-focus="false">
                    </el-autocomplete>
                </el-form-item>
                <!-- 控制流 -->
                <el-form-item :label="$t('flowControl')" prop="flowControl">
                    <el-select v-model="serialOptions.flowControl" placeholder="" :disabled="disabledSerialOption">
                        <el-option v-for="item in ['None', 'HardWare']" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <div style="position: relative;">
                    <el-button type="text" @click="handleChangeSerial">{{ $t('selectSerialPort') }}</el-button>
                    <el-button style="position: absolute; right: 0;" type="primary" @click="handleOpenSerial">{{
                        serialToggle
                    }}</el-button>
                </div>

                <!-- 未选择串口 -->
                <div
                    style="height: 54px; background-color: #cff4fc; line-height: 54px; margin: 5px 0; border-radius: 8px; font-size: 18px; padding: 5px;">
                    {{ statusMsg }}
                </div>
            </el-form>
            <el-button slot="reference" class="serial_btn" type="text" style="padding: 0; position: relative; top: 6px;">
                <img v-if="isConnect" src="@/assets/images/serial-port.png" alt="">
                <img v-else src="@/assets/images/serial-port-disabled.png" alt="">
            </el-button>
        </el-popover>
        <el-button v-else class="serial_btn" type="text" style="padding: 0; position: relative; top: 6px;">
            <img v-if="isConnect" src="@/assets/images/serial-port.png" alt="">
            <img v-else src="@/assets/images/serial-port-disabled.png" alt="" @click="handleTry">
        </el-button>
    </div>
</template>

<script>
/* 串口 */
export default {
    name: "SerialButton",
    data() {
        return {
            isConnect: false,
            socketContext: null,
            serialToggle: this.$t('openSerialPort'),
            disabledSerialOption: false,
            statusMsg: this.$t('SerialPortNotSelected'),
            serialPort: null,
            serialOpen: false, //串口打开状态
            serialOptions: {
                baudRate: '11200',
                dataBits: 8,
                stopBits: 1,
                parity: 'None',
                bufferSize: '1024',
                flowControl: 'None',
                Com: 'COM1',
            },
            bauds: [
                { value: '110' },
                { value: '300' },
                { value: '600' },
                { value: '1200' },
                { value: '2400' },
                { value: '4800' },
                { value: '7200' },
                { value: '9600' },
                { value: '14400' },
                { value: '19200' },
                { value: '28800' },
                { value: '38400' },
                { value: '56000' },
                { value: '57600' },
                { value: '76800' },
                { value: '115200' },
                { value: '230400' },
                { value: '460800' },
            ],
            bufferSizes: [
                { value: '255' },
                { value: '512' },
                { value: '1024' },
                { value: '2048' },
                { value: '4096' },
                { value: '8192' },
            ],
            toolOptions: {
                //日志类型
                logType: 'hex&ascii',
                //分包合并时间
                timeOut: 50,
                //末尾加回车换行
                addCRLF: false,
                //HEX发送
                hexSend: false,
                //输入的发送内容
                content: '',
            },
            serialData: [],
            reader: null,
            asciideCoder: new TextDecoder(),//文本解码
            defaultCom: 'Com1',
            count: 0,
            isHttps: false,
            url: '',
            isSerialConnect: false
        }
    },
    created() {
        let httpStr = window.location.protocol
        //浏览器自带serial
        if (httpStr === 'https:') {
            if (!navigator.serial) {
                this.addSerialLog({ message: 'The browser does not support serial port communication', type: 'error' })
                this.serialStatusChange(false)
                return
            }
            this.isHttps = true;
            navigator.serial.getPorts().then((ports) => {
                if (ports.length > 0) {
                    this.serialPort = ports[0]
                    this.serialStatusChange(true)
                    this.handleOpenSerial() //如果串口已打开，直接按配置参数打开
                } else {
                    this.serialStatusChange(false)
                }
            }, error => {
                this.addSerialLog({ message: error.toString(), type: 'error' })
            })
            //串口事件监听
            navigator.serial.addEventListener('connect', (e) => {
                this.serialStatusChange(true)
                this.serialPort = e.target
                //未主动关闭连接的情况下,设备重插,自动重连
                if (!this.serialClose) {
                    this.handleOpenSerial()
                }
            })
            navigator.serial.addEventListener('disconnect', (e) => {
                this.serialStatusChange(false)
                setTimeout(this.closeSerial, 500)
            })
        } else {
            this.isHttps = false;
        }
    },
    beforeDestroy() {
        // this.serialOpen && this.closeSerial()
        this.handleClose();
    },
    methods: {
        handleTry() {
            this.init(this.serialOptions, this.defaultCom, this.url)
        },
        /* 通过websocket通讯转serial */
        handleInit(url) {
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
                });
                //打开成功后连接serial
                that.setSerialConfig()
                that.serialStatusChange(true)
            }
            that.socketContext.onclose = () => {
                that.socketContext = null
                that.isConnectPrint = false
                that.$emit('IsConnectPrint', false)
                that.$emit('error', {
                    result: 'error',
                    msg: `${(new Date()).format('yyyy-MM-dd hh:mm:ss')} ${that.$t('printServiceDisconnected')}` //that.$t('printConnectError') //+ ',' + that.$t('pleaseOpenServiceAndRefreshPage')
                })
                that.serialStatusChange(false)
                //重连
                that.count++;
                setTimeout(function () {
                    that.count <= 5 && that.init(that.url)
                }, 1000 * 5)
            }
            that.socketContext.onmessage = (res) => {
                let obj = JSON.parse(res.data)

                if (obj && obj.ReadData) {
                    //读数据
                    that.$emit('SerialRead', obj.ReadData);
                }
                if (obj && obj.ServerMSG) {
                    if (res.data.includes('error')) {
                        that.$emit('error', {
                            result: 'error',
                            msg: obj.ServerMSG
                        })
                        that.serialStatusChange(false)
                    } else {
                        that.$emit('success', {
                            result: 'success',
                            msg: obj.ServerMSG
                        })
                    }
                    // this.serialStatusChange(true)
                } else {
                    that.$emit('error', {
                        result: 'error',
                        msg: res.data
                    })
                }
            }
        },
        setSerialConfig() {
            let str = `SERIAL|Config|${JSON.stringify(this.serialOptions)}`
            this.handleSend(str)
        },
        handleSend(data) {
            //如果是串口未连接
            // if (!this.isSerialConnect) return;
            this.socketContext && this.socketContext.send(data)
        },
        handleClose() {
            this.socketContext && this.socketContext.close()
        },

        /* 浏览器自带serial */
        //写串口数据 
        async writeData(data) {
            if (!this.serialPort || !this.serialPort.writable) {
                this.addSerialLog({ message: this.$t('PleaseOpenSerialPortOnSendData'), type: 'error' })
                return
            }
            let writer = null
            try {
                writer = this.serialPort.writable.getWriter()
                if (this.toolOptions.addCRLF) {
                    data = new Uint8Array([...data, 0x0d, 0x0a])
                }
                await writer.write(data)
            } catch (error) {
                this.addSerialLog({ message: error.toString(), type: 'error' })
            } finally {
                writer.releaseLock()
            }
            // this.addLog(data, false)
        },
        //打开串口
        async openSerial() {
            let SerialOptions = {
                baudRate: parseInt(this.serialOptions.baudRate),
                dataBits: parseInt(this.serialOptions.dataBits),
                stopBits: parseInt(this.serialOptions.stopBits),
                parity: this.serialOptions.parity.toLowerCase(),
                bufferSize: parseInt(this.serialOptions.bufferSize),
                flowControl: this.serialOptions.flowControl.toLowerCase(),
            }
            this.serialPort
                .open(SerialOptions)
                .then(() => {
                    this.serialToggle = this.$t('closeSerialPort')
                    this.serialOpen = true
                    this.serialClose = false
                    this.disabledOptions(true)
                    this.readData()
                    this.serialStatusChange(true)
                })
                .catch((e) => {
                    let str = e.toString()
                    if (str.includes("'open' on 'SerialPort'")) {
                        this.addSerialLog({ message: 'The serial port is occupied.', type: 'error' })
                    } else {
                        this.addSerialLog({ message: str, type: 'error' })
                    }
                    this.serialStatusChange(false)
                })
        },
        //串口数据收发
        async send(data) {
            if (this.isHttps) {
                let item = data ? data : this.toolOptions
                if (!item.content) {
                    this.addSerialLog({ message: this.$t('SendContentIsEmpty'), type: 'error' })
                    return
                }

                if (!this.serialOpen) return;
                if (item.hexSend) {
                    await this.sendHex(item.content)
                } else {
                    await this.sendText(item.content)
                }
            } else {
                //socket分支连接serial
                let str = `SERIAL|Params|${JSON.stringify({ "isPass": data.content })}`
                this.handleSend(str)
            }
        },
        //发送HEX到串口
        async sendHex(hex) {
            const value = hex.replace(/\s+/g, '')
            if (/^[0-9A-Fa-f]+$/.test(value) && value.length % 2 === 0) {
                let data = []
                for (let i = 0; i < value.length; i = i + 2) {
                    data.push(parseInt(value.substring(i, i + 2), 16))
                }
                await this.writeData(Uint8Array.from(data))
            } else {
                this.addSerialLog({ message: this.$t('HexFormatError') + ':' + hex, type: 'error' })
            }
        },
        //发送ASCII到串口
        async sendText(text) {
            const encoder = new TextEncoder()
            this.writeData(encoder.encode(text))
        },
        //选择串口
        async handleChangeSerial() {
            if (this.disabledSerialOption) {
                this.$message({ message: 'Close the serial port before performing this operation', type: 'warning', showClose: true })
                return
            }
            if (!navigator.serial) {
                this.addSerialLog({ message: 'The browser does not support serial port communication', type: 'error' })
                this.serialStatusChange(false)
                return
            }
            // 客户端授权
            let that = this
            try {
                await navigator.serial.requestPort().then((port) => {
                    //关闭旧的串口
                    that.read?.releaseLock();
                    that.serialPort?.forget()
                    that.serialPort?.close()

                    that.serialPort = port
                    // that.serialStatusChange(true)
                }, error => {
                    let eMsg = error.toString()
                    if (!eMsg.includes('No port selected by the user')) {
                        that.addSerialLog({
                            message: eMsg,
                            type: 'error'
                        })
                        this.serialStatusChange(false)
                    }
                })
            } catch (e) {
                that.addSerialLog({
                    message: e.toString(),
                    type: 'error'
                })
                this.serialStatusChange(false)
            }
        }
        ,
        //检查串口是否打开
        handleOpenSerial() {
            if (!this.serialPort) {
                this.$message({ message: this.$t('PleaseSelectSerialPort'), type: 'warning', showClose: true })
                this.addSerialLog({ message: this.$t('PleaseSelectSerialPort'), type: 'error' })
                return
            }

            if (this.serialPort.writable && this.serialPort.readable) {
                this.closeSerial()
                this.serialClose = true
                return
            }

            this.openSerial()
        },
        querySearch(queryString, cb) {
            var restaurants = this.bauds;
            var results = queryString ? restaurants.filter(res => { if (res.value.includes(queryString)) { return res }; return '' }) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);

        },
        bufferQuerySearch(queryString, cb) {
            var restaurants = this.bufferSizes;
            var results = queryString ? restaurants.filter(res => { if (res.value.includes(queryString)) { return res }; return '' }) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);

        },

        init(data, defaultSerialPort, url) {
            this.serialOptions = JSON.parse(JSON.stringify(data))
            this.$set(this.serialOptions, 'Com', defaultSerialPort)
            this.defaultCom = defaultSerialPort
            if (!this.isHttps) {
                this.handleInit(url)
            }
        },
        //串口分包合并
        dataReceived(data) {
            let that = this
            that.serialData.push(...data)
            if (that.toolOptions.timeOut == 0) {
                that.transformReadData(that.serialData)
                that.serialData = []
                return
            }
            //清除之前的时钟
            clearTimeout(that.serialTimer)
            that.serialTimer = setTimeout(() => {
                //超时发出
                that.transformReadData(that.serialData)
                that.serialData = []
            }, that.toolOptions.timeOut)
        },
        //读串口数据
        async readData() {
            while (this.serialOpen && this.serialPort.readable) {
                this.reader = this.serialPort.readable.getReader()
                try {
                    while (true) {
                        const { value, done } = await this.reader.read()
                        if (done) {
                            break
                        }
                        this.dataReceived(value)
                    }
                } catch (error) {
                    this.addSerialLog({ message: error.toString(), type: 'error' })
                } finally {
                    this.reader.releaseLock()
                }
            }
            await this.serialPort?.close()
        },
        //关闭串口
        async closeSerial() {
            if (this.serialOpen) {
                this.serialOpen = false
                this.reader?.cancel()
                this.serialToggle = this.$t('openSerialPort')
                this.disabledOptions(false)
                this.serialStatusChange(false)
                //先解锁
                await this.reader?.releaseLock()
                // await this.serialPort.forget()
                await this.serialPort?.close()
            }
        },
        //串口状态 提示信息 
        serialStatusChange(status) {
            let tip
            if (status) {
                tip = this.$t('deviceConnected')
                this.isConnect = true
            } else {
                tip = this.$t('connectionDown')
                this.isConnect = false
            }
            this.statusMsg = tip
            this.$emit('StatusMsg', { message: tip, flag: this.isConnect })
        },
        //禁用或恢复串口选项
        disabledOptions(disabled) {
            this.disabledSerialOption = disabled
        },
        //系统日志
        addSerialLog(data) {
            this.$message({
                message: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${data.message}`,
                type: 'error',
                showClose: true
            })
            this.$emit('SerialLog', {
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${data.message}`,
                result: data.type,
            })
        },
        //格式化转换
        transformReadData(data) {
            // let newMsg = ''
            //16进制转换
            /*  if (this.toolOptions.logType.includes('hex')) {
                 let dataHex = []
                 for (const d of data) {
                     //转16进制并补0
                     dataHex.push(('0' + d.toString(16).toLocaleUpperCase()).slice(-2))
                 }
                  if (this.toolOptions.logType.includes('&')) {
                      newMsg += 'HEX:'
                  }
                 newMsg += dataHex.join(' ')// + '<br/>'
             } */
            //文本转换
            // if (this.toolOptions.logType.includes('ascii')) {
            // let dataAscii = this.asciideCoder.decode(Uint8Array.from(data))
            //  if (this.toolOptions.logType.includes('&')) {
            //      newMsg += 'TXT:'
            //  }
            // newMsg += dataAscii// + '<br/>'
            // }
            this.$emit('SerialRead', this.asciideCoder.decode(Uint8Array.from(data)));
        },
    },

}
</script>

<style lang="scss" scoped>
.default_com {
    position: absolute;
    top: 0;
    left: 130px;
    color: rgb(212, 17, 17);
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
}

.serial_btn {
    img {
        height: 20px;
    }
}
</style>