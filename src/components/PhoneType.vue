<template>
    <div>
        <div>Phone Type Component</div>
        <div>{{ phoneType }}</div>
    </div>
</template>

<script>
export default {
    props: {
        phoneType: {
            type: String,
            required: true
        }
    },
    methods: {
        
    }
}
</script>

<style>

</style>