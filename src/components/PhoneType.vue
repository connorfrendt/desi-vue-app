<template>
    <div>
        <form @submit.prevent="gatherUserComments">
            <div id="outer-box" :style="outerContainerStyles">
                <div id="main-box">
                    <ul>
                        <li v-for="(box, index) in boxes" :key="box[0]"
                            :id="`input-box-${index}`"
                            :style="getBoxStyles(box[1])"
                            v-html="box[1].editable ? box[1].userComment : box[1].defaultText"
                            style="list-style-type: none;"
                            @click="box[1].editable ? showPopUp(box, index) : ''"
                            :class="getTextClasses(box[1])"
                        ></li>
                    </ul>
                </div>
            </div>
            <!-- <div>:contenteditable="box[1].editable ? 'true' : 'false'"</div> -->
        </form>

        <div v-if="popupVisible" class="popup">
            <textarea
                ref="popupInput"
                v-model="popupText"
                :class="{
                    bold: isBold,
                    italics: isItalics,
                    underline: isUnderline,
                    'text-align-left': textAlign === 'left',
                    'text-align-center': textAlign === 'center',
                    'text-align-right': textAlign === 'right'
                }"
                style="width: 195px; height: 100px;"
            ></textarea>
            <div>
                <div class="popup-button" :class="{ active: isBold }" @click="makeBold">Bold</div>
                <div class="popup-button" :class="{ active: isItalics }" @click="makeItalicize">Italicize</div>
                <div class="popup-button" :class="{ active: isUnderline }" @click="makeUnderline">Underline</div>
                <div>
                    <div class="popup-button" :class="{ active: textAlign === 'left' }" @click="setTextAlign('left')">Left</div>
                    <div class="popup-button" :class="{ active: textAlign === 'center' }" @click="setTextAlign('center')">Center</div>
                    <div class="popup-button" :class="{ active: textAlign === 'right' }" @click="setTextAlign('right')">Right</div>
                </div>
                <div class="" style="display: flex; justify-content: space-around; margin-top: 100px;">
                    <div class="popup-button" @click="confirmEdit">OK</div>
                    <div class="popup-button" @click="cancelEdit">Cancel</div>
                </div>
            </div>
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
            currentBox: null,
            currentIndex: null,
            
            popupVisible: false,
            popupText: '',

            isBold: false,
            isItalics: false,
            isUnderline: false,
            textAlign: 'center',
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
                left: this.twipsToPixels(this.userInput[0].origins[0][0]) + 500 + 'px',
                top: this.twipsToPixels(this.userInput[0].origins[0][1]) + 'px',
                width: this.twipsToPixels(this.userInput[0].width) + 'px',
                height: this.twipsToPixels(this.userInput[0].height) + 'px',
                backgroundColor: 'lightgray'
            }
            

            // this.boxes makes it so that the CSS can be applied
            this.boxes = Object.entries(this.userInput[0].objects);

            this.$nextTick(() => {
                this.gatherUserComments();
            });
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
        getTextClasses(box) {
            return {
                bold: box.isBold,
                italics: box.isItalics,
                underline: box.isUnderline,
                textAlign: box.textAlign
            }
        },
        gatherUserComments() {
            let userInputObjects = Object.entries(this.userInput[0].objects);
            
            for(let i = 0; i < userInputObjects.length; i++) {
                let obj = userInputObjects[i][1];
                if(obj.editable) {
                    let userComment = document.getElementById(`input-box-${i}`).innerText;
                    obj.userComment = userComment;
                    obj.isBold = false;
                    obj.isItalics = false;
                    obj.isUnderline = false;
                    obj.textAlign = 'center';
                }
            }
            
            this.userInputObject = { ...this.userInput };

            // Passes the userInputObject up to the parent component "App.vue"
            this.$emit('user-input-object', this.userInputObject);
        },
        // This shows the popup box to edit the text inside an editable box on the phone label
        showPopUp(box, index) {
            this.popupVisible = true;
            this.popupText = box[1].userComment;
            
            this.currentBox = box;
            this.currentIndex = index;
            this.isBold = box[1].isBold;
            this.isItalics = box[1].isItalics;
            this.isUnderline = box[1].isUnderline;
            this.$nextTick(() => {
                this.$refs.popupInput.focus();
            });
        },
        // This is confirming the text changes in the popup box
        confirmEdit() {
            this.currentBox[1].userComment = this.popupText;
            this.currentBox[1].isBold = this.isBold;
            this.currentBox[1].isItalics = this.isItalics;
            this.currentBox[1].isUnderline = this.isUnderline;

            this.$emit('current-box-input', this.currentBox);
            
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
        },
        cancelEdit() {
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
        },
        makeBold() {
            this.isBold = !this.isBold;
        },
        makeItalicize() {
            this.isItalics = !this.isItalics;
        },
        makeUnderline() {
            this.isUnderline = !this.isUnderline;
        },
        setTextAlign(align) {
            console.log('Text Align: ', this.textAlign);
            this.textAlign = align;
            console.log('Text Align: ', this.textAlign);
        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
        },
    },
    watch: {
        data(newValue) {
            this.updatePhone(newValue);
        }
    }
}
</script>

<style scoped>
.popup {
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
    width: 200px;
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 100;
}

.bold {
    font-weight: bold;
}

.italics {
    font-style: italic;
}

.underline {
    text-decoration: underline;
}

.text-align-left {
    text-align: left;
}

.text-align-center {
    text-align: center;
}

.text-align-right {
    text-align: right;
}

.popup-button {
    background-color: lightgray;
    padding: 5px;
    margin: 5px;
    text-align: center;
    border-radius: 5px;
}
.popup-button:hover {
    background-color: gray;
    cursor: pointer;
}
.popup-button.active {
    background-color: gray;
    cursor: pointer;
}
</style>