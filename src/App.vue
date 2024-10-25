<template>
    <div id="app">
        <div style="text-align: center; background-color: slategray">
            <button @click="addButton">+ Add</button>
        </div>

        <div style="display: flex; justify-content: center;">
            <div id="open-window" v-if="buttonClicked" style="text-align: center;">
                <label for="extension">Extension number to add:</label> 
                <input id="extension" type="text" v-model="tempExtension" />
                
                <div><label>Product Family:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select id="dropdown" v-model="tempSelectedValue">
                        <option value=""></option>
                        <option value="10075.json">Toshiba DKT 2000</option>
                        <option value="10130.json">Vodavi Starplus II</option>
                        <option value="12455.json">Inter-Tel Axxess 8000 Series</option>
                    </select>
                </div>
                
                <div><label>Model:</label></div>
                <div style="display: flex; justify-content: center;">
                    <select v-model="tempModel">
                        <option value=""></option>
                        <option value="20-button-phone">20 Button Phone</option>
                        <option value="260">2603E, 2604, 2604E, 2606</option>
                        <option value="Inter-Tel">Inter-Tel Axxess 8000 Series</option>
                    </select>
                </div>

                <div>
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
                    <!-- <div>{{ extAndModelName.ext }}</div>
                    <div>{{ extAndModelName.modelName }}</div> -->
                    <div>{{ phones }}</div>
                </div>
                <!-- <div 
                    style="width: 10px; height: 100%; background-color: darkslategray; position: absolute; top: 0; right: 0; cursor: ew-resize;"
                    @mousedown.stop="startResize"
                ></div> -->
            </div>
            <PhoneType
                :data="data"
                @model-name="modelNameUpdate"
                @user-input-object="userInputObjectUpdate"
            />
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
            
            tempModel: '',
            model: '',
            
            // selectedValue: '',
            data: {},
            buttonClicked: false,
            tempExtension: '',
            extension: '',
            userInputObjectData: {},
            userInputAndExtension: {
                "ext": '',
                "objData": {}
            },
            extAndModelName: {
                "ext": '',
                "modelName": ''
            },
            phones: [],
            modelNum: '',
            modelName: ''
            // isResizing: false,
            // initialWidth: 0,
            // initialX: 0,
        }
    },
    components: {
        PhoneType
    },
    methods: {
        fetchPhoneType(phone) {
            return fetch(`./json/${phone}`)
                .then(response => {
                    console.log('response');
                    return response.json();
                })
                .then(data => {
                    console.log('data');
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
                this.buttonClicked = false;
            }
            this.getModelNumber(this.selectedValue);
            console.log('MODEL??????', this.tempModel);
            // this.addPhone({ [this.extension]: [this.modelName] });
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        userInputObjectUpdate(data) {
            this.userInputObjectData = data;
        },
        modelNameUpdate(data) {
            this.modelName = data;
        },
        getModelNumber(file) {
            this.modelNum = file.split('.')[0];
        },
        addPhone(phone) {
            this.phones.push(phone);
            this.savePhones();
        },
        savePhones() {
            localStorage.setItem(this.extension + '-' + this.modelNum, JSON.stringify(this.phones));
        },
        seeData() {
            this.userInputAndExtension = {
                "Ext": this.extension,
                "ObjData": this.userInputObjectData
            }
        },
        // startResize(event) {
        //     this.isResizing = true;
        //     this.initialWidth = this.$refs.draggableDiv.offsetWidth;
        //     this.initialX = event.clientX;
        //     document.addEventListener('mousemove', this.resize);
        //     document.addEventListener('mouseup', this.stopResize);
        // },
        // resize(event) {
        //     if(this.isResizing) {
        //         const newWidth = this.initialWidth + (event.clientX - this.initialX);
        //         this.$refs.draggableDiv.style.width = `${newWidth}px`;
        //     }
        // },
        // stopResize() {
        //     this.isResizing = false;
        //     document.removeEventListener('mousemove', this.resize);
        //     document.removeEventListener('mouseup', this.stopResize);
        // },
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