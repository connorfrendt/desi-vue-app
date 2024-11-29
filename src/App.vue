<template>
    <div id="app">
        <div style="text-align: center; background-color: slategray;">
            <div class="simple-button true-center" @click="addButton">
                <font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px;" />
                Add
            </div>
        </div>

        <!-- ADD PHONE WINDOW -->
        <div id="add-phone-window">
            <div id="open-window" v-if="buttonClicked" style="text-align: center; z-index: 20;">
                <label for="extension" style="margin-top: 10px;">Extension number to add:</label> 
                <input id="extension" type="text" v-model="tempExtension" />
                
                <div style="margin-top: 20px;"><label>Product Family:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select id="dropdown" v-model="tempSelectedValue">
                        <option value=""></option>
                        <option value="10075.json">Toshiba DKT 2000</option>
                        <option value="10130.json">Vodavi Starplus II</option>
                        <option value="12455.json">Inter-Tel Axxess 8000 Series</option>
                    </select>
                </div>
                
                <div style="margin-top: 20px; "><label>Model:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select v-model="tempModel">
                        <option value=""></option>
                        <option id="value1" value="20-button-phone">20 Button Phone</option>
                        <option id="value2" value="260">2603E, 2604, 2604E, 2606</option>
                        <option id="value3" value="Inter-Tel">Inter-Tel Axxess 8000 Series</option>
                    </select>
                </div>

                <div style="display: flex; padding-top: 15px;">
                    <button
                        class="simple-button true-center" style="background-color: white;"
                        @click="clickOK" :class="{ disabled: tempExtension === '' || tempSelectedValue === '' || tempModel === '' }"
                        :disabled="tempExtension === '' || tempSelectedValue === '' || tempModel === ''">
                        OK
                    </button>
                    <button class="simple-button true-center" style="background-color: white;" @click="clickCancel">Cancel</button>
                </div>
            </div>
        </div>

        <!-- SIDE BAR -->
        <div style="display: flex;">
            <div id="draggable-side-bar" ref="draggableDiv">

                <div class="ext-model-header" style="display: flex; background-color: lightgray;">
                    <div id="extension-header-side-bar" ref="draggableExtDiv" style="min-width: 50px;">Extension</div>
                    <div class="draggable-header" @mousedown="startExtResize"></div>
                    <div id="model-header-side-bar" ref="draggableModelDiv">Model</div>
                    <div class="draggable-header" @mousedown="startModelResize"></div>
                </div>
                
                <div style="margin: 10px 0;"
                    class="phone-list"
                    v-for="(phone, index) in phoneList" :key="phone.ext"
                >
                    <div
                        @click="phoneClickedFunc($event, index)"
                        :class="{ active: index === currentPhoneIndexClicked || index === phoneIndex }"
                        class="phone-listing"
                    >
                        <div class="phone-listing-ext" ref="extensionDivs">{{ phone.ext }}</div>
                        <div class="phone-listing-model">
                            <div class="model-name" ref="modelDivs">{{ phone.modelName }}</div>
                            <!-- <div @click.stop="deletePhone($event)" class="trash-button">
                                <font-awesome-icon icon="fa-regular fa-trash-can" @click.stop="deletePhone($event)" class="trash-icon" style="float: right; z-index: 2;" />
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <div id="drag-handle" @mousedown="startResize" style="cursor: ew-resize; height: 96vh; width: 5px; background-color: darkgray;"></div>
            
            <PhoneType
                :data="data"
                @user-input-object="userInputObjectUpdate($event)"
                @current-box-input="currentBoxUpdate"
            />
        </div>
    </div>
</template>

<script>
import PhoneType from './components/PhoneType.vue';

