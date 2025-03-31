<template>
    <div id="app" class="">
        <HomePage />
    </div>
</template>

<script>
import HomePage from './components/HomePage.vue';
export default {
    name: 'App',
    components: {
        HomePage
    }
}
</script>

<style>
body {
    background-color: gray;
    margin: 0;
}
</style>