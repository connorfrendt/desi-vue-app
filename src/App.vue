<template>
    <div id="app">
        <button @click="addButton">ADD</button>
        <div id="open-window" v-if="buttonClicked">
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
        <div style="display: flex;">
            <div 
                style="height: 100vh; width: 300px; background-color: slategrey; position: relative;" 
                ref="draggableDiv"
                @mousedown="initDrag"
            >
                a
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
            initialX: 0
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

            console.log(this.extension);
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
            console.log('User input and extension:\n', this.userInputAndExtension);
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
        }
    }
}
</script>

<style>
body {
    background-color: gray;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

#open-window {
    background-color: lightgray;
    height: 200px;
    width: 300px;
}
</style>