<template>
  <div class="app_container">
    <!--左侧串口配置-->
    <div class="left_aside">
      <div v-show="leftFlag" class="left_collapse">
        <el-form ref="ruleForm" :model="serialOptions" status-icon label-width="80px" class="demo-ruleForm">
          <!-- 波特率 -->
          <el-form-item :label="$t('baudRate')" prop="baudRate">
            <el-autocomplete v-model="serialOptions.baudRate" class="inline-input" style="width: 100%;"
              :disabled="disabledSerialOption" :fetch-suggestions="querySearch" placeholder="" :trigger-on-focus="false">
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
            <el-autocomplete v-model="serialOptions.bufferSize" class="inline-input" :disabled="disabledSerialOption"
              style="width: 100%;" :fetch-suggestions="bufferQuerySearch" placeholder="" :trigger-on-focus="false">
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
            <el-button type="info" @click="handleChangeSerial">{{ $t('selectSerialPort') }}</el-button>
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
      </div>
      <button class="toggle_button" :title="$t('hiddenOrOpenSidebar')" @click="leftFlag = !leftFlag">
        <i v-if="leftFlag" class="el-icon-arrow-left"></i>
        <i v-else class="el-icon-arrow-right"></i>
      </button>
    </div>
    <!--中间串口日志-->
    <div class="main">
      <div class="top_button">
        <h1 class="h3">{{ $t('serialPortLogs') }}</h1>

        <div class="btn_toolbar">
          <div>
            <el-form label-width="135px" class="demo-ruleForm">
              <el-form-item :label="$t('SubcontractingOvertime')">
                <!-- <el-input v-model="ruleForm.name"></el-input> -->
                <el-input v-model.number="toolOptions.timeOut" placeholder="">
                  <!-- <template slot="prepend">分包超时</template> -->
                </el-input>
              </el-form-item>
            </el-form>
          </div>

          <div>
            <el-form label-width="80px" class="demo-ruleForm">
              <el-form-item :label="$t('logType')">
                <!-- <span>日志类型</span> -->
                <el-select v-model="toolOptions.logType" placeholder="" style="width: 120px;">
                  <el-option
                    v-for="item in [{ value: 'hex&ascii', label: $t('All') }, { value: 'hex', label: 'Hex' }, { value: 'ascii', label: 'ASCII' }]"
                    :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <div>
            <el-button-group>
              <el-button plain @click="handleAutoScroll">{{ $t('AutoScroll') }}</el-button>
              <el-button plain @click="handleClean">{{ $t('clean') }}</el-button>
              <el-button plain @click="handleCopy">{{ $t('copy') }}</el-button>
              <el-button plain @click="handleExport">{{ $t('export') }}</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      <!-- 日志内容 -->
      <div id="serial-logs" class="logs_content">
        <!-- {{ sysSerialLogs }} -->
      </div>
      <div class="bottom_control">
        <el-input v-model="toolOptions.content" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
          :placeholder="$t('sendContentIsStringOrHex')">
        </el-input>
        <div>
          <div class="btn_toolbar">
            <el-checkbox v-model="toolOptions.addCRLF" :label="$t('LastLineFeed')" size="small"></el-checkbox>
            <el-checkbox v-model="toolOptions.hexSend" :label="$t('HEXSend')" size="small"></el-checkbox>
            <el-checkbox v-model="toolOptions.loopSend" :label="$t('loopSend')" size="small"></el-checkbox>
            <div class="input_group">
              <el-input v-model.number="toolOptions.loopSendTime" placeholder="" size="small" style="width: 260px"
                type="number">
                <template slot="prepend">{{ $t('sendTime') }}</template>
              </el-input>
            </div>
          </div>
          <el-button type="primary" class="serial_send" @click="handleSend">
            {{ $t('send') }}</el-button>
        </div>
      </div>
    </div>
    <!--右侧串口工具-->
    <div class="right_aside">
      <button class="toggle_button" :title="$t('hiddenOrOpenSidebar')" @click="rightFlag = !rightFlag">
        <i v-if="rightFlag" class="el-icon-arrow-right"></i>
        <i v-else class="el-icon-arrow-left"></i>
      </button>
      <div v-show="rightFlag" class="right_collapse" style="width:428px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane :label="$t('FastSending')" name="first">
            <div class="tab_pane_content">
              <!-- 选择分组 -->
              <div class="btn_toolbar">
                <el-form ref="form" label-width="80px" size="small">
                  <el-form-item :label="$t('selectGroup')">
                    <el-select v-model="selectGroup" placeholder="" value-key="name" style="width: 140px">
                      <el-option v-for="item in quickSendList" :key="item.name" :label="item.name" :value="item">
                      </el-option>
                    </el-select>
                    <el-button-group>
                      <el-button plain size="small" @click="handleAdd">{{ $t('Added') }}</el-button>
                      <el-button plain size="small" @click="handleModifyName">{{ $t('rename')
                      }}</el-button>
                      <el-button plain size="small" @click="handleDelete">{{ $t('delete')
                      }}</el-button>
                      <!-- <button class="btn btn-sm btn-outline-secondary">云端</button> -->
                    </el-button-group>
                  </el-form-item>

                </el-form>
              </div>
              <div class="btn_group">
                <el-button plain @click="handleAddOne"><i class="el-icon-plus"></i> {{ $t('AddOne')
                }}</el-button>
                <el-button plain @click="handleImport"><i class="el-icon-download"></i>
                  {{ $t('import') }}</el-button>
                <input id="serial-quick-send-import" ref="importFile" style="display: none;" type="file"
                  accept="application/json" />
                <el-button plain @click="handleExportContent"><i class="el-icon-upload2"></i>
                  {{ $t('export') }}</el-button>
              </div>
              <!-- 表头说明 -->
              <div class="send_title">
                <span>{{ $t('remove') }}</span>
                <span>{{ $t('sendContentModifyDbRename') }}</span>
                <span>{{ $t('showName') }}</span>
                <span>HEX</span>
              </div>
              <div class="send_content">
                <div v-for="(item, index) in selectGroup.list" :key="index" class="serial_quick_send_item">
                  <div>
                    <span class="el-icon-close" @click="handleDelSerialSendItem(index, selectGroup.list)"></span>
                  </div>
                  <div>
                    <el-input v-model="item.content"></el-input>
                  </div>
                  <div>
                    <el-button type="info" @click="handleSendItem(item)">
                      <span @dblclick="handleSendItemDBClick(item)">{{ item.name }}</span>
                    </el-button>
                  </div>
                  <div>
                    <el-checkbox v-model="item.hexSend"></el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('SystemOptions')" name="second">
            <h5>{{ $t('systemConfiguration') }}</h5>
            <el-button><i class="el-icon-refresh" @click="handleReset"></i> {{ $t('ResetParameters')
            }}</el-button>
            <el-button @click="handleExportConfig"><i class="el-icon-upload2"></i> {{ $t('exportConfiguration')
            }}</el-button>
            <el-button @click="handleImportConfig"><i class="el-icon-download"></i> {{ $t('importConfiguration')
            }}</el-button>
            <input id="serial-import-file" ref="importConfig" style="display: none;" type="file"
              accept="application/json" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div id="SerialTest">
      <span>非https协议不可测试</span>
    </div>
  </div>
