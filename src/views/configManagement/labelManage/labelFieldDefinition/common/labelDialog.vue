<template>
  <el-dialog class="label_dialog" width="50%" title="" :visible.sync="outerVisible" append-to-body :show-close="false">

    <el-dialog class="inner_dialog" width="50%" title="" :visible.sync="innerVisible" append-to-body
      @close="handleInnerClose">
      <el-form ref="form" :model="form" label-width="80px">
        <template v-if="flag === 1">
          <el-form-item :label="$t('module')">
            <el-select v-model="form.module" :placeholder="$t('module')" clearable filterable
              @change="handleModuleChange">
              <el-option v-for="item in moduleOptions" :key="item.ID" :label="item.ModuleName" :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Field')">
            <!-- @change="handleFieldChange" -->
            <el-select v-model="form.field" :placeholder="$t('Field')" clearable filterable>
              <el-option v-for="item in fieldOptions" :key="item.field" :label="item.field" :value="item.field">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Parameter')">
            <div style="display: flex; flex-direction: row; width: 100%;">
              <span v-for="(item, index) in form.params" :key="index" style="margin-right: 5px; width: 100%">
                <el-input v-model="form.params[index]" type="number" clearable></el-input>
              </span>
            </div>
          </el-form-item>
        </template>
        <template v-else-if="flag === 2">
          <el-form-item :label="$t('Function')" style="margin-bottom: 10px;">
            <el-select v-model="form.function" :placeholder="$t('Function')" filterable @change="handleFnChange">
              <el-option v-for="item in functionNameOptions" :key="item.ID" :label="item.FunctionName"
                :value="item.FunctionName">
              </el-option>
            </el-select>
          </el-form-item>

          <el-tree :data="list" node-key="id" default-expand-all
            style="border: 1px solid #ccc; height: 400px; overflow: auto;" :expand-on-click-node="false" draggable
            :allow-drop="allowDrop" :allow-drag="allowDrag" :props="{
              children: 'params',
              label: 'label'
            }" @node-drag-end="handleDragEnd">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span style="margin-right: 10px;">{{ node.label }}</span>
              <span>
                <el-select v-if="data.isObj" v-model="data.function" style="width: 150px;" placeholder="函数" filterable
                  @change="handleFunctionChange(data)">
                  <el-option v-for="item in functionNameOptions" :key="item.ID" :label="item.FunctionName"
                    :value="item.FunctionName">
                  </el-option>
                </el-select>
                <el-input v-else v-model="data.label" style="width: 100px;" clearable @input="handleInput"></el-input>
              </span>
              <span class="tree_btn">
                <el-button v-if="data.isObj" size="mini" circle @click="() => append(data, 1)">
                  <img src="./fx.svg" alt="" style="height: 12px;">
                </el-button>
                <el-button v-if="data.isObj" size="mini" circle @click="() => append(data, 2)">
                  <img src="./params.svg" alt="" style="height: 12px;">
                </el-button>
                <el-button size="mini" icon="el-icon-delete-solid" style="color: #222" circle
                  @click="() => remove(node, data)">
                </el-button>
              </span>
            </span>
          </el-tree>
        </template>
        <template v-else>
          <el-form-item :label="$t('String')">
            <!-- @change="handleInputChange" -->
            <el-input v-model="form.str" :placeholder="$t('String')" clearable></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="innerConfirm">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-input v-model="defStr" type="textarea" :rows="3" style="width: 100%; margin-bottom: 5px" readonly></el-input>
    <div style="border: 1px solid #ccc; height: 300px; overflow: auto">
      <draggable v-model="tagsList" animation="300" @sort="onDraggableUpdate">
        <div v-for="(item, index) in tagsList" :key="index">
          <div :key="index" class="line_container">
            <span>
              {{ item.label }}
            </span>
            <div style="position: absolute; right: 5px; top: 4px">
              <el-button icon="el-icon-edit" circle @click.stop="editLabel(item, index)"></el-button>
              <el-button style="margin-left: 5px" icon="el-icon-delete-solid" circle
                @click.stop="removeLabel(index)"></el-button>
            </div>
          </div>
        </div>
      </draggable>
    </div>
    <div slot="footer" class="dialog-footer" style="clear: left">
      <div style="display: inline-block; float: left">
        <el-button @click="handleAdd(1)">{{ $t('AddField') }}</el-button>
        <el-button @click="handleAdd(2)">{{ $t('AddFunction') }}</el-button>
        <el-button @click="handleAdd(3)">{{ $t('AddString') }}</el-button>
      </div>
      <el-button @click="outerVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import {
  GetVFunctionName,
  GetVModuleName,
  GetDBField
} from '@/api/configCommon.js'
import { uuid } from '@/utils'

