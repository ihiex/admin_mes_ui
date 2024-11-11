<template>
  <div class="hidden_right_logo">
      <img
        class="right_logo"
        src="@/assets/images/Cosmo_Logo_Black.png"
        alt="logo"
      />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
/* 
菜單縱向排列時 右邊的logo
*/
export default {
  name: 'RightLogo',
  data() {
    return {
        logoHidden: false
    }
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout',
    }),
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.right_logo {
  height: 35px;
  margin-right: 40px;
}
@media screen and(max-width: 768px){
    .hidden_right_logo{
        display: none;
    }
}
</style>
