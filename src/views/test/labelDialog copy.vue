<template>
  <el-dialog class="label_dialog" title="" :visible.sync="outerVisible" :show-close="false"
    @before-close="handleInnerBeforeClose">

    <el-dialog class="inner_dialog" width="50%" title="" :visible.sync="innerVisible" append-to-body
      @before-close="handleInnerBeforeClose">
      <el-form ref="form" :model="form" label-width="80px">
        <template v-if="flag === 1">
          <el-form-item label="模块">
            <el-select v-model="form.module" placeholder="模块" clearable filterable @change="handleModuleChange">
              <el-option v-for="item in moduleOptions" :key="item.ID" :label="item.ModuleName" :value="item.ID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段">
            <!-- @change="handleFieldChange" -->
            <el-select v-model="form.field" placeholder="字段" clearable filterable>
              <el-option v-for="item in fieldOptions" :key="item.field" :label="item.field" :value="item.field">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数">
            <div style="display: flex; flex-direction: row; width: 100%;">
              <span v-for="(item, index) in form.params" :key="index" style="margin-right: 5px; width: 100%">
                <el-input v-model="form.params[index]" type="number" clearable></el-input>
              </span>
            </div>
          </el-form-item>
        </template>
        <template v-else-if="flag === 2">
          <el-form-item label="函数">
            <!-- @change="handleFunctionChange" -->
            <el-select v-model="form.function" placeholder="函数" clearable filterable>
              <el-option v-for="item in functionNameOptions" :key="item.ID" :label="item.FunctionName"
                :value="item.FunctionName">
              </el-option>
            </el-select>
          </el-form-item>

        </template>
        <template v-else>
          <el-form-item label="字符串">
            <!-- @change="handleInputChange" -->
            <el-input v-model="form.str" placeholder="字符串" clearable></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerConfirm">确定</el-button>
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
        <el-button @click="handleAdd(1)">添加字段</el-button>
        <el-button @click="handleAdd(2)">添加函数</el-button>
        <el-button @click="handleAdd(3)">添加字符串</el-button>
      </div>
      <el-button @click="test">test</el-button>
      <el-button @click="outerVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
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
      editIndex: -1
    };
  },
  watch: {
    defStr(val, oval) {
      this.tagsList = this.getObjectsFromStr(val);
    }
  },
  mounted() {
    this.GetModuleName()
    this.GetFunctionName()
  },
  methods: {

    innerConfirm() {
      console.log(this.form)
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
            /*  this.$set(this.tagsList[this.editIndex], 'label', `${this.form.module}.${this.form.field}(${sp})`)
             this.$set(this.tagsList[this.editIndex], 'params', this.form.params)
             this.$set(this.tagsList[this.editIndex], 'module', this.form.module)
             this.$set(this.tagsList[this.editIndex], 'field', this.form.field) */
            this.$set(this.tagsList, this.editIndex, params)
            break;
          case 2:
            // this.defStr += `${this.form.function}`

            break;
          default:
            // this.defStr += `\"${this.form.str}\"`;
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

            this.defStr += `${this.form.function}`
            break;
          default:
            this.defStr += `\"${this.form.str}\"`;
        }
        this.tagsList = this.getObjectsFromStr(this.defStr);
      }
    },
    handleInnerBeforeClose() {
      console.log('close')
    },
    test() {
      /*  let objs = this.getObjectsFromStr(this.defStr);
       this.tagsList = objs
       console.log(objs)
       let ss = this.getStrFromObjects(objs)
       console.log(ss); */
      console.log(this.tagsList)
    },
    handleAdd(val) {
      this.innerVisible = true
      this.flag = val
      this.editIndex = -1;
      switch (val) {
        case 1:
          this.$set(this.form, 'module',)
          this.$set(this.form, 'field',)
          this.$set(this.form, 'params', new Array(2))
          this.$set(this.form, 'value', 1)
          break;
        case 2:
          this.$set(this.form, 'function',)
          this.$set(this.form, 'value', 2)
          break;
        default:
          this.$set(this.form, 'str',)
          this.$set(this.form, 'value', 3)
      }
    },
    confirm() {
      this.close()
    },
    show(data) {
      this.defStr = data
      console.log(data)
      // this.getStrFromObjects(objs)
      this.getObjectsFromStr(val)
      this.outerVisible = true;
    },
    close() {
      this.outerVisible = false
    },
    editLabel(item, index) {
      console.log(item)
      // this.handleAdd(item.value)
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
          this.$set(this.form, 'function', item.fn + '()')
          // this.$set(this.form, 'params', item.params)

          break;
        default:
          this.$set(this.form, 'str', item.label.replace(/\"/g, ''))
      }
    },
    removeLabel(index) {
      this.tagsList.splice(index, 1)
      this.defStr = this.getStrFromObjects(this.tagsList)

    },
    onDraggableUpdate(e) {
      this.isLoading = true
      // setTimeout(() => {
      this.isLoading = false
      //老位置
      const oldIndex = e.oldIndex
      //新位置
      const newIndex = e.newIndex
      const newSort = this.tagsList[e.newIndex].sort
      this.tagsList[e.newIndex].sort = this.tagsList[e.oldIndex].sort
      this.tagsList[e.oldIndex].sort = newSort

      this.defStr = this.getStrFromObjects(this.tagsList)
      /*   console.log(this.tagsList)
        this.$message.success('顺序变更成功!') */
      // }, 1000)
    },
    handleModuleChange(val) {
      console.log(val)
      this.$set(this.form, 'field', '')
      this.fieldOptions = []
      if (!val) {
        return
      }
      // this.defStr += val.ID + '.'
      this.GetDBField(val)
    },
    /* handleFunctionChange(val) {
       this.defStr += `${val}`
       console.log(val)
     },
     handleFieldChange(val) {
       this.defStr += `${val}()`
       console.log(val)
     },
     handleInputChange(val) {
       this.defStr += `\"${val}\"`
     }, */

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
          if (typeof res == 'string') {
            str += res + ','
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
            value: 1
          })
        } else if (s.includes('\"')) {
          list.push({
            label: s,
            value: 3
          })
        } else {
          list.push({
            label: s,
            value: 2
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
          obj.fn = obj.label.split('(')[0]
          if (flag) {
            let p = RegExp.$1
            if (p.includes('(')) {
              // 参数中有回调方法
              // p = Left(1,2),ab,cd
              obj.params = this.DepthAnalysis(p);
            } else {
              // 纯参数方式
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

      //获取参数中的一个或多个
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
