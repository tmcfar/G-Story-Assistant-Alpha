import { Injectable, ViewChild } from '@angular/core';
import firebase from 'firebase/app';
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList
} from 'angularfire2/database';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  public currentUser: firebase.User;
  public userProfile: firebase.database.Reference;
  private af: AngularFireDatabase;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
//        this.userProfile = this.userProfile = this.af.object('/userProfile/${user.uid}');
//        this.activeCharacter = this.userProfile.child('activeCharacterId');
      }
    });
  }


  updateActiveCharacterId(activeCharacterId: string): Promise<any> {
    return this.userProfile.update(activeCharacterId);
  }



// No edits below

  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );

    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log('Password Changed');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
}
