<template>
    <div style="height: 100vh; width: 100vw; position: fixed; z-index: 10000000; background-color: #fff;">
        <!-- {{ title }} -->
        <ModifyPassword :save-and-login="true"></ModifyPassword>
    </div>
</template>

<script>
import ModifyPassword from '@/views/userCenter/modify.vue'
export default {
    name: 'ResetLogin',
    components: {
        ModifyPassword
    },
    data() {
        return {
            title: '修改密码，重新登录'
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
};
</script>

<style scoped lang="scss"></style>
