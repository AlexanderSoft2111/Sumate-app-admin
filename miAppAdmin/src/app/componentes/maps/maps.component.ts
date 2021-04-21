import { ModalController, AlertController } from '@ionic/angular';
import { MapService } from './../../servicios/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

  lat: number;
  lng: number;
  direccion: string;

  constructor(private map: MapService,
    public modalController: ModalController,
    public alertController: AlertController) { }

  ngOnInit() {

    this.getCurrentPosition();
  }

  getCurrentPosition(){
    this.map.getCurrentPosition().then(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.map.initMap(lat, lng, 'map');
        this.lat = lat;
        this.lng = lng;
     }); 
}

salir(){
  this.modalController.dismiss();
}

aceptar(){
  
  if(this.lat !== undefined || this.lng !== undefined){
    this.presentAlertPrompt();
    
  } else{
    console.log("No se a guardado ninguna dirección");
  }
}

async presentAlertPrompt() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Ingresa el nombre de la dirección!',
    inputs: [
      {
        name: 'txtdireccion',
        type: 'text',
        placeholder: 'Nombre dirección'
      }
    ],
      
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          console.log('Confirm Ok');
          this.direccion = data.txtdireccion
          this.modalController.dismiss({
            latitud: this.lat,
            longitud: this.lng,
            direccion: this.direccion
          });
        }
      }
    ]
  });

  await alert.present();
}

}
