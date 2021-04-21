import { MapsComponent } from './../maps/maps.component';
import { Cliente } from './../../Models/interfaces';
import { FireStorageService } from './../../servicios/fire-storage.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.scss'],
})
export class RegistroClienteComponent implements OnInit {
  @Input() userclient: Cliente;
  cliente: Cliente = {
      id: '',
      codigo: '',
      cedula: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      latitud: null,
      longitud: null,
      telefono: '',
      FechaCreacion: new Date(),
      rol: 'Cliente',
      imagenBig: '',
      imagenSmall: '',
      tipoCliente: 'Mayorista',
      contrasena: '',
      emailRegistro: '',      
      estado: 'activo',  
};
  newFile = '';
  newThumbnail = '';
  newImage = '';
  registrando = false;
  uid = '';
  editClient = false;
  saveClient = true;
  loading: any;
  private path = 'Clientes';

  constructor(public firestoreService: FirestoreService,
              public toastController: ToastController,
              public route: Router,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public fireStorageService: FireStorageService) { }

ngOnInit() {
    if(this.userclient !== undefined){
      this.cliente = this.userclient;
      this.editClient = true;
      this.saveClient = false
    } 
    console.log(this.editClient);
    console.log(this.saveClient);
  }

  async addCliente(){
    if(this.cliente.nombre !== '' && this.cliente.apellido !== '' && this.cliente.email !== '' && this.cliente.direccion !== '' && this.cliente.telefono !== ''){
      this.registrando = true;
      this.cliente.emailRegistro = this.cliente.nombre.substring(0,1) + this.cliente.apellido.substring(0,1) + this.cliente.cedula +"@gmail.com";
      this.cliente.contrasena =  this.cliente.nombre.substring(0,1) + this.cliente.apellido.substring(0,1) + this.cliente.cedula;
      this.cliente.codigo = this.cliente.contrasena;
         this.firestoreService.createUser(this.cliente.emailRegistro, this.cliente.contrasena).then(async (res) => {
          this.presentLoading();
           console.log(res);
           const uid = await this.firestoreService.getUid();
           this.registrando = false;
           const path = 'Clientes';
           const name = this.cliente.nombre;
           const resp = await this.fireStorageService.uploadImage(this.newFile, path, name);
          this.cliente.imagenBig = resp;
          this.cliente.imagenSmall = this.newThumbnail;
          this.presentToast("Se guardo con éxito");
           this.cliente.id = uid;
           this.firestoreService.createDocument(this.cliente, path, this.cliente.id).then(() => {
            this.limpiarCampos();
            this.loading.dismiss();
            this.cerrarModal();
           });
         }).catch(error => {
          this.presentToast("Eror, no se pudo guardar"); 
           this.registrando = false;
         });
    } else{
      this.presentToast("Todos los campos deben estar llenados");
    }
       
   } 

   
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  cerrarModal(){
    this.modalController.dismiss();
  }

  async updateCliente(){
    this.presentLoading();
    const name = this.cliente.cedula;
    const res = await this.fireStorageService.uploadImage(this.newFile, this.path, name);
    this.cliente.imagenBig = res;
    this.cliente.imagenSmall = this.newThumbnail;
    this.firestoreService.updateDoc(this.cliente, this.path, this.cliente.id).then(res => {
      this.loading.dismiss();
      this.presentToast("Se actualizo con éxito");
      this.editClient = false;
      this.limpiarCampos();
      this.modalController.dismiss();
    }).catch(error => {
      this.presentToast("Eror, no se pudo guardar"); 
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'subtitulo',
      message: 'Guardando',
    });
    await this.loading.present();
  }

  limpiarCampos(){
    this.cliente = {
      id: '',
      codigo: '',
      cedula: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      latitud: null,
      longitud: null,
      telefono: '',
      FechaCreacion: new Date(),
      rol: 'Cliente',
      imagenBig: '',
      imagenSmall: '',
      tipoCliente: 'Mayorista',
      contrasena: '',
      emailRegistro: '',      
      estado: 'activo', 
      };
}

  // Codigo para visualizar una imagen en la web
  async newImagenUpload(event: any){
    if(event.target.files && event.target.files[0]){
         this.newFile = event.target.files[0];
         const reader = new FileReader();
         reader.onload = ((image) => {
           this.resizeImage(image.target.result, 300);
             this.cliente.imagenBig = image.target.result as string;
           });
         reader.readAsDataURL(event.target.files[0]);
     }
 }

 resizeImage(imgIn: any, MAX_WIDTH: number) {

   const img = document.createElement('img');
   img.src = imgIn;
 
   setTimeout(() => {
     const MAX_HEIGHT = MAX_WIDTH;
     let width = img.width;
     let height = img.height;
     if (width >= height) {
       if (width >= MAX_WIDTH) {
         height *= MAX_WIDTH / width;
         width = MAX_WIDTH;
       } else if (height >= MAX_HEIGHT) {
         width *= MAX_HEIGHT / height;
         height = MAX_HEIGHT;
       }
     } else {
       if (height >= MAX_HEIGHT) {
         width *= MAX_HEIGHT / height;
         height = MAX_HEIGHT;
       } else if (width >= MAX_WIDTH) {
         height *= MAX_WIDTH / width;
         width = MAX_WIDTH;
       }
     }
     const canvas = document.getElementById('canvas') as HTMLCanvasElement;
     const ctx = canvas.getContext('2d');
     canvas.width = width;
     canvas.height = height;
     ctx.drawImage(img, 0, 0, width, height);
     this.newThumbnail = canvas.toDataURL('image/png');
   }, 200);
 
 }  

 async addDirection(){
  
  //le asignamos unas coordenas a la ubicacion para decirle que si es nula asigne por defecto
  const ubicacion = this.cliente.direccion;
  const lat = this.cliente.latitud;
  const lng = this.cliente.longitud;

  let positionInput = {
    lat: -2.898116,
    lng: -78.99958149999,
    direccion: ''
  };

  if(ubicacion !== null){
      positionInput.direccion = ubicacion;
      positionInput.lat = lat;
      positionInput.lng = lng;
         
  }

 
}

 async openModal(){
  const modal = await this.modalController.create({
    component: MapsComponent,
  });

  await modal.present();
  const {data}= await modal.onWillDismiss();
  console.log(data)
    this.cliente.latitud = data.latitud;
    this.cliente.longitud = data.longitud;
    this.cliente.direccion = data.direccion;
    console.log("la direccion es: ",this.cliente.longitud);
 }
}
