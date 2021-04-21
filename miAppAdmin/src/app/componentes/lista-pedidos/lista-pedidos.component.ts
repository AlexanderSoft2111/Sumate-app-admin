import { Subscription } from 'rxjs';
import { ListaEnviosComponent } from './../lista-envios/lista-envios.component';
import { DetallePedidoComponent } from './../detalle-pedido/detalle-pedido.component';
import { Pedido } from 'src/app/Models/interfaces';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FirestoreService } from './../../servicios/firestore.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from  '@angular/material/sort' ;
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss'],
})
export class ListaPedidosComponent implements OnInit, OnDestroy {

  listapedidos: Pedido [] = [];
  displayedColumns: string[] = ['cliente.imagenSmall', 'cliente.nombre','cliente.telefono','cliente.direccion','precioTotal','fecha', 'estado', 'visualizar', 'acciones'];
  dataSource = new MatTableDataSource();
  valor = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild (MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  private path = 'Pedidos';
  loading: any;
  subscribir: Subscription;

  constructor(public firestoreService:FirestoreService,
              public modalController:ModalController,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {

    this.getListPedidos();

  }

  ngOnDestroy(){
    if(this.subscribir){
        this.subscribir.unsubscribe();
    }

  }

  getListPedidos(){
   this.subscribir = this.firestoreService.getCollectionChanges<Pedido>(this.path).subscribe( res => { 
    this.dataSource.data = res;
  }); 
  
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openModal(){
        const modal = await this.modalController.create({
      component: DetallePedidoComponent,
    });
  
    await modal.present();
      
   }

   async confirmarPedido(pedido: Pedido){
    
    if(pedido.estado === 'Alistamiento'){

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Mensaje de confirmación',
        message: 'Desea confirmar la preparación del pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido,
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
                pedido.estado = 'Preparado';
                this.firestoreService.updateDoc(pedido, this.path, pedido.id).then(res =>{
                const mensaje = 'Se confirmo con éxito el pedido de ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
                this.presentToast(mensaje); 
              }).catch(error => {
                const mensaje = 'No se pudo confirmar el pedido de ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
                this.presentToast(mensaje);
              });
            }
          }
        ]
      });
      await alert.present();
    } else {

      const alerta = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alerta!!!',
        message: 'Revisar, el estado del pedido debe estar en <strong>Alistamiento</strong>',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'normal',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, 
        ]
      });
      await alerta.present();
    } 
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
    duration: 2000,
    position: 'middle',
    cssClass: 'toast-success', 
  });
  toast.present();
}

 async verPedido(pedido: Pedido){
  const modal = await this.modalController.create({
    component: DetallePedidoComponent,
    componentProps: {
      verPedido: pedido,
    }
  });

  await modal.present();
  const {data}= await modal.onWillDismiss();
  console.log(data)
  
}

  async realizarEnvio(){

    const modal = await this.modalController.create({
    
      component: ListaEnviosComponent,
    
    });

    await modal.present();

  }

  
async cobrar(pedido: Pedido) {

  if(pedido.estado === 'Enviado'){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cobrar el pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido,
      inputs: [
        {
          name: 'txtvalor',
          type: 'number',
          placeholder: '$ Valor'
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
            pedido.valorCobrado = data.txtvalor;
            pedido.estado = 'Entregado';
            this.firestoreService.updateDoc(pedido, this.path, pedido.id).then(res =>{
              const mensaje = 'Se cobro el pedido con éxito de: ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
              this.presentToast(mensaje); 
            }).catch(error => {
              const mensaje = 'No se pudo cobrar el pedido con éxito de: ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
              this.presentToast(mensaje);
            });
            
           // actualizar el pedido en la colección cliente
            const path = 'Clientes/' + pedido.cliente.id + '/Pedidos/';
            this.firestoreService.updateDoc(pedido, path, pedido.id).then( () =>{});
          }
        }
      ]
    });
  
    await alert.present();
  } else if(pedido.estado === 'Entregado'){

    const alerta = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta!!!',
      message: 'El pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido+' ya fue cobrado',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, 
      ]
    });
    await alerta.present();
  } else {

    const alerta1 = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta!!!',
      message: 'El pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido+' todavía no se envia',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, 
      ]
    });
    await alerta1.present();
  }
}

async cancelar(pedido: Pedido){
  if(pedido.estado === 'Pendiente'){
    const alerta1 = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta!!!',
      message: 'Esta seguro de cancelar el pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'my-custom-class',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },{
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            const path2 = 'Clientes/' + pedido.cliente.id + '/Pedidos/';
            this.firestoreService.deleteDocument(path2, pedido.id).then( () =>{});

            this.firestoreService.deleteDocument(this.path, pedido.id).then(res =>{
              const mensaje = 'El pedido de '+pedido.cliente.nombre + ' ' + pedido.cliente.apellido+' fue cancelado con éxito: ';
              this.presentToast(mensaje); 
            }).catch(error => {
              const mensaje = 'El pedido de '+pedido.cliente.nombre + ' ' + pedido.cliente.apellido+' no se pudo cancelar con éxito: ';
               this.presentToast(mensaje);
            });
            
          }
        } 
      ]
    });
    await alerta1.present();
    
  } else{
    const alerta = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta!!!',
      message: 'El pedido de '+pedido.cliente.nombre+' '+pedido.cliente.apellido+' ya fue alistado, no se puede cancelar',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'my-custom-class',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, 
      ]
    });
    await alerta.present();
  }
}

}
