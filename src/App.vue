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
                    <div style="width: 20px;"></div>
                </div>
                <div style="margin: 10px;"
                    class="phone-list"
                    v-for="phone in phoneList" :key="phone.ext"
                    @click="phoneClickedFunc($event)"
                >
                    <div style="display: grid; grid-template-columns: 1fr 1fr 20px;">
                        <div>{{ phone.ext }}</div>
                        <div>{{ phone.modelName }}</div>
                        <button @click="deletePhone($event)">DEL</button>
                    </div>
                </div>
            </div>
            <PhoneType
                :data="data"
                @user-input-object="userInputObjectUpdate($event)"
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
            phoneIndex: 0,
            
            modelNum: '',
            phoneClicked: false,
            currentPhoneIndexClicked: '',
            previousPhoneClicked: '',

            innerModelText: '',
            innerProdFamText: '',

            currentBox: '',
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
        phoneClickedFunc(event) {
            let clickedDiv = event.target;
            let parentDiv = clickedDiv.parentElement;
            
            // I need to match whatever ext I clicked on with the extension of the object. Take the value of the object and put it through fetchPhoneType
            this.phoneIndex = this.phoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);
            
            this.currentPhoneIndexClicked = this.phoneIndex;
            
            this.data = this.phoneList[this.phoneIndex].userData[0];
        },
        showPhoneOne() {
            // console.log('List', this.phoneList);
            console.log('Comment', this.phoneList[0].userData[0].objects["76096"].userComment);
        },
        showPhoneTwo() {
            console.log(this.phoneList[1].userData[0].objects["76096"].userComment);
        },
        showPhoneThree() {
            console.log(this.phoneList[2].userData[0].objects["76096"].userComment);
        },
        deletePhone(event) {
            let clickedDiv = event.target;
            let parentDiv = clickedDiv.parentElement;

            // Finds the index of the phone in the phoneList that was clicked on
            this.phoneIndex = this.phoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);
            
            // Removes the phone from the phoneList
            this.phoneList.splice(this.phoneIndex, 1);
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
    width: 270px;
    min-width: 215px;
    max-width: 400px;
    background-color: slategrey;
    position: relative;
}
</style>