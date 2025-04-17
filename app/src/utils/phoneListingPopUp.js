export function showEditPhoneListing() {
    this.phoneListingClicked = true;
    // this.extPopup = this.phoneList[this.phoneIndex].ext;
    // this.namePopup = this.phoneList[this.phoneIndex].name;
    // let currentUserData = this.phoneList[this.phoneIndex].userData[0];
    this.extPopup = this.currentPhoneList[this.phoneIndex].ext;
    this.namePopup = this.currentPhoneList[this.phoneIndex].name;
    let currentUserData = this.currentPhoneList[this.phoneIndex].userData[0];
    this.prodFamEditPopup = currentUserData.group;
    this.modelEditPopup = currentUserData.description;
    this.typeCodeEditPopup = currentUserData.typeCode;
}

export function confirmEditPopup() {
    this.phoneListingClicked = false;
    // this.phoneList[this.phoneIndex].ext = this.extPopup;
    // this.phoneList[this.phoneIndex].name = this.namePopup;
    this.currentPhoneList[this.phoneIndex].ext = this.extPopup;
    this.currentPhoneList[this.phoneIndex].name = this.namePopup;
}

export function cancelEditPopup() {
    this.phoneListingClicked = false;
}