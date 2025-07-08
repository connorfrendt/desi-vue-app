<template>
    <div>
        <div class="main-header">
            <div id="header" class="">
                <a href="https://labels.desi.com/" target="_blank">
                    <img class="desi-logo" src="../assets/desi-logo.png" />
                </a>
                <div class="true-center header-button p-[100px]">
                    <font-awesome-icon icon="fa-regular fa-folder-open" style="margin-right: 5px;" />
                    Open
                </div>
                <div class="true-center header-button">
                    <font-awesome-icon icon="fa-regular fa-floppy-disk" style="margin-right: 5px;" />
                    Save
                </div>
                <div class="true-center header-button" @click="addButton">
                    <font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px;" />
                    Add
                </div>
                <div class="header-button true-center" @click="printPage">
                    <font-awesome-icon icon="fa-solid fa-print" style="margin-right: 5px;" />
                    Print
                </div>
                <div class="true-center header-button" @click="zoomFunc">
                    Zoom
                </div>
            </div>
            <div style="display: flex; margin-right: 25px;">
                <div class="true-center header-button" style="padding-right: 10px;" @click="addProject">
                    <font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 5px;" />
                    Add
                </div>
                <div class="true-center header-button" style="padding-right: 40px;" @click="editProject">
                    <font-awesome-icon icon="fa-regular fa-pen-to-square" class="edit-icon" style="z-index: 2;" />
                    Edit
                </div>
                <div class="simple-button true-center header-button" style="margin-right: 25px; padding-right: 10px; text-align: center;">
                    <select v-model="selectedProject" @change="handleProjectChange">
                        <option value="">Select a project</option>
                        <option v-for="project in Object.keys(phoneListsFromDB)" :key="project" :value="project">{{ projectDisplayNamesFromDB[project] }}</option>
                    </select>
                </div>
                <div style="margin: auto; height: 100%; width: 80px; display: flex; align-items: center;">
                    <div v-if="authData && authData.record">
                        <font-awesome-icon icon="fa-regular fa-user" style="margin-right: 5px;" />
                        Account
                        {{ authData.record.name }}
                    </div>
                    <div v-else>
                        Loading User Data...
                    </div>
                </div>
                <div class="true-center header-button" @click="handleLogoutSubmit">
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" style="margin-right: 5px;" />
                    Logout
                </div>
            </div>
        </div>

        <!--================ ADD PHONE WINDOW ================-->
        <div id="add-phone-window">
            <div id="open-window" v-if="buttonClicked" style="text-align: center; z-index: 20;">
                <label for="extension" style="margin-top: 10px;">Extension number to add:</label>
                <br />
                <input id="extension" type="number" v-model="tempExtension" style="width: 365px;" />
                
                <div style="margin-top: 20px;">
                    <label>Product Family:</label>
                </div>
                <div style="display: flex; justify-content: center;">
                    <select id="dropdown" v-model="tempSelectedValue" @change="fetchModels(tempSelectedValue)" style="width: 365px;">
                        <option value="">Select a Product...</option>
                        <option v-for="folder in folders" :key="folder" :value="folder">{{ folder }}</option>
                    </select>
                </div>
                
                <div style="margin-top: 20px;">
                    <label>Model:</label>
                </div>
                <div style="display: flex; justify-content: center;">
                    <select @change="uncheckTemplate()" class="model-selection" v-model="tempModel" style="width: 365px;">
                        <option value="">Select a Model...</option>
                        <option v-for="model in models" :key="model" :value="model">{{ takeJSONExtOff(model) }}</option>
                    </select>
                </div>

                <div style="margin-top: 20px;"><label>Person's Name (optional)</label></div>
                <div>
                    <input type="text" v-model="tempName" style="width: 365px;" />
                </div>

                <div id="template-checkbox">
                    <input :disabled="tempSelectedValue === '' || tempModel === ''" type="checkbox" v-model="templateCheckBox" @change="onlyShowExtensionsForCurrentPhoneModel" />
                        Show Templating Options
                </div>
                <div v-if="templateCheckBox">
                    <select style="width: 365px;" v-model="tempCurrentTemplateSelected">
                        <option v-if="currentPhoneList.length === 0" value="">No Template</option>
                        <option v-for="phone in modelList" :key="phone.ext" :value="phone.ext">{{ phone.ext }} <span v-if="phone.name">({{ phone.name }})</span></option>
                    </select>
                </div>
                

                <!--================ Okay/Cancel Buttons ================-->
                <div style="display: flex; justify-content: space-around; padding-top: 15px;">
                    <button
                        class="ok-cancel-btn true-center" style="background-color: white;"
                        @click="addPhone" :class="{ disabled: tempExtension === '' || tempSelectedValue === '' || tempModel === '' }"
                        :disabled="tempExtension === '' || tempSelectedValue === '' || tempModel === ''">
                        OK
                    </button>
                    <button class="ok-cancel-btn true-center" style="background-color: white;" @click="clickCancel">
                        Cancel
                    </button>
                </div>

            </div>
        </div>

        <!--================ SIDE BAR ================-->
        <div style="display: flex;">
            <div id="draggable-side-bar" ref="draggableDiv">

                <div class="ext-model-header" style="display: flex; background-color: lightgray;">
                    <div class="ext-model-header-side-bar" ref="draggableExtDiv">Extension</div>
                    <div class="draggable-header" @mousedown="startExtResize"></div>
                    <div class="ext-model-header-side-bar" ref="draggableModelDiv">Model</div>
                    <div class="draggable-header" @mousedown="startModelResize"></div>
                    <div class="ext-model-header-side-bar">Name</div>
                </div>
                
                <div style="margin: 10px 0;"
                    class="phone-list"
                    v-for="(phone, index) in currentPhoneList" :key="phone.ext"
                >
                    <div
                        @click="phoneClickedFunc($event, index)"
                        :class="{ active: index === currentPhoneIndexClicked || index === phoneIndex }"
                        class="phone-listing"
                        ref="phoneListingDiv"
                    >
                        <div class="phone-listing-ext" ref="extensionDivs">{{ phone.ext }}</div>
                        <div class="phone-listing-model" ref="modelDivs">{{ phone.modelDisplayName }}</div>
                        <div class="phone-listing-name">{{ phone.name }}</div>
                    </div>
                    <div id="edit-trash-div"
                        v-if="index === currentPhoneIndexClicked || index === phoneIndex"
                        style="display: flex;"
                        >
                        <div @click="showEditPhoneListing" class="edit-button">
                            <font-awesome-icon icon="fa-regular fa-pen-to-square" class="edit-icon" style="z-index: 2;" />
                        </div>
                        <div @click.stop="deletePhone($event, index)" class="trash-button">
                            <font-awesome-icon icon="fa-regular fa-trash-can" @click.stop="deletePhone($event, index)" class="trash-icon" style="z-index: 2;" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="drag-handle" @mousedown="startResize">
                <font-awesome-icon icon="fa-solid fa-grip-lines-vertical" class="drag-lines" />
            </div>
            
        </div>

        <!--================ EDIT PHONE LISTING POPUP ================-->
        <div v-if="phoneListingClicked" class="edit-button-popup">
            <div style="display: grid; grid-template-columns: 1fr 2fr;">
                <div>Extension ID:</div>
                <div><input v-model="extPopup" type="text" style="width: 100%;" /></div>
                
                <div>Name:</div>
                <div><input v-model="namePopup" type="text" style="width: 100%;" /></div>
                
                <div>Product Family:</div>
                <div>{{ prodFamEditPopup }}</div>
                
                <div>Model:</div>
                <div>{{ modelEditPopup }}</div>
                
                <div>TypeCode:</div>
                <div>{{ typeCodeEditPopup }}</div>
            </div>


            <div class="edit-popup">
                <div class="edit-popup-ok" @click="confirmEditPopup">OK</div>
                <div class="edit-popup-cancel" @click="cancelEditPopup">Cancel</div>
            </div>
        </div>

        <PhoneType
            id="phone-type"
            :data="data"
            :phoneIndex = "phoneIndex"
            @user-input-object="userInputObjectUpdate($event)"
            @current-box-input="currentBoxUpdate"
        />
    </div>
