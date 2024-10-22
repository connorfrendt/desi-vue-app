<template>
    <div id="app">
        <div style="text-align: center;">
            <button @click="addButton">Add</button>
        </div>

        <div style="display: flex; justify-content: center;">
            <div id="open-window" v-if="buttonClicked" style="text-align: center;">
                <label for="extension">Extension number to add:</label> 
                <input id="extension" type="text" v-model="extension" />
                
                <div><label>Phone to add:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select id="dropdown" v-model="selectedValue">
                        <option id="option-0" value=""></option>
                        <option id="option-1" value="phone.json">Phone</option>
                        <option id="option-2" value="10130.json">10130</option>
                        <option id="option-3" value="12455.json">12455</option>
                    </select>
                </div>
    
                <div>
                    <button @click="clickOK" :disabled="!extension || !selectedValue">OK</button>
                    <button @click="clickCancel">Cancel</button>
                </div>
            </div>
        </div>

        <div style="display: flex;">
            <div id="draggable-side-bar" ref="draggableDiv">
                <div style="display: flex; justify-content: space-around; background-color: lightgray;">
                    <div>Extension</div>
                    <div>Model</div>
                    <div>Name</div>
                </div>
                <div>{{ extension }}</div>
                <div 
                    style="width: 10px; height: 100%; background-color: darkslategray; position: absolute; top: 0; right: 0; cursor: ew-resize;" 
                    @mousedown.stop="startResize"
                ></div>
            </div>
            <PhoneType :data="data" @user-input-object="userInputObjectUpdate"/>
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
            selectedValue: '',
            data: {},
            buttonClicked: false,
            extension: '',
            userInputObjectData: {},
            userInputAndExtension: {
                "Ext": '',
                "ObjData": {}
            },
            isResizing: false,
            initialWidth: 0,
            initialX: 0,
            phones: []
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
            if(this.selectedValue) {
                this.fetchPhoneType(this.selectedValue);
                this.buttonClicked = false;
            }
            this.addPhone('Hello');
            this.addPhone('World');
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        userInputObjectUpdate(data) {
            this.userInputObjectData = data;
        },
        seeData() {
            this.userInputAndExtension = {
                "Ext": this.extension,
                "ObjData": this.userInputObjectData
            }
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
        addPhone(phone) {
            this.phones.push(phone);
            this.savePhones();
            console.log(this.phones);
        },
        savePhones() {
            localStorage.setItem('phone', JSON.stringify(this.phones));
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
    height: 100vh;
    width: 250px;
    min-width: 215px;
    max-width: 400px;
    background-color: slategrey;
    position: relative;
}
</style>