import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
import { AlertController, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import * as firebase from 'firebase';

@Injectable()
export class UploadimgProvider {

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public file: File,
    private loadingCtrl: LoadingController,
    public camera: Camera,
    public actionSheet: ActionSheetController,
    public translate: TranslateService,
  ) {
    console.log('Hello UploadimgProvider Provider');
  }
  /** CAMERA */
  image_state: any = {
    imageChosen: 0,
    imagePath: '',
    imageNewPath: '',

  };
  chooseImage(authPhone: string,): Observable<string> {
    return Observable.create(observer => {
      this.translate.get(['CHOOSE_PHOTO_SRC', 'GALLERY', 'CAMERA', 'CANCEL']).subscribe((res) => {
        let actionSheet = this.actionSheet.create({
          title: res['CHOOSE_PHOTO_SRC'],
          buttons: [{
              text: res.GALLERY,
              icon: 'albums',
              handler: () => {
                this.actionHandler(1, authPhone).subscribe(imgurl => {
                  observer.next(imgurl);
                  observer.complete();
                });
              }
            },
            {
              text: res.CAMERA,
              icon: 'camera',
              handler: () => {
                this.actionHandler(2, authPhone).subscribe(imgurl => {
                  observer.next(imgurl);
                  observer.complete();
                });
              }
            },
            {
              text: res.CANCEL,
              role: 'cancel',
              handler: () => {
                observer.complete();
              }
            }
          ]
        })
        actionSheet.present();
      }, err => {
        observer.error(err);
        observer.complete();
      });
    });
  }
  actionHandler(selection: any, authPhone): Observable<string> {
    let options: any;
    return Observable.create(observer => {
      if (selection == 1) {
        options = {
          quality: 75,
          destinationType: this.camera.DestinationType.NATIVE_URI,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          allowEdit: true,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 1200,
          targetHeight: 700,
          saveToPhotoAlbum: false
        };
      } else {
        options = {
          quality: 75,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: this.camera.EncodingType.JPEG,
          //targetWidth: 1200,
          //targetHeight: 700,
          correctOrientation: true,
          saveToPhotoAlbum: false
        };
      }
      this.camera.getPicture(options).then((imgUrl) => {
        this.translate.get(['PLS_WAITING', 'SUCCESSED']).subscribe((res) => {
          let loader = this.loadingCtrl.create({
            content: res.PLS_WAITING
          });
          loader.present();
          if (imgUrl) {
              Object.assign(this.image_state, {
                imagePath: imgUrl,
                imageChosen: 1,
                // imageNewPath: imgUrl,
              });
              this.uploadPhoto(this.image_state.imagePath, authPhone).subscribe(path => {
                /* this.toastCtrl.create({
                  message: res.SUCCESSED,
                  duration: 3000,
                  position: 'top'
                }).present(); */
                loader.dismiss();
                observer.next(path);
                observer.complete();
              }, err => {
                loader.dismiss();
                observer.error(err);
                observer.complete();
              });

          } else {
            loader.dismiss();
            observer.error('camera.getPicture() UNKNOWN ERROR');
            observer.complete();
          }
        });
      },  (err) => {
        let alert = this.alertCtrl.create({
          title: 'ERROR',
          message: 'actionHandler' + JSON.stringify(err),
          buttons: ['OK']
        });
        alert.present();
        // observer.error(err);
        console.log(err);
        observer.error(false);
        observer.complete();
      });
    })

  }
  removePhoto() {}
  uploadPhoto(_imagePath: string, authPhone: string) {

    return Observable.create(observer => {
      let path: string = _imagePath.toString();
      let path2: string = _imagePath.toString().toLowerCase();
      let n = path2.lastIndexOf("/");
      let x = path2.lastIndexOf("g");
      let nameFile = path.substring(n + 1, x + 1);
      let directory = path.substring(0, n);
        try {
          console.log('============================');
          console.log(path);
          console.log(directory);
          console.log(nameFile);
          let fireStorageRef = firebase.storage().ref(`__USERS__/${authPhone}/__IMGS__/`);
          // alert("上傳 :" + nameFile + " *directory: " +directory.toString()+ " *allPath: " + _imagePath);
          this.file.readAsArrayBuffer(directory, nameFile).then((res) => {
            try {
              let blob = new Blob([res], {
                type: "image/jpeg"
              });
              let now = new Date().getTime().toString() + 'jpg';
              let uploadTask = fireStorageRef.child(now).put(blob);
              uploadTask.on('state_changed', (snapshot) => {
                this.image_state.imageNewPath = uploadTask.snapshot.downloadURL;
              }, (error) => {
                let alert = this.alertCtrl.create({
                  title: 'ERROR',
                  message: 'state_changed' + JSON.stringify(error),
                  buttons: ['OK']
                });
                alert.present();
                observer.error(error);
                observer.complete();
              }, () => { //success
                this.image_state.imageNewPath = uploadTask.snapshot.downloadURL;
                observer.next(uploadTask.snapshot.downloadURL);
                observer.complete();
              });
            } catch (z) {
              let alert = this.alertCtrl.create({
                title: 'ERROR-2',
                message: JSON.stringify(z),
                buttons: ['OK']
              });
              alert.present();
              observer.error(z);
              observer.complete();
            }
          }, err => {
            let alert = this.alertCtrl.create({
              title: 'ERROR-3',
              message: JSON.stringify(err),
              buttons: ['OK']
            });
            alert.present();
            observer.error(err);
            observer.complete();
          });
        } catch (z) {
          let alert = this.alertCtrl.create({
            title: 'ERROR-4',
            message: JSON.stringify(z),
            buttons: ['OK']
          });
          alert.present();
          observer.error(z);
          observer.complete();
        }

    });
  }
  /** */
}
