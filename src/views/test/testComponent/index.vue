<template>
  <div class="test_component" v-bind="$attrs" @click="test">

  </div>
</template>

<script>
export default {
  name: 'TestComponent',
  data() {
    return {

    }
  },
  mounted(){
    console.log(this.$attrs)
  },
  methods:{
    test(){
      console.log('child')
      this.$emit('tComponent')
    }
  }
 }
</script>

<style lang="scss" scoped>
  .test_component{
    // background-color: aqua;
    border: 1px solid red;
  }
</style>