</template>

<script>
import PhoneType from './PhoneType.vue';
import printJS from 'print-js';

import { showEditPhoneListing, confirmEditPopup, cancelEditPopup } from '@/utils/phoneListingPopUp.js';
import {
    startExtResize, resizeExt, stopExtResize,
    startModelResize, resizeModel, stopModelResize,
    startResize, resize, stopResize
} from '@/utils/resizing.js';

export default {
    data() {
        return {
            tempSelectedValue: '',
            selectedValue: '',
            
            tempModel: '',
            model: '',
            
            tempExtension: '',
            extension: '',

            tempName: '',
            name: '',

            data: {},
            buttonClicked: false,
            userInputObjectData: {},
            
            fullPhoneDB: {},

            selectedProject: '',
            
            displayProjectName: '',
            displayProjectNameFromDB: '',
            projectDisplayNames: {},
            projectDisplayNamesFromDB: {},

            storedProjectName: '',
            storedProjectNameFromDB: '',
            phoneLists: {}, // The literal phone list connected to it's list of phones (Project A: [// each phone here])
            phoneListsFromDB: {},
            phone: '',
            phoneListDisplayNamesFromDB: [],

            recordsFromDB: {},

            modelList: [], // This is for the adding phone pop up
            projectList: [], // This is for the adding phone pop up

            phoneIndex: 0,
            currentPhoneIndexClicked: -1,

            modelNum: '',

            innerModelText: '',
            innerProdFamText: '',

            currentBox: '',

            isResizing: false,
            initialWidth: 0,
            initialX: 0,
            currentSideBarWidth: 0,

            templateCheckBox: false,
            phoneListingClicked: false,

            namePopup: '',
            extPopup: '',

            prodFamEditPopup: '',
            modelEditPopup: '',
            typeCodeEditPopup: '',
            
            tempCurrentTemplateSelected: '',
            currentTemplateSelected: '',

            folders: [],
            models: [],

            justifyContent: 'center',
            alignItems: 'center',

            testUser: '',

            selectedPhoneListId: 0,
            selectedPhoneId: 0,

            currentPhone: '',
        }
    },
    components: {
        PhoneType
    },
    props: {
        onLogout: Function,
        user: Object,
        pb: Object,
        authData: Object,
    },
    created() {
        this.pb.collection('phone_lists').getFullList().then(records => {
            this.recordsFromDB = records;
            
            // Project Display Names first
            for(let i = 0; i < this.recordsFromDB.length; i++) {
                this.storedProjectNameFromDB = this.recordsFromDB[i].stored_name;
                this.displayProjectNameFromDB = this.recordsFromDB[i].display_name;
                this.projectDisplayNamesFromDB[this.storedProjectNameFromDB] = this.displayProjectNameFromDB;

                this.$set(this.phoneListsFromDB, this.storedProjectNameFromDB, []);
            }
            
            this.phoneListDisplayNamesFromDB = Object.entries(this.projectDisplayNamesFromDB);
            
        });

        this.pb.collection('phones').getFullList({
            expand: 'phone_list_id'
        }).then(data => {
            this.fullPhoneDB = data;
            
            let currentPhoneListFromDB = '';
            let currentPhoneFromDB = '';
            for(let i = 0; i < data.length; i++) {
                currentPhoneListFromDB = data[i].expand.phone_list_id.stored_name;
                currentPhoneFromDB = data[i].user_input_object;
                this.phoneListsFromDB[currentPhoneListFromDB].push(currentPhoneFromDB);
            }
        })
 
    },
    methods: {
        async addProject() {
            this.phoneIndex = -1;
            this.currentPhoneIndexClicked = -1;
            this.data = {};

            // Stores the project name that will be displayed
            this.displayProjectName = prompt('Enter a name for the new project:');

            if(this.displayProjectName === null || this.displayProjectName === '') {
                return;
            }

            // Stores the prjoect name that will be stored
            this.storedProjectName = this.toCamelCase(this.displayProjectName);

            this.$set(this.phoneLists, this.storedProjectName, []);

            // This edits the obj (projectDisplayNames) with { storedProjectName: displayProjectName }
            this.projectDisplayNames[this.storedProjectName] = this.displayProjectName;
            this.selectedProject = this.storedProjectName;
            let phoneListDisplayNames = Object.entries(this.projectDisplayNames);
            let phoneListDisplayNamesLength = phoneListDisplayNames.length;
            
            let stored_name = phoneListDisplayNames[phoneListDisplayNamesLength - 1][0];
            let display_name = phoneListDisplayNames[phoneListDisplayNamesLength - 1][1];

            this.phoneList = await this.pb.collection('phone_lists').create({
                customer_id: this.authData.record.id,
                stored_name,
                display_name,
            });

            let fullPhoneListDB = await this.pb.collection('phone_lists').getFullList();
            let selectedPhoneList = fullPhoneListDB.find(phoneList => phoneList.stored_name === this.selectedProject);
            this.selectedPhoneListId = selectedPhoneList.id;
        },
        async editProject() {
            // Grabs the full phone list from the database
            let fullPhoneListDB = await this.pb.collection('phone_lists').getFullList();

            // Finds the selected phone list in the database and grabs the id for updating
            let selectedPhoneList = fullPhoneListDB.find(phoneList => phoneList.stored_name === this.selectedProject);
            let selectedPhoneListId = selectedPhoneList.id;

            // Prompts user to change the name of the project, and changes it in the database and code
            this.displayProjectName = prompt('Enter a new name for the project');
            this.storedProjectName = this.toCamelCase(this.displayProjectName);
            
            this.$set(this.phoneLists, this.storedProjectName, []);
            
            // This edits the obj (projectDisplayNames) with { storedProjectName: displayProjectName }
            this.projectDisplayNames[this.storedProjectName] = this.displayProjectName;
            this.selectedProject = this.storedProjectName;
            
            await this.pb.collection('phone_lists').update(selectedPhoneListId, {
                stored_name: this.storedProjectName,
                display_name: this.displayProjectName,
            });

        },
        async handleProjectChange() {
            // We know the selected project, so we can grab the id from the database of the selected project
            let fullPhoneListDB = await this.pb.collection('phone_lists').getFullList();
            
            let selectedPhoneList = fullPhoneListDB.find(phoneList => phoneList.stored_name === this.selectedProject);
            this.selectedPhoneListId = selectedPhoneList.id;
            this.phoneIndex = -1;
            this.currentPhoneIndexClicked = -1;
            this.data = {};
        },
        
        toCamelCase(str) {
            return str
                .trim()
                .toLowerCase()
                .split(' ')
                .map((word, index) => {
                    if(index === 0) {
                        return word;
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join('');
        },
        handleLogoutSubmit() {
            this.onLogout();
        },
        printPage() {
            let userInputObjects = Object.entries(this.userInputObjectData[0].objects);
            let items = [];
            for(let i = 0; i < userInputObjects.length; i++) {
                items.push(userInputObjects[i][1]);
            }

            let printContainer = document.createElement('div');
            document.body.appendChild(printContainer);

            let outerContainer = document.createElement('div');
            outerContainer.id = 'outer-container';
            outerContainer.style.height = '670px';
            outerContainer.style.width = '181.66px';
            outerContainer.style.position = 'absolute';
            printContainer.appendChild(outerContainer);
            
            let container = document.createElement('div');
            container.innerHTML = `<ul id="list"></ul>`;
            
            outerContainer.appendChild(container);
            
            let list = container.querySelector('#list');
            
            let myStyles = '';
            
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item.userComment;
                li.id = `input-box-${index}`;
                list.appendChild(li);
                
                let styles = {
                    display: 'flex',
                    justifyContent: this.textHorizontalAlign(item.textHorizontalAlign),
                    alignItems: this.textVerticalAlign(item.textVerticalAlign),
                    height: this.twipsToPixels(item.position[3] - item.position[1]) + 'px',
                    width: this.twipsToPixels(item.position[2] - item.position[0]) + 'px',
                    position: 'absolute',
                    left: this.twipsToPixels(item.position[0]) + 'px',
                    top: this.twipsToPixels(item.position[1]) + 'px',
                    color: item.textColor,
                    fontSize: item.fontSize,
                    fontStyle: item.fontStyle,
                    isBold: item.isBold,
                    isItalics: item.isItalics,
                    isUnderline: item.isUnderline,
                };
                
                myStyles += `
                    #input-box-${index} {
                        display: flex;
                        justify-content: ${styles.justifyContent};
                        align-items: ${styles.alignItems};
                        height: ${styles.height};
                        width: ${styles.width};
                        position: absolute;
                        left: ${styles.left};
                        top: ${styles.top};
                        color: ${styles.color};
                        font-size: ${styles.fontSize + 'px'};
                        font-style: ${styles.isItalics ? 'italic' : ''};
                        font-weight: ${styles.isBold ? 'bold' : ''};
                        text-decoration: ${styles.isUnderline ? 'underline' : ''};
                        font-family: ${styles.fontStyle};
                    }
                `;

            });
            
            printJS({
                printable: printContainer.innerHTML,
                type: 'raw-html',
                style: myStyles,
            });

            document.body.removeChild(printContainer);
        },
        textVerticalAlign(verticalAlignment) {
            return verticalAlignment === 'top' ? 'flex-start'
                 : verticalAlignment === 'center' ? 'center'
                 : verticalAlignment === 'bottom' ? 'flex-end'
                 : 'center';
        },
        textHorizontalAlign(horizontalAlignment) {
            return horizontalAlignment === 'left' ? 'flex-start'
                 : horizontalAlignment === 'center' ? 'center'
                 : horizontalAlignment === 'right' ? 'flex-end'
                 : 'center';
        },
        twipsToPixels(num) {
            let numTwips = num / 1440; // 1440 twips per inch
            let twipsToPixels = numTwips * 96; // 96 pixels per inch
            return twipsToPixels;
        },
        fetchPhoneType(phone) {
            // Instead of tempSelectedValue, I need the innerHTML of the option
            let innerHTMLText = this.getOptionText(this.tempSelectedValue);

            // Local Dev
            return fetch(`/api/files/${innerHTMLText}/${phone}`)

            // Deploy
            // return fetch(`https://desi-vue-app-server.onrender.com/api/files/${innerHTMLText}/${phone}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.data = data;
                })
                .catch(error => {
                    console.log('Error: ', error);
                });
        },
        fetchFolders() {
            // Local Dev
            fetch('/api/files')
            
            // Deploy
            // fetch('https://desi-vue-app-server.onrender.com/api/files')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.folders = data;
                })
                .catch(err => {
                    console.error('ERROR: ', err);
                });
        },
        fetchModels(subdirectory) {
            // Local Dev
            fetch(`/api/files?subdirectory=${subdirectory}`)
            
            // Deploy
            // fetch(`https://desi-vue-app-server.onrender.com/api/files?subdirectory=${subdirectory}`)
                .then(response =>{
                    return response.json();
                })
                .then(data => {
                    this.models = data;
                })
                .catch(err => {
                    console.error('ERROR ERROR: ', err);
                });
        },
        takeJSONExtOff(fileName) {
            return fileName.split('.')[0];
        },
        turnInnerHTMLToFileName(innerHTML) {
            let fileName = innerHTML.replace(/ /g, '_');
            return fileName;
        },
        uncheckTemplate() {
            this.templateCheckBox = false;
        },
        addButton() {
            this.buttonClicked = !this.buttonClicked;
        },
        templateButton() {
            this.templateCheckBox = !this.templateCheckBox;
        },
        
        // ======================= Add/Delete Phone =======================
        addPhone() {
            this.extension = this.tempExtension;
            this.selectedValue = this.tempSelectedValue;
            this.model = this.tempModel;
            this.name = this.tempName;
            this.currentTemplateSelected = this.tempCurrentTemplateSelected;

            if(this.projectList.length === 0) {
                this.projectList.push(this.currentPhoneList);
            }
            
            if(this.selectedValue) {
                this.fetchPhoneType(this.tempModel);
                this.buttonClicked = false;
            }
            
            this.innerModelText = this.getOptionText(this.model);
            this.innerProdFamText = this.getOptionText(this.selectedValue);

            /*
            The currentPhoneList needs to be pulled from the database
            We have the selected phone list id, and then pull the which ever phones have that id as their "phone_list_id"
            */
        },
        clickCancel() {
            this.buttonClicked = false;
        },
        async deletePhone(event, index) {
            event.stopPropagation();
            if(confirm('Are you sure you want to delete this phone?')) {

                // Finds the parent div of the trash can icon
                // let parentDiv = event.target.closest('.phone-list');
                
                // Finds the index of the phone in the phoneList that was clicked on
                // this.phoneIndex = this.currentPhoneList.findIndex(phone => phone.ext === parentDiv.querySelector('.phone-listing-ext').innerHTML);
                this.phoneIndex = index;

                // Removes the phone from the phoneList
                this.currentPhoneList.splice(this.phoneIndex, 1);
                
                // Removes phone from pocketbase
                await this.pb.collection('phones').delete(this.selectedPhoneId)
                    .then(() => {
                        console.log('Phone deleted successfully');
                    })
                    .catch(err => {
                        console.error('Error deleting phone: ', err);
                    });

                this.phoneIndex = -1;
                this.currentPhoneIndexClicked = -1;
                this.data = {};
            }
        },
        async userInputObjectUpdate(data) {
            
            this.userInputObjectData = data;
            
            if(this.tempCurrentTemplateSelected) {
                console.log('*************************');
                let templatePhone = this.currentPhoneList.find(phone => phone.ext === this.currentTemplateSelected).userData;
                let deepCopyTemplatePhone = JSON.parse(JSON.stringify(templatePhone));
                
                this.currentPhoneList.push({
                    "ext": this.extension,
                    "modelDisplayName": this.innerModelText + ' (' + this.innerProdFamText + ')',
                    "productName": this.innerProdFamText,
                    "modelName": this.innerModelText,
                    "value": this.selectedValue,
                    "name": this.name,
                    "userData": deepCopyTemplatePhone,
                });
                this.phoneIndex = this.currentPhoneList.length - 1;
                this.currentPhoneIndexClicked = this.phoneIndex;
            }

            // Check to see if the phone exists
            let phoneExists = this.currentPhoneList.some(phone => phone.ext === this.extension);

            if(!phoneExists) {
                this.currentPhoneList.push({
                    "ext": this.extension,
                    "modelDisplayName": this.innerModelText + ' (' + this.innerProdFamText + ')',
                    "productName": this.innerProdFamText,
                    "modelName": this.innerModelText,
                    "value": this.selectedValue,
                    "name": this.name,
                    "userData": this.userInputObjectData,
                });
                
                this.phoneIndex = this.currentPhoneList.length - 1;
                this.currentPhoneIndexClicked = this.phoneIndex;

                this.currentPhone = this.currentPhoneList[this.currentPhoneList.length - 1];
                this.phone = await this.pb.collection('phones').create({
                    phone_list_id: this.selectedPhoneListId,
                    user_input_object: this.currentPhone,
                    extension: this.currentPhone.ext,
                });

            }

            this.tempExtension = '';
            this.tempName = '';
            this.templateCheckBox = false;
            this.tempCurrentTemplateSelected = '';
            
            this.$nextTick(() => {
                this.$refs.phoneListingDiv[this.phoneIndex].click();
            });

        },
        currentBoxUpdate(currentBox) {
            this.currentBox = currentBox;

            // This takes the current boxes information of the userInputObjectData, and updates the current box's information in the phoneList
            this.currentPhoneList[this.phoneIndex].userData[0].objects[this.currentBox[0]] = this.userInputObjectData[0].objects[this.currentBox[0]];
        },
        getModelNumber(file) {
            this.modelNum = file.split('.')[0];
        },
        getOptionText(value) {
            const option = this.$el.querySelector(`option[value="${value}"]`);
            return option ? option.innerHTML : value;
        },
        async phoneClickedFunc(event, index) {
            if(this.currentPhoneIndexClicked === index) {
                return; // prevents unnecessary reprocessing 
            }

            // let clickedDiv = event.target;
            
            // let parentDiv = clickedDiv.closest('.phone-listing');
            
            // /*This takes the ext in the object of whatever phone was clicked on,
            // and tries to match with the ext in the phoneList that was clicked on.
            // If true, it finds the index and sets it to this.phoneIndex
            // If false, returns -1*/
            // this.phoneIndex = this.currentPhoneList.findIndex(phone => phone.ext === parentDiv.querySelector('div:first-child').innerHTML);
            // this.currentPhoneIndexClicked = index;
            // this.extension = this.currentPhoneList[this.phoneIndex].ext;
            // // let fullPhoneDB = await this.pb.collection('phones').getFullList();
            
            // let currentPhonesInSelectedPhoneList = this.fullPhoneDB.filter(phone => phone.phone_list_id === this.selectedPhoneListId);
            // let selectedPhone = currentPhonesInSelectedPhoneList.find(phone => phone.extension === this.extension && phone.phone_list_id === this.selectedPhoneListId);
            // this.selectedPhoneId = selectedPhone.id;

            // // This changes the data to be updated with the phone that was clicked on
            // this.data = this.currentPhoneList[this.phoneIndex].userData[0];

            // ************************************************************************************

            const clickedDiv = event.target.closest('.phone-listing');
            const extText = clickedDiv?.querySelector('.phone-listing-ext')?.innerText;
            this.phoneIndex = this.currentPhoneList.findIndex(p => p.ext === extText);
            this.currentPhoneIndexClicked = index;
            this.extension = extText;

            const currentPhones = this.fullPhoneDB.filter(phone => phone.phone_list_id === this.selectedPhoneListId);
            const selectedPhone = currentPhones.find(phone => phone.extension === this.extension);
            console.log('Selected Phone: ', selectedPhone);
            this.selectedPhoneId = selectedPhone?.id ?? null;

            if(this.phoneIndex !== -1) {
                this.data = this.currentPhoneList[this.phoneIndex].userData[0];
            }
        },

        // ======================= PHONE LISTING POPUP =======================
        showEditPhoneListing,
        confirmEditPopup,
        cancelEditPopup,

        /** *********** SIDEBAR RESIZING *********** */
        startResize,
        resize,
        stopResize,

        /** *********** EXTENSION RESIZING *********** */
        startExtResize,
        resizeExt,
        stopExtResize,

        /** *********** MODEL RESIZING *********** */
        startModelResize,
        resizeModel,
        stopModelResize,


        onlyShowExtensionsForCurrentPhoneModel() {
            // loop through phoneList, and make a list of all current models and their corresponding extensions, and return a list of extensions
            this.modelList = [];
            const selectedModelOption = document.querySelector('.model-selection option:checked');
            const selectedModelInnerHTML = selectedModelOption ? selectedModelOption.innerHTML : '';
            
            for(let i = 0; i < this.phoneList.length; i++) {
                if(selectedModelInnerHTML === this.phoneList[i].modelName) {
                    this.modelList.push(this.phoneList[i]);
                }
            }
        },
        zoomFunc() {
            console.log('Zoomed in');
        },
    },
    computed: {
        currentPhoneList() {
            return this.phoneListsFromDB[this.selectedProject];
        },
    },
    mounted() {
        this.fetchFolders();
    }
}
</script>

