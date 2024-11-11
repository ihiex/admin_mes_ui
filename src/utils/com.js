import { Message, MessageBox } from 'element-ui';
import i18n from '@/language'

export default class Com {

    constructor(_config) {
        this.config = {
            baudRate: parseInt(_config.COM_BaudRate), //校验位
            dataBits: parseInt(_config.COM_DataBits), //数据位
            parity: _config.COM_Parity.toLowerCase(), //校验位
            stopBits: parseInt(_config.COM_StopBits), //停止位
            bufferSize: _config.bufferSize ? parseInt(_config.bufferSize) : '1024',
            flowControl: _config.flowControl ? _config.flowControl.toLowerCase() : 'none', // HardWare
        }
        this.Port = 'COM1'; //串口
        this.serialPort = null
        this.toolOptions = {
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
        }
        this.serialOpen = false
        this.serialClose = true
        this.reader = null
        navigator.serial.getPorts().then((ports) => {
            if (ports.length > 0) {
                this.serialPort = ports[0]
                // console.log(this.serialPort.getSignals())
                // this.serialPort.getSignals().then(res=>{
                //     console.log(res)
                // })
                this.serialStatusChange(true)
            }
        })
        //串口事件监听
        navigator.serial.addEventListener('connect', (e) => {
            console.log(2)
            this.serialStatusChange(true)
            this.serialPort = e.target
            //未主动关闭连接的情况下,设备重插,自动重连
            if (!this.serialClose) {
                this.handleOpenSerial()
            }
        })
        navigator.serial.addEventListener('disconnect', (e) => {
            console.log(3)
            this.serialStatusChange(false)
            setTimeout(this.closeSerial, 500)
        })
    }

    //打开串口
    async openSerial() {
        let SerialOptions = this.config
        console.log(SerialOptions)
        this.serialPort
            .open(SerialOptions)
            .then(() => {
                // this.serialToggle = this.$t('closeSerialPort')
                this.serialOpen = true
                this.serialClose = false
                // this.disabledOptions(true)
                this.readData()
            })
            .catch((e) => {
                // this.showMsg(this.$t('openSerialPortFailed') + ':' + e.toString())
                console.log(e.toString())
            })
    }

    //串口数据收发
    async send(data) {
        let item = data ? data : this.toolOptions
        if (!item.content) {
            // this.addLogErr(this.$t('SendContentIsEmpty'))
            console.log('串口数据收发')
            return
        }
        if (item.hexSend) {
            await this.sendHex(item.content)
        } else {
            await this.sendText(item.content)
        }
    }

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
            // this.addLogErr(this.$t('HexFormatError') + ':' + hex)
            console.log('发送HEX到串口' + hex)

        }
    }
    //写串口数据
    async writeData(data) {
        if (!this.serialPort || !this.serialPort.writable) {
            // this.addLogErr(this.$t('PleaseOpenSerialPortOnSendData'))
            console.log('写串口数据')

            return
        }
        const writer = this.serialPort.writable.getWriter()
        if (this.toolOptions.addCRLF) {
            data = new Uint8Array([...data, 0x0d, 0x0a])
        }
        await writer.write(data)
        writer.releaseLock()
        // this.addLog(data, false)
    }
    //发送ASCII到串口
    async sendText(text) {
        const encoder = new TextEncoder()
        this.writeData(encoder.encode(text))
    }

    //检查是否串口打开
    handleOpenSerial() {
        if (!this.serialPort) {
            // this.showMsg(this.$t('PleaseSelectSerialPort'))
            console.log('请选择串口')
            return
        }

        if (this.serialPort.writable && this.serialPort.readable) {
            this.closeSerial()
            this.serialClose = true
            return
        }

        this.openSerial()
    }
    //选择串口
    async handleChangeSerial() {
        // 客户端授权
        let that = this
        try {
            await navigator.serial.requestPort().then((port) => {
                debugger
                //关闭旧的串口
                that.serialPort?.forget()
                that.serialPort?.close()

                that.serialPort = port
                that.serialStatusChange(true)
            }, error => {
                let eMsg = error.toString()
                if (!eMsg.includes('No port selected by the user')) {
                    Message({
                        message: /* that.$t('ObtainingSerialPortPermissionFailed') + ': ' + */ eMsg,
                        type: 'error'
                    })
                }
            })
        } catch (e) {
            Message({
                message: /* that.$t('SerialPortException') + ':' + */ e.toString(),
                type: 'error'
            })
        }
    }


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
                    // this.dataReceived(value)
                    console.log(value)
                }
            } catch (error) {
            } finally {
                this.reader.releaseLock()
            }
        }
        await this.serialPort.close()
    }

    //关闭串口
    async closeSerial() {
        if (this.serialOpen) {
            this.serialOpen = false
            // this.reader?.cancel()
            // this.serialToggle = this.$t('openSerialPort')
            // this.disabledOptions(false)
            // await this.serialPort.forget()
            await this.serialPort?.close()
        }
    }

    //串口状态 提示信息
    serialStatusChange(status) {
        let tip
        if (status) {
            tip = i18n.t('deviceConnected')
        } else {
            tip = i18n.t('connectionDown')
        }
        console.log(tip)
        return tip
    }
}
