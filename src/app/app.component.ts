import { Component, OnInit } from '@angular/core';
import { ContactService } from './services/contact.service';
import { ContactDataModel } from './models/contact.data.model';
import { FieldValidation, Validation } from './models/formValidation';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit {
  private contactList: Array<ContactDataModel>;
  _contactForEdit: ContactDataModel;
  formValidation: {[key:string]:FieldValidation} = {};

  constructor(private contRepo: ContactService) {}

  async ngOnInit() {
    this.loadContacts();
  }

  async _editContact(contact: ContactDataModel) {
    this._contactForEdit = JSON.parse(JSON.stringify(contact));
    setTimeout(() => { Validation.validateAllFields(this.formValidation); }, 10);
  }
  async _deleteContact(contact: ContactDataModel) {
    const del = window.confirm('Are you sure you want to delete contact ' + contact.Name + '? This cannot be undone.');
    if (del) {
      this.contRepo.deleteContact(contact);
      this.loadContacts();
    }
  }
  async _addNewContact() {
    const nextId = await this.contRepo.getNextContactId();
    this._contactForEdit = {Id: nextId, Name: '', Phone: '', Email: ''}
  }

  async _saveEditContact() {
    try {
      if (Validation.verifyValidForm(this.formValidation)) {
        await this.contRepo.saveContact(this._contactForEdit);
        this.loadContacts();
        this._contactForEdit = null;
      }
    } catch (e) {
      alert(e);
    }
  }
  async _cancelEditContact() {
    this._contactForEdit = null;
  }

  private async loadContacts() {
    this.contactList = await this.contRepo.getAllContacts();
  }

}