export default {
  components: {
    draggable
  },
  data() {
    return {
      form: {
        module: '',
        field: '',
        function: '',
        str: ''
      },
      outerVisible: false,
      innerVisible: false,
      moduleOptions: [],
      functionNameOptions: [],
      fieldOptions: [],
      defStr: '',
      tagsList: [],
      flag: 3,
      editIndex: -1,
      list: [],
      time: null
    };
  },
  watch: {
    defStr(val, oval) {
      if (!val) return;
      this.tagsList = this.objectsToTree(this.getObjectsFromStr(val));
    },
    tagsList(val, oval) {

      let ss = this.getStrFromObjects(val)
    }
  },
  mounted() {

  },
  methods: {
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      this.syncFunction()
    },
    allowDrop(draggingNode, dropNode, type) {
      if (!dropNode.data.isObj) {
        return type !== 'inner';
      } else {
        if (dropNode.data.isTop) {
          return false
        } else {
          return true;
        }
      }
    },
    allowDrag(draggingNode) {
      return true
    },
    append(data, flag) {
      if (!data.isObj) {
        this.$message($t('YouCannotAddArgumentsOrFunctionsUnderArguments'))
        return
      }
      const newChild = { id: uuid(), label: '', params: [], isObj: true };
      if (flag === 1) {
        newChild.isObj = true
        newChild.fn = '';
        newChild.function = '';
        newChild.label = '';
        /*  let fun = this.functionNameOptions[0] ? this.functionNameOptions[0].FunctionName : '';
         newChild.fn = fun.split('(')[0]
         newChild.function = fun
         newChild.label = fun */
      } else {
        newChild.isObj = false
        delete newChild.params
        // newChild.label = 'a'
      }
      if (!data.params) {
        this.$set(data, 'params', []);
      }
      data.params.push(newChild);
    },

    remove(node, data) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const parent = node.parent;
        const children = parent.data.params || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        this.syncFunction()
      }).catch(() => {
      });
    },
    handleFnChange(val) {
      if (!val) return;
      if (this.flag === 2 && this.editIndex < 0) {
        this.$set(this.form, 'fn', val.split('(')[0]);
        this.$set(this.form, 'label', val);
        this.$set(this.form, 'value', 2);
        this.$set(this.form, 'params', []);
        this.$set(this.form, 'isObj', true);
        this.$set(this.form, 'isTop', true);
        this.list = [this.form];

      } else if (this.editIndex >= 0) {
        let index = this.tagsList[this.editIndex].label.indexOf('(');
        let s = this.tagsList[this.editIndex].label.slice(index);
        this.$set(this.form, 'fn', val.split('(')[0])
        this.$set(this.form, 'label', this.form.fn + s);
        this.list = this.objectsToTree(this.getObjectsFromStr(this.form.label))
      }
    },
    handleFunctionChange(item) {
      let index = item.label.indexOf('(')
      this.$set(item, 'fn', item.function.split('(')[0])
      this.$set(item, 'label', item.fn ? item.fn + item.label.slice(index) : '')
      this.syncFunction()
    },
    handleInput() {
      let that = this;
      if (that.time) {
        clearTimeout(that.time);
        that.time = null;
      }
      that.time = setTimeout(function () {
        that.syncFunction()
      }, 500)
    },
    syncFunction() {
      let str = this.getStrFromObjects(this.list)
      this.list = this.objectsToTree(this.getObjectsFromStr(str))
    },

    removeEmpty(list) {
      if (!Array.isArray(list)) return;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].label || list[i].label == '()') {
          list.splice(i--, 1)
        }
        if (list[i] && list[i].params) {
          this.removeEmpty(list[i].params)
        }
      }
    },
    // 转成树 数据
    objectsToTree(list) {
      function setTreeData(list) {
        list.forEach((res, index) => {
          if (typeof res === 'string') {
            list[index] = {
              label: res,
              id: uuid(),
              isObj: false
            }
          } else {
            list[index].isObj = true;
            list[index].params && setTreeData(list[index].params)
          }
        })
      }

      list.forEach(res => {
        if (res.value === 2) {
          setTreeData(res.params)
        }
      })

      return list
    },
    innerConfirm() {
      if (this.editIndex >= 0) {
        switch (this.form.value) {
          case 1:
            let sp = this.form.params.join('-');
            if (sp === '-') {
              sp = ''
            }
            let params = {
              label: `${this.form.module}.${this.form.field}(${sp})`,
              ...this.form
            }
            this.$set(this.tagsList, this.editIndex, params)
            break;
          case 2:
            this.removeEmpty(this.list)

            this.$set(this.tagsList, this.editIndex, this.list[0]);
            break;
          default:
            this.$set(this.tagsList, this.editIndex, { label: `\"${this.form.str}\"`, value: this.form.value })
        }
        this.defStr = this.getStrFromObjects(this.tagsList)
        this.innerVisible = false
      } else {
        switch (this.form.value) {
          case 1:
            let sp = this.form.params.join('-');
            if (sp === '-') {
              sp = ''
            }
            this.defStr += `${this.form.module}.${this.form.field}(${sp})`
            break;
          case 2:

            this.removeEmpty(this.list)
            this.defStr += this.getStrFromObjects(this.list);
            break;
          default:
            this.defStr += `\"${this.form.str}\"`;
        }
        this.tagsList = this.objectsToTree(this.getObjectsFromStr(this.defStr));
        this.innerVisible = false
      }
    },
    handleInnerClose() {
      this.list = [];
      this.form = {};
    },
    handleAdd(val) {
      this.innerVisible = true
      this.flag = val
      this.editIndex = -1;
      switch (val) {
        case 1:
          this.$set(this.form, 'module', '')
          this.$set(this.form, 'field', '')
          this.$set(this.form, 'params', new Array(2))
          this.$set(this.form, 'value', 1)
          this.$set(this.form, 'id', uuid())
          this.$set(this.form, 'isObj', false)
          break;
        case 2:
          this.$set(this.form, 'function', '')
          this.$set(this.form, 'value', 2)
          this.$set(this.form, 'isObj', true)
          this.$set(this.form, 'id', uuid())
          // this.list = [this.form];
          break;
        default:
          this.$set(this.form, 'str', '')
          this.$set(this.form, 'value', 3)
          this.$set(this.form, 'isObj', false)
          this.$set(this.form, 'id', uuid())
      }
    },
    confirm() {
      this.$emit('confirm', this.defStr)
      this.close()
    },
    show(data) {
      this.GetModuleName()
      this.GetFunctionName()
      this.list = [];
      Object.keys(this.form).forEach(key => {
        this.$set(this.form, key, '')
      })
      this.defStr = data

      this.outerVisible = true;
    },
    close() {
      this.outerVisible = false
    },
    editLabel(item, index) {
      this.innerVisible = true
      this.flag = item.value
      this.form = item
      this.editIndex = index;
      switch (item.value) {
        case 1:
          this.GetDBField(item.module)
          this.$set(this.form, 'module', item.module)
          this.$set(this.form, 'field', item.field)
          if (item.params.length == 0) {
            this.$set(this.form, 'params', new Array(2))
          } else {
            this.$set(this.form, 'params', item.params)
          }
          break;
        case 2:
          this.list.length = 0;
          this.list = this.objectsToTree(this.getObjectsFromStr(item.label))
          break;
        default:
          this.$set(this.form, 'str', item.label.replace(/\"/g, ''))
      }
    },
    removeLabel(index) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.tagsList.splice(index, 1)
        this.defStr = this.getStrFromObjects(this.tagsList)
      }).catch(() => {
      });
    },
    onDraggableUpdate(e) {
      this.isLoading = true
      this.isLoading = false
      const oldIndex = e.oldIndex
      const newIndex = e.newIndex
      const newSort = this.tagsList[e.newIndex].sort
      this.tagsList[e.newIndex].sort = this.tagsList[e.oldIndex].sort
      this.tagsList[e.oldIndex].sort = newSort

      this.defStr = this.getStrFromObjects(this.tagsList)
    },
    handleModuleChange(val) {
      this.$set(this.form, 'field', '')
      this.fieldOptions = []
      if (!val) {
        return
      }
      this.GetDBField(val)
    },

    //从对象组中转换成字符串
    getStrFromObjects(list) {
      let s = '';
      list.forEach(res => {
        switch (res.value) {
          case 1:
            let str = res.params.join('-')
            if (str == '-') {
              str = ''
            }
            s += `${res.module}.${res.field}(${str})`
            break;
          case 2:
            s += `${res.fn}(${toStr(res.params)})`;
            break;
          case 3:
            s += res.label;
            break;
          default:
        }
      })
      function toStr(arr) {
        let str = ''
        arr.forEach(res => {
          if (!res.isObj) {
            str += res.label + ','
          } else {
            str += `${res.fn}(${toStr(res.params)}),`;
          }
        })
        if (str[str.length - 1] === ',') {
          str = str.slice(0, str.length - 1)
        }
        return str;
      }
      return s
    },

    //从字符串转换成对象数组
    getObjectsFromStr(str) {
      let arr = this.splitDefinition(str);
      let list = [];
      arr.forEach(s => {
        if (s.includes('.')) {
          list.push({
            label: s,
            isObj: false,
            value: 1,
            id: uuid()
          })
        } else if (s.includes('\"')) {
          list.push({
            label: s,
            isObj: false,
            value: 3,
            id: uuid()
          })
        } else {
          list.push({
            label: s,
            isObj: true,
            isTop: true,
            value: 2,
            id: uuid()
          })
        }
      })

      let objects = []
      list.forEach(obj => {
        objects.push(this.AnalysisStrToObject(obj))
      })

      return objects
    },

    //字符串解析成对象
    AnalysisStrToObject(obj) {
      let reg = new RegExp(/\((.+)\)/g)
      switch (obj.value) {
        case 1:
          let arr = obj.label.split('.')
          obj.module = arr[0]
          obj.field = arr[1].split('(')[0]
          let f = reg.test(arr[1]);

          obj.params = f ? RegExp.$1.split('-') : []
          return obj;
        case 2:
          let flag = reg.test(obj.label);
          obj.fn = obj.label.split('(')[0];
          obj.function = obj.fn + '()';
          if (flag) {
            let p = RegExp.$1
            if (p.includes('(')) {
              obj.params = this.DepthAnalysis(p);
              obj.isObj = true
            } else {
              obj.params = RegExp.$1.split(',')
            }
          } else {
            obj.params = []
          }
          obj.id = uuid()
          return obj;
        default:
          return obj
      }
    },

    //解析函数
    DepthAnalysis(str) {
      let that = this;
      let arr = that.splitFunctionParams(str)

      arr.forEach((item, index) => {
        if (item.includes('(')) {
          let obj = {};
          obj.fn = item.split('(')[0].trim();
          obj.function = obj.fn + '()';
          let reg = new RegExp(/\((.+)\)/g)
          let flag = reg.test(item);
          if (flag) {
            obj.params = that.splitFunctionParams(RegExp.$1);
            obj.params.forEach((res, i) => {
              let r = that.DepthAnalysis(res)
              if (Array.isArray(r) && r.length === 1) {
                obj.params[i] = r[0]
              } else {
                obj.params[i] = r
              }
            })
          } else {
            obj.params = []
          }
          obj.label = item.trim();
          obj.id = uuid()
          arr[index] = obj;
        }
      })

      return arr
    },
    // 解析字符串的定义
    splitDefinition(dStr) {
      let list = [];
      let s = '';
      let countObj = {};
      for (let i = 0; i < dStr.length; i++) {
        s += dStr[i];
        if (dStr[i] === '(') {
          if (!countObj[dStr[i]]) {
            countObj[dStr[i]] = 1
          } else {
            countObj[dStr[i]]++
          }
        }
        if (dStr[i] === ')' && !s.includes('"')) {
          if (!countObj[dStr[i]]) {
            countObj[dStr[i]] = 1
          } else {
            countObj[dStr[i]]++
          }
          if (countObj['('] === countObj[')']) {
            list.push(s);
            s = ''
            countObj['('] = 0;
            countObj[')'] = 0;
          }
        }
        if (dStr[i] === '"') {
          if (!countObj[dStr[i]]) {
            countObj[dStr[i]] = 1
          } else {
            countObj[dStr[i]]++
          }
          if (countObj[dStr[i]] == 2) {
            list.push(s);
            s = ''
            countObj[dStr[i]] = 0;
          }
        }
      }
      return list
    },

    //解析参数
    splitFunctionParams(dStr) {
      let list = [];
      let s = '';
      let countObj = {};
      for (let i = 0; i < dStr.length; i++) {
        s += dStr[i];
        if (dStr[i] === '(') {
          if (!countObj[dStr[i]]) {
            countObj[dStr[i]] = 1
          } else {
            countObj[dStr[i]]++
          }
        }
        if (dStr[i] === ')') {
          if (!countObj[dStr[i]]) {
            countObj[dStr[i]] = 1
          } else {
            countObj[dStr[i]]++
          }
          if (countObj['('] === countObj[')']) {
            list.push(s);
            s = ''
            countObj['('] = 0;
            countObj[')'] = 0;
          }
        }
        if (dStr[i] === ',' && !s.includes('(') || i === dStr.length - 1) {
          if (s.trim() && s.trim() !== ',') {
            list.push(s.split(',')[0].trim());
          }
          s = ''
        }
      }
      return list;
    },
    GetDBField(id) {
      this.fieldOptions = []
      GetDBField({ S_Type: id }).then(res => {
        if (res.Success) {
          this.fieldOptions = [...res.ResData]
        }
      })
    },
    GetModuleName() {
      GetVModuleName().then(res => {
        if (res.Success) {
          this.moduleOptions = [...res.ResData]
        }
      })
    },
    GetFunctionName() {
      GetVFunctionName().then(res => {
        if (res.Success) {
          this.functionNameOptions = [...res.ResData]
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tree-node__content {
    height: 40px;
    line-height: 40px;
  }
}

.custom-tree-node {
  width: 100%;
  position: relative;

  .tree_btn {
    position: absolute;
    right: 10px;
  }
}

.inner_dialog {
  ::v-deep {
    .el-dialog__body {
      border-top-color: transparent
    }
  }
}

.el-select {
  width: 100%;
}

.label_dialog {
  ::v-deep {
    .el-dialog__header {
      display: none
    }
  }

  .line_container {
    border: 1px solid #eee;
    margin: 5px;
    padding: 5px;
    height: 30px;
    position: relative;
    line-height: 30px;

    &:hover {
      background-color: #eee
    }
  }
}
</style>
