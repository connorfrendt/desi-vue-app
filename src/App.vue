<template>
    <div id="app">
        <div style="text-align: center; background-color: slategray">
            <button @click="addButton">+ Add</button>
        </div>

        <div style="display: flex; justify-content: center;">
            <div id="open-window" v-if="buttonClicked" style="text-align: center;">
                <label for="extension">Extension number to add:</label> 
                <input id="extension" type="text" v-model="tempExtension" />
                
                <div><label>Phone to add:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select id="dropdown" v-model="tempSelectedValue">
                        <option id="option-0" value=""></option>
                        <option id="option-1" value="10075.json">10075</option>
                        <option id="option-2" value="10130.json">10130</option>
                        <option id="option-3" value="12455.json">12455</option>
                    </select>
                </div>
    
                <div>
                    a
                    <button @click="clickOK" :disabled="!tempExtension || !tempSelectedValue">OK</button>
                    <button @click="clickCancel">Cancel</button>
                </div>
            </div>
        </div>

        <div style="display: flex;">
            <div id="draggable-side-bar" ref="draggableDiv">
                <div style="display: flex; justify-content: space-around; background-color: lightgray;">
                    <div>Extension</div>
                    <div>Model</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr;">
                    <div>{{ extension }}</div>
                    <div>{{ modelName }}</div>
                </div>
                <div 
                    style="width: 10px; height: 100%; background-color: darkslategray; position: absolute; top: 0; right: 0; cursor: ew-resize;"
                    @mousedown.stop="startResize"
                ></div>
            </div>
            <PhoneType :data="data" @user-input-object="userInputObjectUpdate" @model-name="modelNameUpdate"/>
        </div>
        <button @click="seeData">Data</button>
    </div>
</template>

<script>
import PhoneType from './components/PhoneType.vue';

export default {
    name: 'App',
    data() {
        return {
            message: '',
            tempSelectedValue: '',
            selectedValue: '',
            data: {},
            buttonClicked: false,
            tempExtension: '',
            extension: '',
            userInputObjectData: {},
            userInputAndExtension: {
                "Ext": '',
                "ObjData": {}
            },
            isResizing: false,
            initialWidth: 0,
            initialX: 0,
            phones: [],
            modelNum: '',
            modelName: ''
        }
    },
    components: {
        PhoneType
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
            if(this.selectedValue) {
                this.fetchPhoneType(this.selectedValue);
                console.log('here');
                this.buttonClicked = false;
            }
            
            this.getModelNumber(this.selectedValue);
            this.addPhone('Hello World');
            // this.addPhone();
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        userInputObjectUpdate(data) {
            this.userInputObjectData = data;
        },
        modelNameUpdate(data) {
            console.log('DATA HERE: ', data);
            this.modelName = data;
        },
        seeData() {
            this.userInputAndExtension = {
                "Ext": this.extension,
                "ObjData": this.userInputObjectData
            }
            console.log(this.userInputAndExtension);
        },
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
        getModelNumber(file) {
            this.modelNum = file.split('.')[0];
            console.log(this.modelNum);
        },
        addPhone(phone) {
            this.phones.push(phone);
            this.savePhones();
            console.log(this.phones);
        },
        savePhones() {
            localStorage.setItem(this.extension + '-' + this.modelNum, JSON.stringify(this.phones));
        }
    }
}
</script>

<style>
body {
    background-color: gray;
}

#open-window {
    background-color: lightgray;
    height: 200px;
    width: 300px;
}

#draggable-side-bar {
    height: 75vh;
    width: 250px;
    min-width: 215px;
    max-width: 400px;
    background-color: slategrey;
    position: relative;
}
</style>