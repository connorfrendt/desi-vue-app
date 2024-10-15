<template>
    <div>
        <form>
            <div id="outer-box" :style="outerContainerStyles">
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
            outerContainerStyles: {
                position: '',
                width: '',
                height: '',
                top: '',
                left: '',
                backgroundColor: ''
            }
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
            
            // Origins - top left corner of the phone's outer box
            this.origins = data.origins;
            this.userInput = [];
            this.userInput.push(data);
            // console.log('WIDTH/HEIGHT: ', data.width, data.height, typeof this.twipsToPixels(data.width), typeof this.twipsToPixels(data.height));
            this.outerContainerStyles.width = this.twipsToPixels(data.width) + 'px';
            this.outerContainerStyles.height = this.twipsToPixels(data.height) + 'px';
            console.log(this.origins[0]);
            this.outerContainerStyles.position = 'absolute';
            this.outerContainerStyles.left = this.twipsToPixels(this.origins[0][0]) + 'px';
            this.outerContainerStyles.top = this.twipsToPixels(this.origins[0][1]) + 'px';
            this.outerContainerStyles.backgroundColor = 'lightgray';

        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
        }
    },
    watch: {
        data(newValue) {
            console.log('NEW VALUE: ', newValue);
            this.updatePhone(newValue);
        }
    }
}
</script>

<style>

</style>