</template>

<script>
import { getUuid } from '@/utils'
import Mixin from './mixin'
/* IThelperdest@5555 */


/* 串口调试 */
export default {
  name: 'ComConfig',
  mixins: [Mixin],
  data() {
    return {
      activeName: 'first',
      serialOptions: {
        baudRate: '115200',
        dataBits: 8,
        stopBits: 1,
        parity: 'None',
        bufferSize: '1024',
        flowControl: 'None'
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
      quickSendList: [
        {
          name: 'ESP32 AT指令',
          list: [
            {
              name: '测试 AT 启动',
              content: 'AT',
              hexSend: false,
              id: 0,
            },
            {
              name: '重启模块',
              content: 'AT+RST',
              hexSend: false,
              id: 1
            },
            {
              name: '查看版本信息',
              content: 'AT+GMR',
              hexSend: false,
              id: 2
            },
            {
              name: '查询当前固件支持的所有命令及命令类型',
              content: 'AT+CMD?',
              hexSend: false,
              id: 3
            },
            {
              name: '进⼊ Deep-sleep 模式 1分钟',
              content: 'AT+GSLP=60000',
              hexSend: false,
              id: 4
            },
            {
              name: '开启AT回显功能',
              content: 'ATE1',
              hexSend: false,
              id: 5
            },
            {
              name: '关闭AT回显功能',
              content: 'ATE0',
              hexSend: false,
              id: 6
            },
            {
              name: '恢复出厂设置',
              content: 'AT+RESTORE',
              hexSend: false,
              id: 7
            },
            {
              name: '查询 UART 当前临时配置',
              content: 'AT+UART_CUR?',
              hexSend: false,
              id: 8
            },
            {
              name: '设置 UART 115200 保存flash',
              content: 'AT+UART_DEF=115200,8,1,0,3',
              hexSend: false,
              id: 9
            },
            {
              name: '查询 sleep 模式',
              content: 'AT+SLEEP?',
              hexSend: false,
              id: 10
            },
            {
              name: '查询当前剩余堆空间和最小堆空间',
              content: 'AT+SYSRAM?',
              hexSend: false,
              id: 11
            },
            {
              name: '查询系统提示信息',
              content: 'AT+SYSMSG?',
              hexSend: false,
              id: 12
            },
            {
              name: '查询 flash 用户分区',
              content: 'AT+SYSFLASH?',
              hexSend: false,
              id: 13
            },
            {
              name: '查询本地时间戳',
              content: 'AT+SYSTIMESTAMP?',
              hexSend: false,
              id: 14
            },
            {
              name: '查询 AT 错误代码提示',
              content: 'AT+SYSLOG?',
              hexSend: false,
              id: 15
            },
            {
              name: '设置/查询系统参数存储模式',
              content: 'AT+SYSPARA?',
              hexSend: false,
              id: 16
            },
          ],
        },
      ],
      autoText: this.$t('AutoScroll'),
      selectGroup: null,
      leftFlag: true,
      rightFlag: false,
    }
  },
  created() {

    /*  if (location.protocol !== 'https:') {
       this.$message('非https协议 止页面不可测试')
       return
     } */

    //添加id以做标识
    this.quickSendList.forEach((item) => {
      item['id'] = getUuid()
      if (item.list) {
        item.list.forEach((res) => {
          res['id'] = getUuid()
        })
      }
    })

    //还原参数
    let list = localStorage.getItem('quickSendList');
    let options = localStorage.getItem('serialOptions');
    if (list) {
      this.quickSendList = JSON.parse(list)
    }
    if (options) {
      let obj = JSON.parse(options);
      for (const key in obj) {
        if (key == 'baudRate' || key == 'bufferSize') {
          this.serialOptions[key] = obj[key] + ''
        } else {
          this.serialOptions[key] = obj[key]
        }
      }
    }

    document.querySelectorAll('.toggle-button').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.currentTarget.parentElement.querySelector('.collapse').classList.toggle('show')
        e.currentTarget.querySelector('i').classList.toggle('bi-chevron-compact-right')
        e.currentTarget.querySelector('i').classList.toggle('bi-chevron-compact-left')
      })
    })
    this.selectGroup = this.quickSendList[0]
  },
  mounted() {
    /*  if (location.protocol !== 'https:') {
       return
     } */
    let that = this
    document.getElementById('serial-quick-send-import').addEventListener('change', (e) => {
      let file = e.target.files[0]
      e.target.value = ''
      let reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        try {
          let list = JSON.parse(data)
          let index = that.quickSendList.findIndex(res => res.id === that.selectGroup.id)
          that.$set(that.quickSendList[index], 'list', list)
          that.saveQuickList()
        } catch (e) {
          that.showMsg(this.$t('importFailed') + ':' + e.message)
        }
      }
      reader.readAsText(file)
    })

    document.getElementById('serial-import-file').addEventListener('change', (e) => {
      let file = e.target.files[0]
      e.target.value = ''
      let reader = new FileReader()
      reader.onload = function (e) {
        let data = e.target.result
        try {
          let obj = JSON.parse(data)
          if (obj.serialOptions == null) {
            localStorage.removeItem('serialOptions')
          } else {
            localStorage.setItem('serialOptions', obj.serialOptions)
          }
          if (obj.toolOptions == null) {
            localStorage.removeItem('toolOptions')
          } else {
            localStorage.setItem('toolOptions', obj.toolOptions)
          }
          if (obj.quickSendList == null) {
            localStorage.removeItem('quickSendList')
          } else {
            localStorage.setItem('quickSendList', obj.quickSendList)
          }

          location.reload()
        } catch (e) {
          that.showMsg(this.$t('importFailed') + ':' + e.message)
        }
      }
      reader.readAsText(file)
    })
  },
  methods: {
    handleSendItemDBClick(item) {
      this.$prompt(this.$t('pleaseEnterNewName'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        inputValue: item.name
      }).then(({ value }) => {
        this.$set(item, 'name', value)
        this.saveQuickList()
      }).catch(() => {
      });
    },
    handleReset() {
      this.$confirm(this.$t('isResetParam'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('serialOptions')
        localStorage.removeItem('toolOptions')
        localStorage.removeItem('quickSendList')
        location.reload()
      }).catch(() => {
      });
    },
    handleExportConfig() {
      let data = {
        serialOptions: localStorage.getItem('serialOptions'),
        toolOptions: localStorage.getItem('toolOptions'),
        quickSendList: localStorage.getItem('quickSendList'),
      }
      let blob = new Blob([JSON.stringify(data)], { type: 'text/plain' })
      this.saveAs(blob, 'web-serial-debug.json')
    },
    handleImportConfig() {
      this.$refs.importConfig.click()
    },
    handleExportContent() {
      let data = JSON.stringify(this.selectGroup.list)
      let blob = new Blob([data], { type: 'text/plain' })
      this.saveAs(blob, this.selectGroup.name + '.json')
    },
    handleImport() {
      this.$refs.importFile.click()
    },
    handleAddOne() {
      let index = this.quickSendList.findIndex(res => res.id === this.selectGroup.id)
      if (index == -1) {
        this.$message({
          showClose: true,
          message: this.$t('AddFailed'),
          type: 'error'
        });
        return
      }
      let item = {
        name: this.$t('send'),
        content: '',
        hexSend: false,
        id: getUuid(),
      }
      this.quickSendList[index].list.push(item)
      this.saveQuickList()
    },
    handleAdd() {
      this.$prompt(this.$t('pleaseEnterNewName'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      }).then(({ value }) => {
        let obj = {
          name: value,
          list: [],
          id: getUuid()
        }
        this.quickSendList.push(obj)
        this.selectGroup = obj
        this.saveQuickList()
      }).catch(() => {
      });
    },
    handleModifyName() {
      this.$prompt(this.$t('pleaseEnterNewName'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        inputValue: this.selectGroup.name
      }).then(({ value }) => {
        let index = this.quickSendList.findIndex(item => item.id === this.selectGroup.id)
        this.$set(this.quickSendList[index], 'name', value)
        this.saveQuickList()
      }).catch(() => {
      });
    },
    handleDelete() {
      if (this.quickSendList.length == 1) return;
      this.$confirm(this.$t('isDeleteGroup'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let index = this.quickSendList.findIndex(item => item.id === this.selectGroup.id)
        this.selectGroup = this.quickSendList[index - 1];
        this.quickSendList.splice(index, 1)
        this.saveQuickList()
      }).catch(() => {
      });
    },
    handleSendItem(item) {
      this.send(item)
    },
    handleDelSerialSendItem(index, list) {
      this.$confirm(this.$t('isDeleteContent'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        list.splice(index, 1)
        this.saveQuickList()
      }).catch(() => {
      });
    },
    saveQuickList() {
      localStorage.setItem('quickSendList', JSON.stringify(this.quickSendList))
    },
    handleAutoScroll() {
      /*  let autoScroll = this.innerText != '自动滚动'
   this.innerText = autoScroll ? '自动滚动' : '暂停滚动'
   changeOption('autoScroll', autoScroll) */
      this.toolOptions.autoScroll = !this.toolOptions.autoScroll
      this.autoText = this.toolOptions.autoScroll ? this.$t('AutoScroll') : this.$t('PauseScrolling')
    },
    handleClean() {
      document.getElementById('serial-logs').innerHTML = ''
    },
    handleCopy() {
      this.copyText(document.getElementById('serial-logs').innerText)
    },
    handleExport() {
      let text = document.getElementById('serial-logs').innerText
      if (text) {
        this.saveText(text)
      }
    },
    //保存文本
    saveText(text) {
      let blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      this.saveAs(blob, 'serial.log')
    },

    //下载文件
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
      } else {
        let link = document.createElement('a')
        let body = document.querySelector('body	')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        // fix Firefox
        link.style.display = 'none'
        body.appendChild(link)
        link.click()
        body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    },
    //复制文本
    copyText(text) {
      if (!text) return;
      let textarea = document.createElement('textarea')
      textarea.value = text
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.showMsg(this.$t('CopiedToClipboard'))
    },
    bufferQuerySearch(queryString, cb) {
      var restaurants = this.bufferSizes;
      var results = queryString ? restaurants.filter(res => { if (res.value.includes(queryString)) { return res }; return '' }) : restaurants;
      // 调用 callback 返回建议列表的数据
      console.log(results)
      cb(results);

    },
    querySearch(queryString, cb) {
      var restaurants = this.bauds;
      var results = queryString ? restaurants.filter(res => { if (res.value.includes(queryString)) { return res }; return '' }) : restaurants;
      // 调用 callback 返回建议列表的数据
      console.log(results)
      cb(results);

    },
  }
}
</script>
<style lang="scss" scoped>
#SerialTest {
  position: absolute;
  z-index: 10000;
  height: 99.8%;
  width: 99.8%;
  background-color: rgba(255, 255, 255, 0);
  top: 0;
  transform: translate(1% / 2, 1% / 2);
  pointer-events: none;

  &>span {
    font-size: 30px;
    // transform-origin: center center;
    // transform: rotate(45deg);
    position: absolute;
    top: 50%;
    right: calc(50% - 120px);
    opacity: 0.3;
  }
}