<style scoped>
.desi-logo {
    cursor: pointer;
    height: 55px;
    padding-right: 10px;
}

.main-header {
    background-color: rgb(154 160 199);
    display: flex;
    justify-content: space-between;
}

#header {
    display: flex;
    padding: 0 20px;
}
.header-button {
    margin: auto;
    height: 100%;
    width: 80px;
}
.header-button:hover {
    background-color: rgba(27, 37, 95, 0.5);
    color: lightgray;
    transition: 0.2s;
    cursor: pointer;
}
.header-button:active {
    background-color: #1b255f;
}

.ok-cancel-btn {
    background-color: lightgray;
    cursor: pointer;
    width: 80px;
    height: 50px;
    border-radius: 5px;
}
.ok-cancel-btn:active {
    background-color: gray;
}
.ok-cancel-btn.disabled {
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
    padding: 20px;
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
.ext-model-header-side-bar {
    width: 100px;
    padding: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-shrink: 0;
}
.draggable-header {
    min-width: 3px;
    background-color: black;
    cursor: ew-resize;
}

.drag-lines {
    color: white;

}

#drag-handle {
    cursor: ew-resize;
    width: 10px;
    /* background-color: rgba(27, 37, 95, 1); */
    background-color: rgba(0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
}

#draggable-side-bar {
    display: flex;
    flex-direction: column;
    height: 96vh;
    width: 350px;
    min-width: 100px;
    max-width: 550px;
    background-color: #1b255f;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
}

