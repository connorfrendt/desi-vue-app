<template>
    <div>
        <form>
            <div id="outer-box">
                <div id="main-box"></div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInput: [],
            origins: '',
            outerContainer: '',
            outerContainerwidth: '',
            outerContainerheight: '',
            container: '',
            boxes: '',
            boxHTML: '',
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        updatePhone(data) {
            this.origins = data.origins;
            console.log('*****BEFORE******: ', this.userInput);
            this.userInput.push(this.data);
            console.log('AFTER: ', this.userInput);
        }
    },
    watch: {
        data(newValue) {
            this.updatePhone(newValue);
        }
    }
}
</script>

<style>

</style>