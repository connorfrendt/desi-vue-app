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
                <div style="display: grid; grid-template-columns: 1fr 1fr; background-color: lightgray; margin: 10px;"
                    v-for="extAndModel in extAndModelNames" :key="extAndModel.ext"
                    @click="myFunc"
                >
                    <div>{{ extAndModel.ext }}</div>
                    <div>{{ extAndModel.modelName }}</div>
                </div>
            </div>
            <PhoneType
                :data="data"
                @user-input-object="userInputObjectUpdate"
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
            message: '',

            tempSelectedValue: '',
            selectedValue: '',
            
            tempModel: '',
            model: '',
            
            data: {},
            buttonClicked: false,
            tempExtension: '',
            extension: '',
            userInputObjectData: {},
            extAndModelNames: [],
            phones: [],
            modelNum: '',
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
            this.getModelNumber(this.selectedValue);
            this.extAndModelNames.push({
                "ext": this.extension,
                "modelName": this.getOptionText(this.model) + ' (' + this.getOptionText(this.selectedValue) + ')'
            });
            this.tempExtension = '';
            this.tempSelectedValue = '';
            this.tempModel = '';
            
            console.log('**********', this.userInputObjectData, typeof this.userInputObjectData);
            
            // this.addPhone(this.selectedValue);
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        userInputObjectUpdate(data) {
            this.userInputObjectData = data;
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
        getOptionText(value) {
            console.log('Value: ', value);
            const option = this.$el.querySelector(`option[value="${value}"]`);
            // return option ? option.innerHTML : value;
            return option.innerHTML;
        },
        myFunc() {
            console.log('Clicked');
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