.trash-button,
.edit-button {
    display: flex;
    align-items: center;
    /* width: calc(50% - 20px); */
    width: 100px;
    border-radius: 5px;
    padding: 7px 0;
    margin: 4px 10px;
    flex-shrink: 0;
    cursor: pointer;
}

.trash-button {
    background-color: rgb(128, 0, 0);
}
.trash-button:hover {
    background-color: lightcoral;
    border-radius: 5px;
    padding: 7px 0;
}
.trash-icon {
    pointer-events: none;
    margin: 0 auto;
    flex-shrink: 0;
}

.edit-button {
    background-color: green;
}
.edit-button:hover {
    background-color: lightgreen;
    border-radius: 5px;
    padding: 7px 0;
}
.edit-icon {
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
    flex-shrink: 0;
}
.phone-listing.active {
    /* border: 2px solid rgba(27, 37, 95, 1); */
    border: 2px solid rgb(134, 152, 255);
    border-radius: 5px;
}

.phone-listing-ext,
.phone-listing-model,
.phone-listing-name {
    padding: 5px;
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-shrink: 0;
}

.true-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

#template-checkbox {
    margin-top: 20px;
}

.edit-button-popup {
    position: absolute;
    top: 100px;
    left: 375px;
    width: 350px;
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 100;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}

.edit-popup {
    display: flex;
    justify-content: center;
}

.edit-popup-ok,
.edit-popup-cancel {
    cursor: pointer;
    background-color: lightgray;
    padding: 5px;
    margin: 5px;
    text-align: center;
    border: 2px solid lightgray;
    border-radius: 5px;
    
}

.edit-popup-ok:hover,
.edit-popup-cancel:hover {
    background-color: rgb(180, 180, 180);
    border: 2px solid black;
}

/* Remove arrows in Chrome, Safari, and Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Remove arrows in Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}
</style>