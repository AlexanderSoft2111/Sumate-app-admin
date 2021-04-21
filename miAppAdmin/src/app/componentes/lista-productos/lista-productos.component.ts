import { RegristroProductoComponent } from './../regristro-producto/regristro-producto.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/Models/interfaces';
import { FirestoreService } from './../../servicios/firestore.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from  '@angular/material/sort' ;
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {

  listaUsuarios: Producto [] = [];
  displayedColumns: string[] = ['imagenSmall', 'codigo', 'descripcion', 'detalle', 'precio' ,'cantidadDisponible' , 'cpVenta','calificacion','FechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild (MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  private path = 'Productos';
  loading: any;

  constructor(public firestoreService: FirestoreService,
              public modalController: ModalController,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

   ngOnInit() {

    this.getListUser();

  }

  getListUser(){
    this.firestoreService.getCollectionChanges<Producto>(this.path).subscribe( res => { 
    this.dataSource.data = res;
  }); 
  
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openModal(){
        const modal = await this.modalController.create({
      component: RegristroProductoComponent,
    });
  
    await modal.present();
      
   }

   async eliminarUsuario(producto:Producto){
      
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta!',
      message: 'Desea <strong>eliminar</strong> este producto!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDocument(this.path, producto.id);
            // codigo para actualizar el estado de activo a inactivo
            // usuario.estado = 'inactivo';
            // this.firestoreService.updateDoc(usuario, this.path, usuario.id).then(res =>{
            //   const mensaje = 'Se elímino con éxito a ' + usuario.nombre + ' ' + usuario.apellido;
            //   this.presentToast(mensaje); 
            // }).catch(error => {
            //   const mensaje = 'No se elimar a ' + usuario.nombre + ' ' + usuario.apellido;
            //   this.presentToast(mensaje);
            // });
          }
        }
      ]
    });
    await alert.present();
}

async presentLoading() {
  this.loading = await this.loadingController.create({
    cssClass: 'subtitulo',
    message: 'Guardando',
    duration: 3000,
  });
  await this.loading.present();
}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 3000,
  });
  toast.present();
}

 async editCliente(editProducto: Producto){
  const modal = await this.modalController.create({
    component: RegristroProductoComponent,
    componentProps: {
      userProduct: editProducto,
    }
  });

  await modal.present();
  const {data}= await modal.onWillDismiss();
  console.log(data)
  
}

}