export default {
    name: 'App',
    data() {
        return {
            tempSelectedValue: '',
            selectedValue: '',
            
            tempModel: '',
            model: '',
            
            tempExtension: '',
            extension: '',

            data: {},
            buttonClicked: false,
            userInputObjectData: {},
            
            phoneList: [],

            phoneIndex: 0,
            currentPhoneIndexClicked: -1,
            
            modelNum: '',

            innerModelText: '',
            innerProdFamText: '',

            currentBox: '',

            isResizing: false,
            initialWidth: 0,
            initialX: 0
        }
    },
    components: {
        PhoneType
    },
    mounted() {
        this.setModelWidths();
    },
    methods: {
        fetchPhoneType(phone) {
            return fetch(`./json/${phone}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.data = data;
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        },
        addButton() {
            this.buttonClicked = !this.buttonClicked;
        },
        clickOK() {
            this.extension = this.tempExtension;
            this.selectedValue = this.tempSelectedValue;
            this.model = this.tempModel;
            if(this.selectedValue) {
                this.fetchPhoneType(this.selectedValue);
                this.buttonClicked = false;
            }
            
            this.innerModelText = this.getOptionText(this.model);
            this.innerProdFamText = this.getOptionText(this.selectedValue);
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        userInputObjectUpdate(data) {
            this.userInputObjectData = data;

            // Check to see if the phone exists
            let phoneExists = this.phoneList.some(phone => phone.ext === this.extension);
            
            const userDataCopy = JSON.parse(JSON.stringify(this.userInputObjectData));

            if(!phoneExists) {
                this.phoneList.push({
                    "ext": this.extension,
                    "modelName": this.innerModelText + ' (' + this.innerProdFamText + ')',
                    "value": this.selectedValue,
                    "userData": userDataCopy,
                });
                this.phoneIndex = this.phoneList.length - 1;
            }
            this.tempExtension = '';
            this.tempSelectedValue = '';
            this.tempModel = '';
            
        },
        currentBoxUpdate(currentBox) {
            this.currentBox = currentBox;

            // This takes the current boxes information of the userInputObjectData, and updates the current box's information in the phoneList
            this.phoneList[this.phoneIndex].userData[0].objects[this.currentBox[0]] = this.userInputObjectData[0].objects[this.currentBox[0]];
        },
        getModelNumber(file) {
            this.modelNum = file.split('.')[0];
        },
        // addPhone(phone) {
        //     this.phoneList.push(phone);
        //     this.savePhones(phone);
        // },
        // savePhones(phone) {
        //     localStorage.setItem(this.extension + '-' + this.modelNum, JSON.stringify(phone));
        // },
        getOptionText(value) {
            const option = this.$el.querySelector(`option[value="${value}"]`);
            return option ? option.innerHTML : value;
        },
        phoneClickedFunc(event, index) {
            let clickedDiv = event.target;
            let parentDiv = clickedDiv.parentElement;
            
            // I need to match whatever ext I clicked on with the extension of the object. Take the value of the object and put it through fetchPhoneType
            this.phoneIndex = this.phoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);
            
            // this.currentPhoneIndexClicked = this.phoneIndex;
            
            this.currentPhoneIndexClicked = index;

            this.data = this.phoneList[this.phoneIndex].userData[0];
        },
        deletePhone(event) {
            event.stopPropagation();
            if(confirm('Are you sure you want to delete this phone?')) {
                // Finds the parent div of the trash can icon
                let parentDiv = event.target.parentElement.parentElement;
                
                // Finds the index of the phone in the phoneList that was clicked on
                this.phoneIndex = this.phoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);

                // Removes the phone from the phoneList
                this.phoneList.splice(this.phoneIndex, 1);
            }
        },

        /** *********** SIDEBAR RESIZING *********** */
        startResize(event) {
            this.isResizing = true;
            this.initialWidth = this.$refs.draggableDiv.offsetWidth;
            this.initialX = event.clientX;
            document.addEventListener('mousemove', this.resize);
            document.addEventListener('mouseup', this.stopResize);
        },
        resize(event) {
            if(this.isResizing) {
                const newWidth = this.initialWidth + (event.clientX - this.initialX);
                this.$refs.draggableDiv.style.width = `${newWidth}px`;
            }
        },
        stopResize() {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.resize);
            document.removeEventListener('mouseup', this.stopResize);
        },

        /** *********** EXTENSION RESIZING *********** */
        startExtResize(event) {
            this.isResizing = true;
            this.initialWidth = this.$refs.draggableExtDiv.offsetWidth;
            this.initialX = event.clientX;
            document.addEventListener('mousemove', this.resizeExt);
            document.addEventListener('mouseup', this.stopExtResize);
        },
        resizeExt(event) {
            if(this.isResizing) {
                const newWidth = this.initialWidth + (event.clientX - this.initialX);
                this.$refs.draggableExtDiv.style.width = `${newWidth}px`;
                if(this.$refs.extensionDivs) {
                    this.$refs.extensionDivs.forEach(div => {
                        div.style.width = `${newWidth}px`;
                    });
                }
            }
        },
        stopExtResize() {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.resizeExt);
            document.removeEventListener('mouseup', this.stopExtResize);
        },
        

        /** *********** MODEL RESIZING *********** */
        startModelResize(event) {
            this.isResizing = true;
            this.initialWidth = this.$refs.draggableModelDiv.offsetWidth;
            this.initialX = event.clientX;
            document.addEventListener('mousemove', this.resizeModel);
            document.addEventListener('mouseup', this.stopModelResize);
        },
        resizeModel(event) {
            if(this.isResizing) {
                const newWidth = this.initialWidth + (event.clientX - this.initialX);
                this.$refs.draggableModelDiv.style.width = `${newWidth}px`;
                if(this.$refs.modelDivs) {
                    this.$refs.modelDivs.forEach(div => {
                        div.style.width = `${newWidth}px`;
                    });
                }
            }
        },
        stopModelResize() {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.resizeModel);
            document.removeEventListener('mouseup', this.stopModelResize);
        },
        setModelWidths() {
            console.log('Mounted');
            const modelHeaderWidth = this.$refs.draggableModelDiv.offsetWidth;
            this.$refs.modelDivs.forEach(div => {
                div.style.width = `${modelHeaderWidth}px`;
            });
        },
    },

}
</script>

<style>
body {
    background-color: gray;
}

.simple-button {
    width: 70px;
    height: 40px;
    background-color: lightgray;
    margin: 0 auto;
    cursor: pointer;
    border-radius: 5px;
}
.simple-button:active {
    background-color: gray;
}
.simple-button.disabled {
    color: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
    pointer-events: none;
}

.disabled {
    color: rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
}

#open-window {
    background-color: lightgray;
    height: 235px;
    width: 300px;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    font-size: 16px;
}

#add-phone-window {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 20;
}

.ext-model-header {
    display: flex;
    background-color: lightgray;
    padding: 5px;
}
#extension-header-side-bar {
    width: 150px;
}
#model-header-side-bar {
    width: 150px;
}
.draggable-header {
    width: 3px;
    background-color: black;
    cursor: ew-resize;
}

#drag-handle {
    cursor: ew-resize;
    width: 10px;
    background-color: darkgray;
}

#draggable-side-bar {
    display: flex;
    flex-direction: column;
    height: 96vh;
    width: 250px;
    background-color: slategrey;
    position: relative;
    overflow: hidden;
}

.trash-button{
    display: flex;
    align-items: center;
    background-color: gray;
    border-radius: 5px;
    padding: 10px;
    flex-shrink: 0;
}
.trash-button:hover {
    background-color: lightgray;
    border-radius: 5px;
    padding: 10px;
}
.trash-icon {
    pointer-events: none;
    margin: 0 auto;
    flex-shrink: 0;
}

.phone-listing {
    display: flex;
    background-color: lightgray;
    padding: 5px;
    border: 2px solid lightgray;
    border-radius: 5px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
}
.phone-listing.active {
    border: 2px solid blue;
    border-radius: 5px;
}
.phone-listing-ext {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.phone-listing-model {
    display: flex;
    align-items: center;
    overflow: hidden;
}

.true-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.model-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>