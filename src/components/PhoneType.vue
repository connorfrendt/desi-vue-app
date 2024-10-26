<template>
    <div>
        <form @submit.prevent="gatherUserComments">
            <div id="outer-box" :style="outerContainerStyles">
                <div id="main-box">
                    <ul>
                        <li v-for="(box, index) in boxes" :key="box[0]"
                            :id="`input-box-${index}`"
                            :style="getBoxStyles(box[1])"
                            v-html="box[1].defaultText"
                            style="list-style-type: none;"
                            :contenteditable="box[1].editable ? 'true' : 'false'"
                            @dblclick="showPopUp(box, index)"
                        ></li>
                    </ul>
                </div>
            </div>
            <button type="submit">Submit</button>
        </form>

        <div v-if="popupVisible" class="popup">
            <textarea v-model="popupText"></textarea>
            <button @click="confirmEdit">OK</button>
            <button @click="cancelEdit">Cancel</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInput: [],
            boxes: [],
            userInputObject: {},
            outerContainerStyles: {
                position: '',
                width: '',
                height: '',
                top: '',
                left: '',
                backgroundColor: '',
                zIndex: ''
            },
            modelName: '',
            popupVisible: false,
            popupText: '',
            currentBox: null,
            currentIndex: null
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
            console.log('updatePhone');
            // Origins - top left corner of the phone's outer box
            this.origins = data.origins;
            this.modelName = data.description + ' (' + data.group + ')';
            this.$emit('model-name', this.modelName);
            
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

            this.boxes = Object.entries(this.userInput[0].objects);
            
        },
        getBoxStyles(box) {
            let styles = {
                height: this.twipsToPixels(box.position[3] - box.position[1]) + 'px',
                width: this.twipsToPixels(box.position[2] - box.position[0]) + 'px',
                position: 'absolute',
                left: this.twipsToPixels(box.position[0]) + 'px',
                top: this.twipsToPixels(box.position[1]) + 'px',
                backgroundColor: box.kind === 'text' ? box.color : box.kind === 'rectangle' ? box.color : '',
                border: box.kind === 'dottedLine' ? `1px dotted ${box.color}` : '',
                color: box.kind === 'staticText' ? box.color : '',
                zIndex: box.editable ? 2 : 1
            }
            return styles;
        },
        gatherUserComments() {
            let userInputObjects = Object.entries(this.userInput[0].objects);
            for(let i = 0; i < userInputObjects.length; i++) {
                let obj = userInputObjects[i][1];
                if(obj.editable) {
                    let userComment = document.getElementById(`input-box-${i}`).innerText;
                    obj.userComment = userComment;
                }
            }
            this.userInputObject = { ...this.userInput };

            // Passes the userInputObject up to the parent component "App.vue"
            this.$emit('user-input-object', this.userInputObject);
        },
        showPopUp(box, index) {
            this.popupVisible = true;
            this.popupText = box[1].defaultText;
            this.currentBox = box;
            this.currentIndex = index;
        },
        confirmEdit() {
            this.currentBox[1].defaultText = this.popupText;
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
        },
        cancelEdit() {
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
        }
    },
    watch: {
        data(newValue) {
            console.log('here', newValue.group);
            this.updatePhone(newValue);
        }
    }
}
</script>

<style>
.popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 100;
}
</style>