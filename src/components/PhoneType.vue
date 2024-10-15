<template>
    <div>
        <form>
            <div id="outer-box" :style="outerContainerStyles">
                <div id="main-box">
                    <div v-for="box in boxes" :key="box[0]"
                        :id="input-box-box[0]"
                        :style="containerStyles"
                    ></div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInput: [],
            boxes: [],
            outerContainerStyles: {
                position: '',
                width: '',
                height: '',
                top: '',
                left: '',
                backgroundColor: ''
            },
            containerStyles: {
                height: '',
                width: '',
                position: 'absolute',
                left: '',
                top: ''
            },
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
            
            this.outerContainerStyles.width = this.twipsToPixels(data.width) + 'px';
            this.outerContainerStyles.height = this.twipsToPixels(data.height) + 'px';
            
            this.outerContainerStyles.position = 'absolute';
            this.outerContainerStyles.left = this.twipsToPixels(this.origins[0][0]) + 'px';
            this.outerContainerStyles.top = this.twipsToPixels(this.origins[0][1]) + 'px';
            this.outerContainerStyles.backgroundColor = 'lightgray';

            console.log(this.userInput[0].objects);
            this.boxes = Object.entries(this.userInput[0].objects);
            console.log(this.boxes);
            
            // for(let i = 0; i < this.boxes.length; i++) {
            //     let key = boxes[i][0];
            //     let obj = boxes[i][1];  // The object with the attributes of each box.  The second element of the boxes array for each box

            //     let width  = this.twipsToPixels(obj.position[2] - obj.position[0]);
            //     let height = this.twipsToPixels(obj.position[3] - obj.position[1]);
            // }
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