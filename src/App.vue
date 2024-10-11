<template>
    <div id="app">
        <div style="display: flex; justify-content: center;">
            <select id="dropdown" v-model="selectedValue">
                <option id="option-0" value=""></option>
                <option id="option-1" value="phone.json">Phone</option>
                <option id="option-2" value="10130.json">10130</option>
                <option id="option-3" value="12455.json">12455</option>
            </select>
        </div>
        <div></div>
        <PhoneType :phoneType="phoneType" />
    </div>
</template>

<script>
import PhoneType from './components/PhoneType.vue';


export default {
    name: 'App',
    data() {
        return {
            userInput: [],
            phoneType: 'Default Phone Type',
            selectedValue: ''
        }
    },
    components: {
        PhoneType
    },
    methods: {
        fetchPhoneType(banana) {
            console.log(banana, typeof banana);
            fetch(`./json/${banana}`)
                .then(response => {
                    console.log('RESPONSE STATUS: ', response.status);
                    response.json()
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    },
    watch: {
        selectedValue(newValue) {
            this.phoneType = newValue;
            console.log(this.phoneType);
            this.fetchPhoneType(this.phoneType);
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>