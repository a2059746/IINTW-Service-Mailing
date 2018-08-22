import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UploadimgProvider } from '../../providers/uploadimg/uploadimg';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public Camera: Camera,
    public File: File,
    public upload: UploadimgProvider,
    public navCtrl: NavController
  ) {

  }

  test() {
    console.log('123')
    this.upload.chooseImage('0966666678').subscribe(url => {
      console.log('test');
      console.log(url)
      alert('success')
      alert(url);
    })
  }

}
