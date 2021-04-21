import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
declare let google;
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  marker: any;
  infowindow: any;
  positionSent: any;
  map: any;
  label = {
    titulo: 'Ubicacion',
    subtitulo: 'Mi ubicacion de envio'
  }

  constructor(public loadingController: LoadingController) { }

  async initMap(lat:number, lng: number, id:string) {

    const position= {
      lat,
      lng
    }
    let mapOptions = {
      center: { lat, lng },
      zoom: 15,
      disableDefaulUI: false,
      clickableIcons: false,
    };
    const loading = await this.loadingController.create({
      message: '...'
    });
    // loading.present();
    this.map = await new google.maps.Map(document.getElementById(id) as HTMLElement,mapOptions);
    
    // google.maps.event.addListenerOnce(map, 'idle', () => {
    //   loading.dismiss();
    //   });  
     this.marker = new google.maps.Marker({
      position: {lat: lat, lng: lng },
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });
    this.clickHandleEvent();
    this.addMarker(position);
    this.infowindow = new google.maps.InfoWindow();
    this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);
  }

  async getCurrentPosition() {
    return await Geolocation.getCurrentPosition();
    
  }

  setInfoWindow(marker: any, titulo: string, subtitulo: string){

       const contentString  =  '<div id="contentInsideMap">' +
                              '<div>' +
                              '</div>' +
                              '<p style="font-weight: bold; margin-bottom: 5px;">' + titulo + '</p>' +
                              '<div id="bodyContent">' +
                              '<p class"normal m-0">'
                              + subtitulo + '</p>' +
                              '</div>' +
                              '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);                      
  }

  clickHandleEvent(){

    this.map.addListener('click', (event: any) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        
      };
      console.log(position);
      this.addMarker(position);
    });
  }

  addMarker(position: any): void{
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    this.marker.setPosition(latLng);

    //con esta linea le decimos que cada vez que se mueva el marcador el mapa se centre y con la otra linea guardamos las nuevas coordenadas obtenidas
    this.map.panTo(position);
    this.positionSent = position;
  }

}
