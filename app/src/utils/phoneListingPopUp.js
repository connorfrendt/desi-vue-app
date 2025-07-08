export function showEditPhoneListing() {
    this.phoneListingClicked = true;
    this.extPopup = this.currentPhoneList[this.phoneIndex].ext;
    this.namePopup = this.currentPhoneList[this.phoneIndex].name;
    let currentUserData = this.currentPhoneList[this.phoneIndex].userData[0];
    this.prodFamEditPopup = currentUserData.group;
    this.modelEditPopup = currentUserData.description;
    this.typeCodeEditPopup = currentUserData.typeCode;
}

export async function confirmEditPopup() {
    const records = await this.pb.collection('phones').getFullList();
    
    this.currentPhone = records.filter(
        ele => ele.phone_list_id === this.selectedPhoneListId && ele.extension === this.extension
    );

    let userInputObject = this.currentPhone[0].user_input_object;
    userInputObject.ext = this.extPopup;
    userInputObject.name = this.namePopup;

    this.phoneListingClicked = false;
    
    this.currentPhoneList[this.phoneIndex].ext = this.extPopup;
    this.currentPhoneList[this.phoneIndex].name = this.namePopup;
    
    await this.pb.collection('phones').update(this.selectedPhoneId, {
        extension: this.extPopup,
        user_input_object: {
            ...userInputObject
        }
    });
}

export function cancelEditPopup() {
    this.phoneListingClicked = false;
}