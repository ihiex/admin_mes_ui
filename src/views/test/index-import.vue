<template>
  <div class="page_container">
    <el-button @click="test">test</el-button>
    <ImportDialog ref="ImportDialogRef"></ImportDialog>
  </div>
</template>

<script>
import ImportDialog from './importDialog.vue'

export default {
  name: 'Test',
  components:{
    ImportDialog
  },
  data() {
    return {

    }
  },
  methods:{
    test(){
      this.$refs.ImportDialogRef.show()
    }
  }
 }
</script>

<style lang="scss" scoped>
  .page_container{
    height: 100%;

  }
</style>
