<template>
    <div id="app">
        <div style="text-align: center; background-color: slategray">
            <button @click="addButton">+ Add</button>
        </div>

        <div style="display: flex; justify-content: center;">
            <div id="open-window" v-if="buttonClicked" style="text-align: center; z-index: 20;">
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
                        <option id="value1" value="20-button-phone">20 Button Phone</option>
                        <option id="value2" value="260">2603E, 2604, 2604E, 2606</option>
                        <option id="value3" value="Inter-Tel">Inter-Tel Axxess 8000 Series</option>
                    </select>
                </div>

                <div>
                    <button @click="clickOK" :disabled="!tempExtension || !tempSelectedValue || !tempModel">OK</button>
                    <button @click="clickCancel">Cancel</button>
                </div>
            </div>
        </div>

        <!-- SIDE BAR -->
        <div style="display: flex;">
            <div id="draggable-side-bar" ref="draggableDiv">
                <div style="display: flex; justify-content: space-around; background-color: lightgray;">
                    <div>Extension</div>
                    <div>Model</div>
                </div>
                <div style="margin: 10px;"
                    class="phone-list"
                    v-for="phone in phoneList" :key="phone.ext"
                    @click="phoneClickedFunc($event)"
                >
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                        <div>{{ phone.ext }}</div>
                        <div>{{ phone.modelName }}</div>
                    </div>
                </div>
            </div>
            <PhoneType
                :data="data"
                @user-input-object="userInputObjectUpdate"
                @current-box-input="currentBoxUpdate"
            />
        </div>
        <button @click="showPhoneOne">Phone 1</button>
        <button @click="showPhoneTwo">Phone 2</button>
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
            modelNum: '',
            phoneClicked: false,
            currentPhoneIndexClicked: '',
            previousPhoneClicked: '',

            innerModelText: '',
            innerProdFamText: ''
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
            console.log('5', data);
            this.userInputObjectData = data;
            const userDataCopy = JSON.parse(JSON.stringify(this.userInputObjectData));
            
            console.log('userDataCopy', userDataCopy);
            
            this.phoneList.push({
                "ext": this.extension,
                "modelName": this.innerModelText + ' (' + this.innerProdFamText + ')',
                "value": this.selectedValue,
                "userData": userDataCopy,
            });
            
            this.tempExtension = '';
            this.tempSelectedValue = '';
            this.tempModel = '';
        },
        currentBoxUpdate(data) {
            this.currentBox = data;
        },
        getModelNumber(file) {
            this.modelNum = file.split('.')[0];
        },
        addPhone(phone) {
            this.phoneList.push(phone);
            this.savePhones(phone);
        },
        savePhones(phone) {
            localStorage.setItem(this.extension + '-' + this.modelNum, JSON.stringify(phone));
        },
        getOptionText(value) {
            const option = this.$el.querySelector(`option[value="${value}"]`);
            return option ? option.innerHTML : value;
        },
        phoneClickedFunc(event) {
            let clickedDiv = event.target;
            let parentDiv = clickedDiv.parentElement;
            
            // I need to match whatever ext I clicked on with the extension of the object. Take the value of the object and put it through fetchPhoneType
            let phoneIndex = this.phoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);
            
            this.currentPhoneIndexClicked = phoneIndex;
            console.log(this.phoneList[phoneIndex].userData);
            // this.data = this.phoneList[phoneIndex].userData;
            console.log('DATA: ', this.data);
            console.log(this.phoneList);
        },
        showPhoneOne() {
            console.log(this.phoneList);
            console.log(this.phoneList[0].userData[0].objects["76096"].userComment);
        },
        showPhoneTwo() {
            console.log(this.phoneList[1].userData[0].objects["76096"].userComment);
        },
        showPhoneThree() {
            console.log(this.phoneList[2].userData[0].objects["76096"].userComment);
        }
    },

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