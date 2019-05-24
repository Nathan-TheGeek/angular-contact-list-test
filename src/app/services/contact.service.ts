import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactDataModel } from '../models/contact.data.model';
@Injectable()
export class ContactService {

  private allContacts: Array<ContactDataModel>;

  constructor(private http: HttpClient) {
    this.loadPersitance();
  }

  public async getAllContacts(): Promise<Array<ContactDataModel>> {
    return new Promise<Array<ContactDataModel>>(async(resolve, error) => {
      try {
        // protect against returning reference to interal data.
        let tempContacts = new Array<ContactDataModel>();
        for (let i = 0; i < this.allContacts.length; i++) {
          tempContacts.push(JSON.parse(JSON.stringify(this.allContacts[i])));
        }
        resolve(tempContacts);
      } catch (e) {
        error(e);
      }
    });
  }

  public async saveContact(contact: ContactDataModel): Promise<void> {
    return new Promise<void>(async(resolve, error) => {
      try{
        const index = this.findIndexOfContact(contact.Id);
        if (index >= 0) {
            this.allContacts[index] = JSON.parse(JSON.stringify(contact));
        } else {
          this.allContacts.push(JSON.parse(JSON.stringify(contact)));
        }
        this.savePersistance();
        resolve();
      } catch (e) {
        error(e);
      }
    });
  }
  
  public async deleteContact(contact: ContactDataModel): Promise<void> {
    return new Promise<void>(async(resolve, error) => {
      try {
        const index = this.findIndexOfContact(contact.Id);
        if (index >= 0) {
          this.allContacts.splice(index, 1);
        }
        this.savePersistance();
        resolve();
      } catch (e) {
        error(e);
      }
    });
  }

  public async getNextContactId(): Promise<number> {
    return new Promise<number>(async(resolve, error) => {
      try {
        let lastId = 0;
        for(let i = 0; i < this.allContacts.length; i++) {
          if (this.allContacts[i].Id > lastId) {
            lastId = this.allContacts[i].Id;
          }
        }
        resolve(lastId + 1);
      } catch (e) {
        error(e);
      }
    });
  }

  private findIndexOfContact(id: number) {
    for (let i = 0; i < this.allContacts.length; i++) {
      if (this.allContacts[i].Id === id) {
        return i;
      }
    }
    return -1;
  }

  private savePersistance() {
    window.localStorage.setItem('contactList', JSON.stringify(this.allContacts))
  }
  private loadPersitance() {
    this.allContacts = JSON.parse(window.localStorage.getItem('contactList'));
    if (this.allContacts === null) {
      this.allContacts = new Array<ContactDataModel>();
    }
  }
}