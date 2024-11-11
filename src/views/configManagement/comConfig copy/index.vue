<template>
    <div class="com">
        <div id="main" class="d-flex">
            <!--左侧串口配置-->
            <div id="serial-options" class="col-auto m-0 bg-light sidebar">
                <div class="collapse show p-2 float-start">
                    <div class="input-group mb-3">
                        <span class="input-group-text">波特率</span>
                        <input id="serial-baud" class="form-control" type="number" placeholder="选择波特率" value="115200"
                            list="baud-list">
                        <datalist id="baud-list">
                            <option>110</option>
                            <option>300</option>
                            <option>600</option>
                            <option>1200</option>
                            <option>2400</option>
                            <option>4800</option>
                            <option>7200</option>
                            <option>9600</option>
                            <option>14400</option>
                            <option>19200</option>
                            <option>28800</option>
                            <option>38400</option>
                            <option>56000</option>
                            <option>57600</option>
                            <option>76800</option>
                            <option>115200</option>
                            <option>230400</option>
                            <option>460800</option>
                        </datalist>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">数据位</span>
                        <select id="serial-data-bits" class="form-select">
                            <option>8</option>
                            <option>7</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">停止位</span>
                        <select id="serial-stop-bits" class="form-select">
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">校验位</span>
                        <select id="serial-parity" class="form-select">
                            <Option value="none">None</Option>
                            <Option value="even">Even</Option>
                            <Option value="odd">Odd</Option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">缓冲区</span>
                        <input id="serial-buffer-size" class="form-control" type="number" placeholder="缓冲区大小"
                            list="buffer-size-list" max="1677216" value="1024">
                        <datalist id="buffer-size-list">
                            <option>255</option>
                            <option>512</option>
                            <option>1024</option>
                            <option>2048</option>
                            <option>4096</option>
                            <option>8192</option>
                        </datalist>
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">流控制</span>
                        <select id="serial-flow-control" class="form-select">
                            <Option value="none">None</Option>
                            <Option value="hardware">HardWare</Option>
                        </select>
                    </div>

                    <div class="d-flex mt-2">
                        <button id="serial-select-port" class="btn btn-secondary me-3">选择串口</button>
                        <button id="serial-open-or-close" class="btn btn-primary flex-grow-1">打开串口</button>
                    </div>

                    <div id="serial-status" class="mt-2">
                        <div class="alert alert-info" role="alert">
                            未选择串口
                        </div>
                    </div>
                </div>
                <button class="toggle-button float-end" title="隐藏/打开边栏">
                    <i class="bi bi-chevron-compact-left"></i>
                </button>

            </div>
            <div class="clear"></div>
            <!--中间串口日志-->
            <div id="log-main" class="flex-fill px-md-2">
                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-1 pb-1 mb-1 flex-shrink-0">
                    <h1 class="h3">串口日志</h1>

                    <div class="btn-toolbar">
                        <div class="input-group input-group-sm me-2">
                            <span class="input-group-text">分包超时</span>
                            <input id="serial-timer-out" class="form-control" type="number" placeholder="0不分包"
                                value="50" style="width: 100px;" />
                        </div>

                        <div class="input-group input-group-sm me-2">
                            <span class="input-group-text">日志类型</span>
                            <select id="serial-log-type" class="form-select" style="width: 120px;">
                                <Option value="hex&ascii">全部</Option>
                                <Option value="hex">Hex</Option>
                                <Option value="ascii">ASCII</Option>
                            </select>
                        </div>

                        <div class="btn-group">
                            <button id="serial-auto-scroll" class="btn btn-sm btn-outline-secondary">自动滚动</button>
                            <button id="serial-clear" class="btn btn-sm btn-outline-secondary">清空</button>
                            <button id="serial-copy" class="btn btn-sm btn-outline-secondary">复制</button>
                            <button id="serial-save" class="btn btn-sm btn-outline-secondary">导出</button>
                        </div>
                    </div>
                </div>
                <div id="serial-logs" class="flex-grow-1 border border-2 rounded mb-2"></div>
                <div class="flex-shrink-0 mb-2">
                    <textarea id="serial-send-content" class="form-control" rows="3" style="resize: none;"
                        placeholder="在此输入要发送的内容,可以是字符串(如:你好,世界!),也可以是HEX(如:49544c4447)"></textarea>
                    <div
                        class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-1 pb-1 mb-1 flex-shrink-0">
                        <div class="btn-toolbar">
                            <div class="form-check align-self-center me-2">
                                <input id="serial-add-crlf" class="form-check-input" type="checkbox">
                                <label class="form-check-label" for="serial-add-crlf">
                                    末尾加回车换行
                                </label>
                            </div>
                            <div class="form-check align-self-center me-2">
                                <input id="serial-hex-send" class="form-check-input" type="checkbox">
                                <label class="form-check-label" for="serial-hex-send">
                                    HEX发送
                                </label>
                            </div>
                            <div class="form-check align-self-center me-2">
                                <input id="serial-loop-send" class="form-check-input" type="checkbox">
                                <label class="form-check-label" for="serial-loop-send">
                                    循环发送
                                </label>
                            </div>
                            <div class="input-group input-group-sm">
                                <span class="input-group-text">发送间隔(MS)</span>
                                <input id="serial-loop-send-time" class="form-control" type="number" placeholder=""
                                    min="1" value="1000" style="width: 100px;" />
                            </div>
                        </div>
                        <button id="serial-send" class="btn btn-primary h-10 px-5"><i class="bi bi-send"></i>
                            发送</button>
                    </div>
                </div>
            </div>
            <div class="clear"></div>

            <!--右侧串口工具-->
            <div id="serial-tools" class="col-auto m-0 bg-light sidebar">
                <button class="toggle-button float-start" title="隐藏/打开边栏">
                    <i class="bi bi-chevron-compact-right"></i>
                </button>
                <div class="collapse show p-1 float-start overflow-hidden" style="width:428px">

                    <nav>
                        <div id="nav-tab" class="nav nav-tabs" role="tablist">
                            <button id="nav-quick-send-tab" class="nav-link active" data-bs-toggle="tab"
                                data-bs-target="#nav-quick-send" type="button" role="tab" aria-controls="nav-quick-send"
                                aria-selected="true">快捷发送</button>
                            <button id="nav-options-tab" class="nav-link" data-bs-toggle="tab"
                                data-bs-target="#nav-options" type="button" role="tab" aria-controls="nav-options"
                                aria-selected="false">系统选项</button>
                        </div>
                    </nav>
                    <div id="nav-tabContent" class="tab-content pt-2 flex-fill">
                        <div id="nav-quick-send" class="tab-pane fade show active" role="tabpanel"
                            aria-labelledby="nav-quick-send-tab">
                            <div class="btn-toolbar">
                                <div class="flex-grow-1 input-group input-group-sm me-2">
                                    <span class="input-group-text">选择分组</span>
                                    <select id="serial-quick-send" class="form-select">
                                    </select>
                                </div>

                                <div class="btn-group">
                                    <button id="serial-quick-send-add-group"
                                        class="btn btn-sm btn-outline-secondary">新增</button>
                                    <button id="serial-quick-send-rename-group"
                                        class="btn btn-sm btn-outline-secondary">改名</button>
                                    <button id="serial-quick-send-remove-group"
                                        class="btn btn-sm btn-outline-secondary">删除</button>
                                    <!-- <button class="btn btn-sm btn-outline-secondary">云端</button> -->
                                </div>
                            </div>
                            <div class="d-flex mt-2">
                                <button id="serial-quick-send-add" class="btn btn-sm btn-outline-secondary me-5"><i
                                        class="bi bi-plus-square"></i> 增加一条</button>
                                <button id="serial-quick-send-import-btn"
                                    class="btn btn-sm btn-outline-secondary me-2 flex-grow-1"><i
                                        class="bi bi-folder-plus"></i>
                                    导入</button>
                                <input id="serial-quick-send-import" style="display: none;" type="file"
                                    accept="application/json" />
                                <button id="serial-quick-send-export"
                                    class="btn btn-sm btn-outline-secondary flex-grow-1"><i
                                        class="bi bi-folder-symlink"></i>
                                    导出</button>
                            </div>
                            <div class="mt-2">
                                <div class="d-flex">
                                    <span class="me-2 ms-3">移除</span>
                                    <span class="flex-grow-1 me-1">发送内容,点击修改,双击改名</span>
                                    <span class="flex-shrink-0 me-3">显示名称</span>
                                    <span class="flex-shrink-0 me-2">HEX</span>
                                </div>
                            </div>
                            <div id="serial-quick-send-content"
                                class="flex-grow-1 border border-2 p-2 rounded overflow-auto">
                            </div>
                        </div>
                        <div id="nav-options" class="tab-pane fade" role="tabpanel" aria-labelledby="nav-options-tab">
                            <h5>系统配置</h5>
                            <button id="serial-reset" class="btn btn-sm btn-outline-secondary me-2"><i
                                    class="bi bi-arrow-repeat"></i> 重置参数</button>
                            <button id="serial-export" class="btn btn-sm btn-outline-secondary me-2"><i
                                    class="bi bi-folder-symlink"></i> 导出配置</button>
                            <button id="serial-import" class="btn btn-sm btn-outline-secondary me-2"><i
                                    class="bi bi-folder-plus"></i> 导入配置</button>
                            <input id="serial-import-file" style="display: none;" type="file"
                                accept="application/json" />
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div id="model-tip" class="modal fade" aria-hidden="true" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 id="modal-title" class="modal-title fs-5"></h1>
                        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div id="modal-message" class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" data-bs-dismiss="modal">好的</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="model-change-name" class="modal fade" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">名称</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="model-new-name" class="col-form-label">请输入新的名字:</label>
                                <input id="model-new-name" class="form-control" type="text">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">取消</button>
                        <button id="model-save-name" class="btn btn-primary" type="button">保存</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import comFunction from './common'

export default {
    name: 'ComConfig',
    data() {
        return {
            title: '串口调试'
        }
    },
    mounted(){
        comFunction()
    }
}
</script>

<style lang="scss" scoped>
.com {
    // border: 1px solid red;
    background-color: #fff;
    height: inherit;
    padding: 10px;
    box-sizing: border-box;
}
</style>