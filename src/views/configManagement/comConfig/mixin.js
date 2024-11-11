import { Message, MessageBox } from 'element-ui';

export default {
    data() {
        return {
            statusMsg: this.$t('SerialPortNotSelected'),
            serialPort: null,
            reader: null,
            serialOpen: false, //串口目前是打开状态
            serialClose: true, //串口目前是手动关闭状态
            serialTimer: null,  //串口分包合并时钟
            serialloopSendTimer: null,//串口循环发送时钟
            serialData: [], //串口缓存数据
            asciidecoder: new TextDecoder(),//文本解码
            currQuickSend: [],
            serialToggle: this.$t('openSerialPort'),
            toolOptions: {
                //自动滚动
                autoScroll: true,
                //显示时间 界面未开放
                showTime: true,
                //日志类型
                logType: 'hex&ascii',
                //分包合并时间
                timeOut: 50,
                //末尾加回车换行
                addCRLF: false,
                //HEX发送
                hexSend: false,
                //循环发送
                loopSend: false,
                //循环发送时间
                loopSendTime: 1000,
                //输入的发送内容
                content: '',
                //快捷发送选中索引
                quickSendIndex: 0,
            },
            serialTimer: null,
            disabledSerialOption: false,
        }
    },
    created() {
        let data = localStorage.getItem('toolOptions');
        if (data) {
            this.toolOptions = JSON.parse(data)
        }
    },
    mounted() {
        navigator.serial.getPorts().then((ports) => {
            if (ports.length > 0) {
                this.serialPort = ports[0]
                this.serialStatusChange(true)
            }
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
    },
    watch: {
        "toolOptions.addCRLF": function (val, oval) {
            this.changeOption('addCRLF', val)
        },
        "toolOptions.hexSend": function (val, oval) {
            this.changeOption('hexSend', val)
        },
        "toolOptions.loopSend": function (val, oval) {
            this.changeOption('loopSend', val)
            this.resetLoopSend()
        },
        "toolOptions.loopSendTime": function (val, oval) {
            this.changeOption('loopSendTime', parseInt(val))
            this.resetLoopSend()
        },
        "toolOptions.timeOut": function (val, oval) {
            this.changeOption('timeOut', parseInt(val))
        },
        "toolOptions.logType": function (val, oval) {
            this.changeOption('logType', val)
        },
        "toolOptions.autoScroll": function (val, oval) {
            this.changeOption('autoScroll', val)
        },
    },
    methods: {
        //重制发送循环时钟
        resetLoopSend() {
            clearInterval(this.serialloopSendTimer)
            if (this.toolOptions.loopSend) {
                let that = this;
                this.serialloopSendTimer = setInterval(() => {
                    that.send()
                }, that.toolOptions.loopSendTime)
            }
        },
        changeOption(key, value) {
            this.toolOptions[key] = value
            localStorage.setItem('toolOptions', JSON.stringify(toolOptions))
        },
        //发送
        handleSend() {
            this.send()
        },
        //串口数据收发
        async send(data) {
            let item = data ? data : this.toolOptions
            if (!item.content) {
                this.addLogErr(this.$t('SendContentIsEmpty'))
                return
            }
            if (item.hexSend) {
                await this.sendHex(item.content)
            } else {
                await this.sendText(item.content)
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
                this.addLogErr(this.$t('HexFormatError') + ':' + hex)
            }
        },
        //写串口数据 
        async writeData(data) {
            if (!this.serialPort || !this.serialPort.writable) {
                this.addLogErr(this.$t('PleaseOpenSerialPortOnSendData'))
                return
            }
            const writer = this.serialPort.writable.getWriter()
            if (this.toolOptions.addCRLF) {
                data = new Uint8Array([...data, 0x0d, 0x0a])
            }
            await writer.write(data)
            writer.releaseLock()
            this.addLog(data, false)
        },
        //发送ASCII到串口
        async sendText(text) {
            const encoder = new TextEncoder()
            this.writeData(encoder.encode(text))
        },
        //检查是否串口打开
        handleOpenSerial() {
            if (!this.serialPort) {
                this.showMsg(this.$t('PleaseSelectSerialPort'))
                return
            }

            if (this.serialPort.writable && this.serialPort.readable) {
                this.closeSerial()
                this.serialClose = true
                return
            }

            this.openSerial()
        },
        //选择串口
        async handleChangeSerial() {
            // 客户端授权
            let that = this
            try {
                await navigator.serial.requestPort().then((port) => {
                    
                    //关闭旧的串口
                    that.serialPort?.forget()
                    that.serialPort?.close()

                    that.serialPort = port
                    that.serialStatusChange(true)
                }, error => {
                    let eMsg = error.toString()
                    if (!eMsg.includes('No port selected by the user')) {
                        Message({
                            message: that.$t('ObtainingSerialPortPermissionFailed') + ': ' + eMsg,
                            type: 'error'
                        })
                    }
                })
            } catch (e) {
                Message({
                    message: that.$t('SerialPortException') + ':' + e.toString(),
                    type: 'error'
                })
            }
        },
        //串口状态 提示信息 
        serialStatusChange(status) {
            let tip
            if (status) {
                tip = this.$t('deviceConnected')
            } else {
                tip = this.$t('connectionDown')
            }
            this.statusMsg = tip
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
                    localStorage.setItem('serialOptions', JSON.stringify(SerialOptions))
                    this.readData()
                })
                .catch((e) => {
                    this.showMsg(this.$t('openSerialPortFailed') + ':' + e.toString())
                })
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
                } finally {
                    this.reader.releaseLock()
                }
            }
            await this.serialPort.close()
        },
        //串口分包合并
        dataReceived(data) {
            let that = this
            that.serialData.push(...data)
            if (that.toolOptions.timeOut == 0) {
                that.addLog(that.serialData, true)
                that.serialData = []
                return
            }
            //清除之前的时钟
            clearTimeout(that.serialTimer)
            that.serialTimer = setTimeout(() => {
                //超时发出
                that.addLog(that.serialData, true)
                that.serialData = []
            }, that.toolOptions.timeOut)
        },
        //关闭串口
        async closeSerial() {
            if (this.serialOpen) {
                this.serialOpen = false
                this.reader?.cancel()
                this.serialToggle = this.$t('openSerialPort')
                this.disabledOptions(false)
                // await this.serialPort?.close()
            }
        },
        //禁用或恢复串口选项
        disabledOptions(disabled) {
            this.disabledSerialOption = disabled
        },
        showMsg(msg, title = 'web serial') {
            MessageBox({
                title: title,
                message: msg
            })
        },
        //添加日志
        addLog(data, isReceive = true) {
            // debugger
            let className = 'text-primary'
            let form = '→'
            if (isReceive) {
                className = 'text-success'
                form = '←'
            }
            let newMsg = ''
            if (this.toolOptions.logType.includes('hex')) {
                let dataHex = []
                for (const d of data) {
                    //转16进制并补0
                    dataHex.push(('0' + d.toString(16).toLocaleUpperCase()).slice(-2))
                }
                if (this.toolOptions.logType.includes('&')) {
                    newMsg += 'HEX:'
                }
                newMsg += dataHex.join(' ') + '<br/>'
            }
            if (this.toolOptions.logType.includes('ascii')) {
                let dataAscii = this.asciidecoder.decode(Uint8Array.from(data))
                if (this.toolOptions.logType.includes('&')) {
                    newMsg += 'TXT:'
                }
                newMsg += dataAscii + '<br/>'
            }

            let time = this.toolOptions.showTime ? this.formatDate(new Date()) + '&nbsp;' : ''
            let template = '<div><span class="' + className + '">' + time + form + '</span><br>' + newMsg + '</div>'
            let tempNode = document.createElement('div')
            if (this.toolOptions.addCRLF) {
                template += '<br/>'
            }
            tempNode.innerHTML = template
            let serialLogs = document.getElementById('serial-logs');

            serialLogs.append(tempNode)
            if (this.toolOptions.autoScroll) {
                serialLogs.scrollTop = serialLogs.scrollHeight - serialLogs.clientHeight
            }
        },
        //系统日志
        addLogErr(msg) {
            let time = this.toolOptions.showTime ? this.formatDate(new Date()) + '&nbsp;' : ''
            const template = '<div><span class="text-danger">' + time + ' ' + this.$t('systemMsg') + '</span><br>' + msg + '</div>'
            let tempNode = document.createElement('div')
            tempNode.innerHTML = template
            let serialLogs = document.getElementById('serial-logs');
            serialLogs.append(tempNode)
            if (this.toolOptions.autoScroll) {
                serialLogs.scrollTop = serialLogs.scrollHeight - serialLogs.clientHeight
            }
        },
        //当前时间 精确到毫秒
        formatDate(now) {
            const hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
            const minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
            const second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
            const millisecond = ('00' + now.getMilliseconds()).slice(-3)
            return `${hour}:${minute}:${second}.${millisecond}`
        },
        //修改参数并保存
        changeOption(key, value) {
            this.toolOptions[key] = value
            localStorage.setItem('toolOptions', JSON.stringify(this.toolOptions))
        }

    }
}