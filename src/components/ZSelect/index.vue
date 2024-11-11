<template>
  <el-popover placement="bottom" title="" width="auto" trigger="click" content="" :disabled="disabled"
    @blur="visible = false">
    <span v-for="(val, index) in targetValue" :key="index">
      <el-select v-model="selectValues[index]" :placeholder="val" style="width: 60px;" @change="handleChange">
        <el-option v-for="item in com[val]" :key="item.ID" :label="item.Value" :value="item.Value">
        </el-option>
      </el-select>
    </span>
    <el-input slot="reference" v-model.trim="input" :placeholder="$t('pleaseInput')" clearable readonly
      :disabled="disabled" @clear="handleClear" @input="handleInput" ></el-input>
  </el-popover>
</template>

<script>
import {
  GetCom_a,
  GetCom_d,
  GetCom_h,
  GetCom_n,
  GetCom_o
} from '@/api/configCommon.js'

export default {
  name: 'ZSelect',
  props: {
    value: {
      type: String,
      require: true,
      default: () => { return "" }
    },
    targetValue: {
      type: String,
      default: () => ""
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      input: this.value,
      com: {
        a: [],
        d: [],
        h: [],
        n: [],
        o: [],
      },
      selectValues: {},
      time: null
    }
  },
  watch: {
    value(val, oval) {
      this.input = val;
      this.handleInput(val)
    },
    targetValue(val, oval) {
      this.$emit('input', '') //目标值改变时 清空数据
      for (let i = 0; i < val.length; i++) {
        this.$set(this.selectValues, i, '')
      }
    },
    input(val, oval) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.GetCom_a()
    this.GetCom_d()
    this.GetCom_h()
    this.GetCom_n()
    this.GetCom_o()
  },
  methods: {
    handleInput(val) {
      for (let i = 0; i < val?.length; i++) {
        this.selectValues[i] = val[i]
      }
    },
    handleChange() {
      let s = "";
      Object.keys(this.selectValues).forEach(k => {
        s += this.selectValues[k]
      })
      this.input = s;
    },
    handleClear() {
      this.$emit('input', '')
    },
    GetCom_a() {
      GetCom_a().then(res => {
        if (res.Success) {
          this.com.a = res.ResData
        }
      })
    },
    GetCom_d() {
      GetCom_d().then(res => {
        if (res.Success) {
          this.com.d = res.ResData
        }
      })
    },
    GetCom_h() {
      GetCom_h().then(res => {
        if (res.Success) {
          this.com.h = res.ResData
        }
      })
    },
    GetCom_n() {
      GetCom_n().then(res => {
        if (res.Success) {
          this.com.n = res.ResData
        }
      })
    },
    GetCom_o() {
      GetCom_o().then(res => {
        if (res.Success) {
          this.com.o = res.ResData
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input__icon.el-input__validateIcon.el-icon-circle-check {
    display: none;
  }

  .el-input__icon.el-input__validateIcon.el-icon-circle-close {
    display: none;
  }
}
</style>
