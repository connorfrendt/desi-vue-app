<template>
    <div>
        <form>
            <div id="outer-box" :style="outerContainerStyles">
                <div id="main-box">
                    <ul>
                        <li v-for="(box, index) in boxes" :key="box[0]"
                            :id="input-box-`${index}`"
                            :style="getBoxStyles(box[1])"
                            v-html="box[1].defaultText"
                            style="list-style-type: none;"
                            :contenteditable="box[1].editable ? 'true' : 'false'"
                            z-index="2"
                        ></li>
                    </ul>
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
            
            this.outerContainerStyles = {
                position: 'absolute',
                left: this.twipsToPixels(data.origins[0][0]) + 'px',
                top: this.twipsToPixels(data.origins[0][1]) + 'px',
                width: this.twipsToPixels(data.width) + 'px',
                height: this.twipsToPixels(data.height) + 'px',
                backgroundColor: 'lightgray'
            }

            // console.log(this.userInput[0].objects);
            this.boxes = Object.entries(this.userInput[0].objects);
            
        },
        getBoxStyles(box) {
            console.log('BOX: ', box);
            let styles = {
                height: this.twipsToPixels(box.position[3] - box.position[1]) + 'px',
                width: this.twipsToPixels(box.position[2] - box.position[0]) + 'px',
                position: 'absolute',
                left: this.twipsToPixels(box.position[0]) + 'px',
                top: this.twipsToPixels(box.position[1]) + 'px',
                backgroundColor: box.kind === 'text' ? box.color : box.kind === 'rectangle' ? box.color : '',
                border: box.kind === 'dottedLine' ? `1px dotted ${box.color}` : '',
                color: box.kind === 'staticText' ? box.color : ''
            }
            return styles;
        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
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