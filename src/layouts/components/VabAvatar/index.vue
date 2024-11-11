<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <!-- <img class="user-avatar" :src="avatar" alt="" /> -->
      <!-- 头像url @click="showHeadIconBig(userInfo.HeadIcon ? userInfo.HeadIcon : '@/assets/svg/header.svg')"-->
      <img class="user-avatar" :src="userInfo.HeadIcon ? userInfo.HeadIcon : 'assets/svg/header.svg'" alt="" />
      <div class="user-name">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>

    <el-dropdown-menu slot="dropdown" size="medium">
      <el-dropdown-item command="Language" divided>
        <!-- <language>{{ $t('languageSwitch') }}</language> -->
        <el-popover placement="left" width="150" trigger="click">
          <div class="popover_item" @click="handleChangeLanguage('chinese')">中文</div>
          <div class="popover_item" @click="handleChangeLanguage('english')">English</div>
          <div class="popover_item" @click="handleChangeLanguage('thai')">ข้อความ</div>
          <span slot="reference">
            <vab-icon :icon="['fas', 'globe-asia']"></vab-icon>
            {{ $t('languageSwitch') }}
          </span>
        </el-popover>
      </el-dropdown-item>
      <el-dropdown-item command="ThemeBar" divided>
        <Theme/>
      </el-dropdown-item>
      <el-dropdown-item v-hasPermi="['User/InfoButton']" command="UserInfo" divided>
        <vab-icon :icon="['fas', 'user']"></vab-icon>
        {{ $t('UserInfoPage') }}
      </el-dropdown-item>
      <el-dropdown-item v-hasPermi="['User/ModifyPasswordButton']" command="Modify" divided>
        <vab-icon :icon="['fas', 'user-edit']"></vab-icon>
        {{ $t('ModifyPage') }}
      </el-dropdown-item>
      <el-dropdown-item v-hasPermi="['User/ProblemFeedbackButton']" command="ProblemFeedback" divided>
        <vab-icon :icon="['fas', 'hands-helping']"></vab-icon>
        {{ $t('problemFeedback') }}
      </el-dropdown-item>
      <el-dropdown-item command="logout" divided>
        <vab-icon :icon="['fas', 'sign-out-alt']"></vab-icon>
        {{ $t('logOut') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { recordRoute } from '@/config'
/* 頭像 */
export default {
  name: 'VabAvatar',
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
      userInfo: 'user/userInfo',
    }),
  },
  methods: {
    handleChangeLanguage(command) {
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
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'UserInfo':
          this.$router.push({
            path: '/usercenter/userInfoPage',
          })
          break
        case 'Modify':
          this.$router.push({
            path: '/usercenter/modifyPage',
          })
          break
        case 'ProblemFeedback':
          this.$router.push({
            path: '/usercenter/problemFeedback',
          })
          break
        default:
      }
    },
    personalCenter() {
      this.$router.push('/personalCenter/personalCenter')
    },
    logout() {
      this.$baseConfirm(
        // '您确定要退出' + this.$baseTitle + '吗?',
        this.$t('logOutConfirm', { 0: this.$baseTitle }),
        null,
        async () => {
          await this.$store.dispatch('user/logout')
          this.$router.push('/login')
          /*  if (recordRoute) {
            let fullPath = this.$route.fullPath
            this.$router.push(`/login?redirect=${fullPath}`)
          } else {
            this.$router.push('/login')
          } */
        }
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.popover_item {
  height: 40px;
  line-height: 40px;
  font-size: 1rem;
  cursor: pointer;

  &:nth-child(2n) {
    border: 1px solid #ccc;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}

::v-deep {

  .el-dropdown-menu__item {
    height: 40px;
    line-height: 40px;
    font-size: 1rem;
  }
}

.el-dropdown {
  min-width: 138px;
}

.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    background-color: #fff;
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
