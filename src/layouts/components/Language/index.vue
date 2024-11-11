<template>
  <el-dropdown placement="top" @command="handleCommand">
    <span class="avatar-dropdown">
      <vab-icon :icon="['fas', 'globe-asia']"></vab-icon>
      <slot></slot>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="chinese">中文</el-dropdown-item>
      <el-dropdown-item command="english" divided>English</el-dropdown-item>
      <el-dropdown-item command="thai" divided>ข้อความ</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Language',
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
    }),
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'chinese':
          localStorage.setItem('language', 'CN')
          this.$i18n.locale = 'CN'
          break
        case 'english':
          localStorage.setItem('language', 'EN')
          this.$i18n.locale = 'EN'
          break
        case 'thai':
          localStorage.setItem('language', 'TH')
          this.$i18n.locale = 'TH'
          break
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
