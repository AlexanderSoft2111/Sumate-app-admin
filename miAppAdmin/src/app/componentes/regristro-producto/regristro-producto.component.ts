import { FireStorageService } from './../../servicios/fire-storage.service';
import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/Models/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regristro-producto',
  templateUrl: './regristro-producto.component.html',
  styleUrls: ['./regristro-producto.component.scss'],
})
export class RegristroProductoComponent implements OnInit {
  
  @Input() userProduct: Producto;
  producto: Producto = {
    id: this.firestoreService.createID(),
    codigo: '',
    descripcion: '',
    cantidadDisponible: null,
    FechaCreacion: new Date(),
    precio: null,
    imagen: '',
    imagenSmall: '',
    calificacion: null,
    detalle: '',
    cpVenta: null,
}
  newFile = '';
  newThumbnail = '';
  newImage = '';
  registrando = false;
  uid = '';
  editProduct = false;
  saveProduct = true;
  loading: any;
  private path = 'Productos';
  constructor(public firestoreService: FirestoreService,
              public toastController: ToastController,
              public route: Router,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public fireStorageService: FireStorageService) { }

ngOnInit() {
    if(this.userProduct !== undefined){
      this.producto = this.userProduct;
      this.editProduct = true;
      this.saveProduct = false
    } 
  }

async addProduct(){
        this.presentLoading();
        const name = this.producto.descripcion;
        const res = await this.fireStorageService.uploadImage(this.newFile, this.path, name);
        this.producto.imagen = res;
        this.producto.imagenSmall = this.newThumbnail;
        console.log(this.producto);
        this.firestoreService.createDocument(this.producto, this.path, this.producto.id).then(res => {
          this.loading.dismiss();
          this.presentToast("Se guardo con éxito");
        this.cerrarModal(); 
        }).catch(error => {
          this.loading.dismiss()
          this.registrando = false;
          this.presentToast("Eror, no se pudo guardar"); 
        });
}    
 
    

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-success', 
    });
    toast.present();
  }

  cerrarModal(){
    this.modalController.dismiss();
  }

  async updateProduct(){
    this.presentLoading();
    const name = this.producto.descripcion;
    const res = await this.fireStorageService.uploadImage(this.newFile, this.path, name);
    this.producto.imagen = res;
    this.producto.imagenSmall = this.newThumbnail;
    this.firestoreService.updateDoc(this.producto, this.path, this.producto.id).then(res => {
      this.loading.dismiss();
      this.presentToast("Se actualizo con éxito");
      this.editProduct = false;
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
    this.producto = {
      id: '',
      codigo: '',
      descripcion: '',
      cantidadDisponible: null,
      FechaCreacion: new Date(),
      precio: null,
      imagen: '',
      imagenSmall: '',
      calificacion: null,
      detalle: '',
      cpVenta: null,
      };
}

  // Codigo para visualizar una imagen en la web
  async newImagenUpload(event: any){
    if(event.target.files && event.target.files[0]){
         this.newFile = event.target.files[0];
         const reader = new FileReader();
         reader.onload = ((image) => {
           this.resizeImage(image.target.result, 300);
             this.producto.imagen = image.target.result as string;
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

}
