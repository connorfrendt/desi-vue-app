<template>
    <div id="app">
        <!-- <PhoneOverview></PhoneOverview> -->
        <RouterView></RouterView>
    </div>
</template>

<script>
// import PhoneOverview from './components/PhoneOverview.vue';

export default {
    name: 'App',
    components: {
        // PhoneOverview
    }
}
</script>

<style>
body {
    background-color: gray;
    margin: 0;
}
</style>