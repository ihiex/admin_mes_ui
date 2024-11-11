<template>
  <div>
   <QuillEditor v-model="content" height="400px" :is-image-upload="true"></QuillEditor>
   <!-- <div v-html="content"></div> -->
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor'
export default {
  components:{
    QuillEditor
  },
  data() {
    return {
      content: '<h1>Vue quill editor</h1> <br/><p> this is a container</p>'
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    
  },
}
</script>
<style lang="scss" scoped>
</style>
