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
        </form>

        <div v-if="popupVisible" class="popup">
            <div class="textarea-container">
                <textarea
                    ref="popupInput"
                    v-model="popupText"
                    :class="[
                        {
                            bold: isBold,
                            italics: isItalics,
                            underline: isUnderline
                        },
                        `text-${textAlign}`,
                        `text-${textColor}`
                    ]"
                    style="width: 195px; height: 100px; background-color: lightgray;"
                ></textarea>
            </div>
            <div>
                <div style="text-align: center; margin-top: 10px;">STYLE</div>
                <div class="popup-button" :class="{ active: isBold }" @click="makeBold">Bold</div>
                <div class="popup-button" :class="{ active: isItalics }" @click="makeItalicize">Italicize</div>
                <div class="popup-button" :class="{ active: isUnderline }" @click="makeUnderline">Underline</div>
                <div style="text-align: center; margin-top: 20px;">ALIGNMENT</div>
                <div style="display: flex; justify-content: space-evenly;">
                    <div class="popup-button" :class="{ active: textAlign === 'left' }" @click="setTextAlign('left')">Left</div>
                    <div class="popup-button" :class="{ active: textAlign === 'center' }" @click="setTextAlign('center')">Center</div>
                    <div class="popup-button" :class="{ active: textAlign === 'right' }" @click="setTextAlign('right')">Right</div>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    COLOR
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); justify-items: center;">
                    <div class="popup-button-black" :class="{ active: textColor === 'black' }" @click="setTextColor('black')"></div>
                    <div class="popup-button-red" :class="{ active: textColor === 'red' }" @click="setTextColor('red')"></div>
                    <div class="popup-button-orange" :class="{ active: textColor === 'orange' }" @click="setTextColor('orange')"></div>
                    <div class="popup-button-yellow" :class="{ active: textColor === 'yellow' }" @click="setTextColor('yellow')"></div>
                    <div class="popup-button-green" :class="{ active: textColor === 'green' }" @click="setTextColor('green')"></div>
                    <div class="popup-button-blue" :class="{ active: textColor === 'blue' }" @click="setTextColor('blue')"></div>
                    <div class="popup-button-purple" :class="{ active: textColor === 'purple' }" @click="setTextColor('purple')"></div>
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
            textColor: 'black'
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
                'text-left': box.textAlign === 'left',
                'text-center': box.textAlign === 'center',
                'text-right': box.textAlign === 'right',
                'text-black': box.textColor === 'black',
                'text-red': box.textColor === 'red',
                'text-orange': box.textColor === 'orange',
                'text-yellow': box.textColor === 'yellow',
                'text-green': box.textColor === 'green',
                'text-blue': box.textColor === 'blue',
                'text-purple': box.textColor === 'purple',
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
                    obj.textColor = 'black';
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
            this.textAlign = box[1].textAlign || 'center';
            this.textColor = box[1].textColor || 'black';

            this.resetFocus();
        },
        // This is confirming the text changes in the popup box
        confirmEdit() {
            this.currentBox[1].userComment = this.popupText;
            this.currentBox[1].isBold = this.isBold;
            this.currentBox[1].isItalics = this.isItalics;
            this.currentBox[1].isUnderline = this.isUnderline;
            this.currentBox[1].textAlign = this.textAlign;
            this.currentBox[1].textColor = this.textColor;

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
            this.resetFocus();
        },
        makeItalicize() {
            this.isItalics = !this.isItalics;
            this.resetFocus();
        },
        makeUnderline() {
            this.isUnderline = !this.isUnderline;
            this.resetFocus();
        },
        setTextAlign(align) {
            this.textAlign = align;
            this.resetFocus();
        },
        setTextColor(color) {
            this.textColor = color;
            this.resetFocus();
        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
        },
        resetFocus() {
            this.$nextTick(() => {
                this.$refs.popupInput.focus();
            })
        }
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

textarea {
    resize: none;
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

.text-black {
    color: black;
}
.text-red {
    color: red;
}
.text-orange {
    color: orange;
}
.text-yellow {
    color: yellow;
}
.text-green {
    color: green;
}
.text-blue {
    color: blue;
}
.text-purple {
    color: purple;
}

.text-left {
    text-align: left;
}
.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}

.popup-button {
    background-color: lightgray;
    padding: 5px;
    margin: 5px;
    text-align: center;
    border-radius: 5px;
}
.popup-button:hover,
.popup-button.active {
    background-color: gray;
    cursor: pointer;
}

.popup-button-black,
.popup-button-red,
.popup-button-orange,
.popup-button-yellow,
.popup-button-green,
.popup-button-blue,
.popup-button-purple {
    height: 10px;
    width: 10px;
    padding: 5px;
    margin: 5px;
    text-align: center;
    border-radius: 5px;
    border: 2px solid transparent;
    transition: border 0.3s;
}


.popup-button-black {
    background-color: black;
}
.popup-button-black:hover,
.popup-button-black.active {
    border: 2px solid lightblue;
    color: white;
    cursor: pointer;
}

.popup-button-red {
    background-color: red;
}
.popup-button-red:hover,
.popup-button-red.active {
    border: 2px solid lightblue;
    background-color: red;
    cursor: pointer;
}

.popup-button-orange {
    background-color: orange;
}
.popup-button-orange:hover,
.popup-button-orange.active {
    border: 2px solid lightblue;
    background-color: orange;
    cursor: pointer;
}

.popup-button-yellow {
    background-color: yellow;
}
.popup-button-yellow:hover,
.popup-button-yellow.active {
    border: 2px solid lightblue;
    background-color: yellow;
    cursor: pointer;
}

.popup-button-green {
    background-color: green;
}
.popup-button-green:hover,
.popup-button-green.active {
    border: 2px solid lightblue;
    background-color: green;
    cursor: pointer;
}

.popup-button-blue {
    background-color: blue;
}
.popup-button-blue:hover,
.popup-button-blue.active {
    border: 2px solid lightblue;
    background-color: blue;
    cursor: pointer;
}

.popup-button-purple {
    background-color: purple;
}
.popup-button-purple:hover,
.popup-button-purple.active {
    border: 2px solid lightblue;
    background-color: purple;
    cursor: pointer;
}

</style>