::v-deep {
  .text-primary {
    color: #3390ff;
  }

  .text-success {
    color: #19a7d3;
  }
}

.app_container {
  height: inherit;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  min-width: 1024px;
  overflow: auto;

  .left_aside {
    background-color: #f8f9fa;
    box-sizing: border-box;
    display: flex;

    .left_collapse {
      width: 280px;
      height: inherit;
      padding: 5px;
      display: inline-block;
    }

    .toggle_button {
      display: inline-block;
      height: inherit;
      border: 0px solid transparent;
      background-color: #f8f9fa;

      &:hover {
        background-color: #f0f1f7;
      }
    }
  }

  .main {
    flex: 1;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .top_button {
      display: flex;

      .h3 {
        // display: inline-block;
        padding: 0;
        margin: 5px;
        font-weight: normal;
      }

      .btn_toolbar {
        // display: inline-block;
        flex: 1;
        // border: 1px solid red;
        // display: flex;
        text-align: right;

        &>div {
          display: inline-block;

          // border: 1px solid blue;
          &:nth-child(1) {
            width: 200px;
          }

          &:nth-child(2) {
            margin: 0 5px;

            >span {
              // margin: 0 5px;
              background-color: #f5f7fa;
              display: inline-block;
              // height: 26px;
              line-height: 30px;
              width: 80px;
              text-align: center;
            }
          }
        }
      }
    }

    .logs_content {
      flex: 1;
      border: 1px solid #ccc;
      margin-bottom: 5px;
      border-radius: 5px;
      overflow: auto;
    }

    .bottom_control {
      &>div {
        margin-top: 5px;
        position: relative;

        .btn_toolbar {
          display: inline-block;
          vertical-align: bottom;

          .input_group {
            display: inline;
            margin-left: 10px;
            position: relative;
            top: 1px;
          }
        }

        .serial_send {
          position: absolute;
          right: 0;
        }
      }
    }
  }

  .right_aside {
    background-color: #f8f9fa;
    overflow: hidden;
    display: flex;

    .toggle_button {
      height: inherit;
      border: 0px solid transparent;
      background-color: #f8f9fa;

      &:hover {
        background-color: #f0f1f7;
      }
    }

    .right_collapse {
      height: 100%;
      box-sizing: border-box;
      padding: 5px;

      .el-tabs {
        height: 100%;

        ::v-deep {
          .el-tabs__content {
            height: inherit;

            .el-tab-pane {
              height: inherit;

              .tab_pane_content {
                display: flex;
                flex-direction: column;
                height: calc(100% - 55px);

                .btn_toolbar {
                  position: relative;

                  .el-form {
                    .el-form-item {
                      position: relative;

                      .el-button-group {
                        position: absolute;
                        right: 0;
                      }
                    }

                  }
                }

                .btn_group {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                }

                .send_title {
                  display: flex;
                  justify-content: space-between;
                  padding: 0 8px;
                }

                .send_content {
                  overflow: auto;
                  flex: 1;
                  border: 2px solid #ccc;
                  border-radius: 5px;
                  padding: 5px;
                  box-sizing: border-box;

                  .serial_quick_send_item {
                    display: flex;
                    line-height: 32px;
                    margin-bottom: 5px;

                    &>div:nth-child(1) {
                      &>span {
                        display: inline-block;
                        // height: 32px;
                        width: 30px;
                        border: 1px solid #eee;
                        margin-right: 5px;
                        text-align: center;
                        border-radius: 5px;
                        line-height: 30px;
                        position: relative;
                        top: 1px;

                        &:hover {
                          background-color: #aaa;
                        }
                      }
                    }

                    &>div:nth-child(2) {
                      // flex: 1;
                      width: 100%;
                    }

                    &>div:nth-child(3) {
                      // flex: 1;
                      margin: 0 5px;
                    }

                    &>div:nth-child(4) {
                      flex: 1;
                      // margin-left: 5px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}
</style>
