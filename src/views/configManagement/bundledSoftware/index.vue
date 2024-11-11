<template>
    <div class="app_container">
        
        <a v-for="(item, index) in data" :key="index" :href="item.path" download>{{ item.name }}</a>

    </div>
</template>

<script>
import data from './data.js'
export default {
    name: 'BundledSoftware',
    data() {
        return {
            title: '配套软件',
            data: data,
        }
    }
}
</script>

<style lang="scss" scoped>
.app_container {
    a{
        color: #2440b3;
        margin: 10px 15px;
        display: block;
        font-size: 20px;
        text-decoration: underline;
        box-sizing: content-box;
        width: max-content;
    }
}
</style>