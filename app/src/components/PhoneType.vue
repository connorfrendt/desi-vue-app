<template>
    <div>
        <form @submit.prevent="gatherUserComments">
            <div id="outer-box" :style="outerContainerStyles">
                <div id="main-box">
                    <ul>
                        <li v-for="(box, index) in boxes" :key="box[0]"
                            :id="`input-box-${index}`"
                            :style="[getBoxStyles(box[1]), selectedBox === index ? { outline : '1px solid black', } : '']"
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
                <ul style="padding: 0;">
                    <li style="list-style-type: none; height: 100px; width: 200px; background-color: lightgray; display: flex;" :class="[{ [`text-${textVerticalAlign}`]: true }]">
                        <input type="text" ref="popupInput" v-model="popupText" style="width: 195px; background-color: lightgray; border: none;"
                            :class="[
                                {
                                    bold: isBold,
                                    italics: isItalics,
                                    underline: isUnderline,
                                    [`text-input-${textHorizontalAlign}`]: true,
                                    [`text-${textColor}`]: true,
                                    [`font-size-${fontSize}`]: true,
                                    [`${fontStyle}`]: true
                                },
                            ]"
                        />
                    </li>
                </ul>
            </div>
            <div>
                <div style="text-align: center; margin-top: 10px;">STYLE</div>
                <div class="popup-button" :class="{ active: isBold }" @click="makeBold">Bold</div>
                <div class="popup-button" :class="{ active: isItalics }" @click="makeItalicize">Italicize</div>
                <div class="popup-button" :class="{ active: isUnderline }" @click="makeUnderline">Underline</div>
                <div style="text-align: center; margin-top: 20px;">JUSTIFICATION</div>
                
                <div style="display: flex; justify-content: space-evenly;">
                    <div class="popup-button" :class="{ active: textVerticalAlign === 'top' }" @click="setVerticalTextAlign('top')">
                        Top<font-awesome-icon icon="fa-solid fa-arrows-up-to-line" />
                    </div>
                    <div class="popup-button" :class="{ active: textVerticalAlign === 'center' }" @click="setVerticalTextAlign('center')">
                        Center<font-awesome-icon icon="fa-solid fa-align-center" />
                    </div>
                    <div class="popup-button" :class="{ active: textVerticalAlign === 'bottom' }" @click="setVerticalTextAlign('bottom')">
                        Bottom<font-awesome-icon icon="fa-solid fa-arrows-down-to-line" />
                    </div>
                </div>

                <div style="display: flex; justify-content: space-evenly;">
                    <div class="popup-button" :class="{ active: textHorizontalAlign === 'left' }" @click="setHorizontalTextAlign('left')">
                        Left<font-awesome-icon icon="fa-solid fa-align-left" />
                    </div>
                    <div class="popup-button" :class="{ active: textHorizontalAlign === 'center' }" @click="setHorizontalTextAlign('center')">
                        Center<font-awesome-icon icon="fa-solid fa-align-center" />
                    </div>
                    <div class="popup-button" :class="{ active: textHorizontalAlign === 'right' }" @click="setHorizontalTextAlign('right')">
                        Right<font-awesome-icon icon="fa-solid fa-align-right" />
                    </div>
                </div>

                <div style="text-align: center; margin-top: 10px;">COLOR</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); justify-items: center;">
                    <div class="popup-button-black" :class="{ active: textColor === 'black' }" @click="setTextColor('black')"></div>
                    <div class="popup-button-red" :class="{ active: textColor === 'red' }" @click="setTextColor('red')"></div>
                    <div class="popup-button-orange" :class="{ active: textColor === 'orange' }" @click="setTextColor('orange')"></div>
                    <div class="popup-button-yellow" :class="{ active: textColor === 'yellow' }" @click="setTextColor('yellow')"></div>
                    <div class="popup-button-green" :class="{ active: textColor === 'green' }" @click="setTextColor('green')"></div>
                    <div class="popup-button-blue" :class="{ active: textColor === 'blue' }" @click="setTextColor('blue')"></div>
                    <div class="popup-button-purple" :class="{ active: textColor === 'purple' }" @click="setTextColor('purple')"></div>
                </div>

                <div style="text-align: center; margin-top: 10px;">
                    <label>FONT</label>
                </div>
                <div style="text-align: center;">
                    <select v-model="fontStyle" @change="setFontStyle">
                        <option value="font-arial">Arial</option>
                        <option value="font-courier-new">Courier New</option>
                        <option value="font-georgia">Georgia</option>
                        <option value="font-times-new-roman">Times New Roman</option>
                        <option value="font-verdana">Verdana</option>
                    </select>
                </div>

                <div style="text-align: center; margin-top: 10px;">
                    <label>FONT SIZE</label>
                </div>
                <div style="text-align: center;">
                    <select v-model="fontSize" @change="setFontSize">
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                    </select>
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
            textHorizontalAlign: 'center',
            textVerticalAlign: 'center',
            textColor: 'black',

            fontSize: 0,
            fontStyle: 'font-arial',

            selectedBox: null,
        }
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        phoneIndex: {
            type: Number,
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
                left: 'calc(50%)',
                // left: this.twipsToPixels(this.userInput[0].origins[0][0]) + this.$parent.initialX + 300 + 'px',
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

            // }

        },
        getBoxStyles(box) {
            // Makes the css for the boxes, this is not for the text inside
            if(box.kind === "rectangle" || box.kind === "dottedLine" || box.kind === "staticText" || box.kind === "text") {
                let styles = {
                    height: this.twipsToPixels(box.position[3] - box.position[1]) + 'px',
                    width: this.twipsToPixels(box.position[2] - box.position[0]) + 'px',
                    position: 'absolute',
                    left: this.twipsToPixels(box.position[0]) + 'px',
                    top: this.twipsToPixels(box.position[1]) + 'px',
                    backgroundColor: box.kind === 'text' || box.kind === 'rectangle' ? box.color : '',
                    border: box.kind === 'dottedLine' ? `1px dotted ${box.color}` : box.editable ? '1px solid rgba(0, 0, 0, 0.5)' : '',
                    // outline: box.editable ? '1px solid rgba(0, 0, 0, 0.5)' : '',
                    color: box.kind === 'staticText' ? box.color : '',
                    zIndex: box.editable ? 2 : 1,
                    fontSize: box.fontSize ? box.fontSize + 'px' : '12px',
                    // marginTop: '5px',
                }
                return styles;
            }
            
            if(box.kind === "ellipse") {
                let styles = {
                    height: this.twipsToPixels(box.position[3] - box.position[1]) + 'px',
                    width: this.twipsToPixels(box.position[2] - box.position[0]) + 'px',
                    position: 'absolute',
                    left: this.twipsToPixels(box.position[0]) + 'px',
                    top: this.twipsToPixels(box.position[1]) + 'px',
                    border: '1px solid' + box.color,
                    borderRadius: '50%',
                    zIndex: 2
                }
                return styles;
            }
        },
        getTextClasses(box) {
            // Applies classes to each individual editable box. Each class gets applied when the following value is "true"
            return {
                bold: box.isBold,
                italics: box.isItalics,
                underline: box.isUnderline,
                'text-left': box.textHorizontalAlign === 'left',
                'text-h-center': box.textHorizontalAlign === 'center',
                'text-right': box.textHorizontalAlign === 'right',
                'text-top': box.textVerticalAlign === 'top',
                'text-v-center': box.textVerticalAlign === 'center',
                'text-bottom': box.textVerticalAlign === 'bottom',
                [`text-${box.textColor}`]: true,
                [`font-size-${box.fontSize}`]: true,
                [`${box.fontStyle}`]: true
            }
        },
        gatherUserComments() {
            let userInputObjects = Object.entries(this.userInput[0].objects);
            
            for(let i = 0; i < userInputObjects.length; i++) {
                let obj = userInputObjects[i][1];
                
                if(obj.editable) {
                    
                    let userComment = document.getElementById(`input-box-${i}`).innerText;
                    obj.userComment = userComment;
                    
                    // After the || is the default values for the editable boxes
                    obj.isBold = obj.isBold || false;
                    obj.isItalics = obj.isItalics || false;
                    obj.isUnderline = obj.isUnderline || false;
                    obj.textHorizontalAlign = obj.textHorizontalAlign || 'center';
                    obj.textVerticalAlign = obj.textVerticalAlign || 'center';
                    obj.textColor = obj.textColor || 'black';
                    obj.fontSize = obj.fontSize || 12;
                    obj.fontStyle = obj.fontStyle || 'font-arial';
                }
            }
            
            this.userInputObject = { ...this.userInput };
            // console.log('userInputObject', this.userInputObject);
            // Passes the userInputObject up to the parent component "PhoneOverview.vue"
            this.$emit('user-input-object', this.userInputObject);
        },

        showPopUp(box, index) {
            // This shows the popup box to edit the text inside an editable box on the phone label
            this.popupVisible = true;
            this.popupText = box[1].userComment;
            
            this.selectedBox = index;

            this.currentBox = box;
            this.currentIndex = index;

            this.isBold = box[1].isBold;
            this.isItalics = box[1].isItalics;
            this.isUnderline = box[1].isUnderline;
            this.textHorizontalAlign = box[1].textHorizontalAlign;
            this.textVerticalAlign = box[1].textVerticalAlign;
            this.textColor = box[1].textColor;
            this.fontSize = box[1].fontSize;
            this.fontStyle = box[1].fontStyle;

            this.resetFocus();
        },

        confirmEdit() {
            // This is confirming the text changes in the popup box and makes them appear on the phone label
            
            this.currentBox[1].userComment = this.popupText;
            this.currentBox[1].isBold = this.isBold;
            this.currentBox[1].isItalics = this.isItalics;
            this.currentBox[1].isUnderline = this.isUnderline;
            this.currentBox[1].textHorizontalAlign = this.textHorizontalAlign;
            this.currentBox[1].textVerticalAlign = this.textVerticalAlign;
            this.currentBox[1].textColor = this.textColor;
            this.currentBox[1].fontSize = this.fontSize;
            this.currentBox[1].fontStyle = this.fontStyle;

            this.$emit('current-box-input', this.currentBox);
            
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
            this.selectedBox = null;
        },
        cancelEdit() {
            this.popupVisible = false;
            this.currentBox = null;
            this.currentIndex = null;
            this.selectedBox = null;
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
        setHorizontalTextAlign(align) {
            this.textHorizontalAlign = align;
            this.resetFocus();
        },
        setVerticalTextAlign(align) {
            this.textVerticalAlign = align;
            this.resetFocus();
        },
        setTextColor(color) {
            this.textColor = color;
            this.resetFocus();
        },
        setFontSize(event) {
            this.fontSize = parseInt(event.target.value);
            this.resetFocus();
        },
        setFontStyle() {
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
            if(Object.keys(newValue).length === 0) {
                this.outerContainerStyles = {};
                this.boxes = [];
            }
            else {
                this.updatePhone(newValue);
            }
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

input:focus {
    outline: none;
}
/* ----------------- BOLD, ITALICS, UNDERLINE ----------------- */
.bold {
    font-weight: bold;
}
.italics {
    font-style: italic;
}
.underline {
    text-decoration: underline;
}

/* ----------------- TEXT COLORS ----------------- */
.textarea-container {
    
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

/* ----------------- TEXT ALIGNMENT ----------------- */
.text-input-left {
    text-align: left;
}
.text-input-center {
    text-align: center;
}
.text-input-right {
    text-align: right;
}

.text-left {
    display: flex;
    justify-content: flex-start;
}
.text-h-center {
    display: flex;
    justify-content: center;
}
.text-right {
    display: flex;
    justify-content: flex-end;
}
.text-top {
    display: flex;
    align-items: flex-start;
}
.text-v-center {
    display: flex;
    align-items: center;
}
.text-bottom {
    display: flex;
    align-items: flex-end;
}

/* ----------------- POP UP BUTTONS ----------------- */
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

/* ----------------- FONT SIZES ----------------- */
.font-size-10 {
    font-size: 10px;
}
.font-size-11 {
    font-size: 11px;
}
.font-size-12 {
    font-size: 12px;
}
.font-size-13 {
    font-size: 13px;
}
.font-size-14 {
    font-size: 14px;
}
.font-size-15 {
    font-size: 15px;
}
.font-size-16 {
    font-size: 16px;
}
.font-size-17 {
    font-size: 17px;
}
.font-size-18 {
    font-size: 18px;
}
.font-size-19 {
    font-size: 19px;
}
.font-size-20 {
    font-size: 20px;
}
.font-size-24 {
    font-size: 24px;
}

/* ----------------- FONT STYLES ----------------- */
.font-arial {
    font-family: Arial;
}
.font-courier-new {
    font-family: Courier New;
}
.font-georgia {
    font-family: Georgia;
}
.font-times-new-roman {
    font-family: Times New Roman;
}
.font-verdana {
    font-family: Verdana;
}
</style>