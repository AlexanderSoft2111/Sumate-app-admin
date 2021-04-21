import { DetalleClienteComponent } from './../detalle-cliente/detalle-cliente.component';
import { RegistroClienteComponent } from './../registro-cliente/registro-cliente.component';
import { Cliente } from './../../Models/interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/Models/interfaces';
import { FirestoreService } from './../../servicios/firestore.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from  '@angular/material/sort' ;
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.scss'],
})
export class ListaClientesComponent implements OnInit {

  listaClientes: Cliente [] = [];
  displayedColumns: string[] = ['imagenSmall','nombre', 'apellido','email' , 'telefono', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild (MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  private path = 'Clientes';
  loading: any;

  constructor(public firestoreService:FirestoreService,
              public modalController:ModalController,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {

    this.getListClients();

  }

  getListClients(){
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
      component: RegistroClienteComponent,
    });
  
    await modal.present();
      
   }

   async eliminarCliente(producto:Producto){
      
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Alerta!',
      message: 'Desea <strong>eliminar</strong> este cliente!!!',
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

 async editCliente(editClient: Cliente){
  const modal = await this.modalController.create({
    component: RegistroClienteComponent,
    componentProps: {
      userclient: editClient,
    }
  });

  await modal.present();
  const {data}= await modal.onWillDismiss();
  console.log(data)
  
}

enviarCodigo(getCliente: Cliente){
  const  countrycode = "593";
  const  numero = getCliente.telefono;
  const  url = "https://wa.me/"+countrycode+numero+"?text=Hola, tu código para iniciar sesión es: "+getCliente.codigo;
  return url;
  }

  async visualizar(cliente: Cliente){
   
    const modal = await this.modalController.create({
      component: DetalleClienteComponent,
      componentProps: {
        verCliente: cliente,
      }
    });
    await modal.present();
    const {data}= await modal.onWillDismiss();
    console.log(data)
  }


    

}
