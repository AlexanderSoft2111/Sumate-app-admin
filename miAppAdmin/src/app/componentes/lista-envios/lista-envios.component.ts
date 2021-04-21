import { Subscription } from 'rxjs';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Transporte } from './../../Models/interfaces';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Pedido } from 'src/app/Models/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-lista-envios',
  templateUrl: './lista-envios.component.html',
  styleUrls: ['./lista-envios.component.scss'],
})

export class ListaEnviosComponent implements OnInit, OnDestroy {

  listapedidos: Pedido [] = [];
  displayedColumns: string[] = ['select','cliente.imagenSmall','cliente.nombre','precioTotal', 'estado'];
  dataSource = new MatTableDataSource<Pedido>();
  selection = new SelectionModel<Pedido>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
     return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row) ) ;

  }

  checkboxLabel(row?: Pedido): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${2}`;
  }

  private path = 'Pedidos';
  private pathTrans = 'Transporte';
  
  transporte: Transporte = {
    id: this.firestoreService.createID(),
    nombre: '',
    cedula: '',
    celular: '',
    placa: '',
    correo: '',
    pedidos: [],
  }
    selected = false;
  
    subscribir: Subscription;
    loading: any;
    registrando = false;

    fechaEntregaEstablecida = false;
    fechaCreacion = '';
    fecha = new Date();
    year = null;
    month = null;
    day = null;
    dayCalendary = null;

    fechaEntrega: any;
    yearEntrega: any;
    monthEntrega: any;
    dayEntrega: any;
    dayCalendaryEntrega: any;

  @ViewChild('htmlData') htmlData:ElementRef;
  
  constructor( public firestoreService:FirestoreService,
               public modalController:ModalController,
               public alertController:AlertController,
               public toastController:ToastController,
               public loadingController: LoadingController,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.getListPedidos();
    console.log('this.getListPedidos');
  }

  ngOnDestroy(){
    if(this.subscribir){
        this.subscribir.unsubscribe();
    }

  }

  getListPedidos(){
    this.subscribir = this.firestoreService.getCollectionQuery<Pedido>(this.path, 'estado', '==', 'Preparado').subscribe( res => { 
     this.dataSource.data = res;
      }); 
      console.log(this.dataSource.data);
  }


  cerrarModal(){
    this.modalController.dismiss();
  }

  fechaPedido(fecha:Date, dias:number){
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
  }

  
 async presentAlertPrompt(message: string) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: message,
    buttons: [
     
      {
        text: 'Ok',
        handler: () => {
          console.log('Confirm Ok');
        }
      }
    ]
  });

  await alert.present();
}

  enviar(){

    if(this.dataSource.data.length > 0){
      if(this.transporte.cedula === '' || this.transporte.celular === '' || this.transporte.correo === '' || 
      this.transporte.id === '' || this.transporte.nombre === ''){
        this.alerta('Todos los campos de transporte deben ser llenados');
        
      } else if (this.selection.selected.length === 0) {
        this.alerta('Debe seleccionar por lo menos 1 pedido'); 
        
      } else{
        this.presentLoading();
        this.firestoreService.createDocument(this.transporte, this.pathTrans, this.transporte.id).then(res => {
        this.loading.dismiss();
        this.presentToast("Se envío con éxito");
        this.cerrarModal(); 
        this.loading.dismiss();
        }).catch(error => {
          this.loading.dismiss()
          this.registrando = false;
          this.presentToast("Eror, no se pudo enviar"); 
        });
        
    
        this.selection.selected.forEach( selec => {
          selec.estado = 'Enviado';
        });
        this.transporte.pedidos = this.selection.selected;    
        this.actualizarPedido(this.dataSource.data);
        this.vaciarTransporte();
      }
      
    } else{
      this.alerta('No hay pedidos para el envío');
    }

  
    
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'subtitulo',
      message: 'Guardando',
    });
    await this.loading.present();
  }

  vaciarTransporte(){
    this.transporte = {
      id: '',
      nombre: '',
      cedula: '',
      celular: '',
      placa: '',
      correo: '',
      pedidos: [],
    }
  }

  actualizarPedido(pedidos: Pedido[]){
    
    console.log(pedidos);
    pedidos.forEach(pedido => {
      this.firestoreService.updateDoc(pedido, this.path, pedido.id).then(res =>{
      }).catch(error => {
        const mensaje = 'No se pudo confirmar el pedido de: ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
       // this.presentToast(mensaje);
      });
      const path = 'Clientes/' + pedido.cliente.id + '/Pedidos/';
      this.firestoreService.updateDoc(pedido, path, pedido.id).then(res =>{
      }).catch(error => {
        const mensaje = 'No se pudo confirmar el pedido de: ' + pedido.cliente.nombre + ' ' + pedido.cliente.apellido;
       // this.presentToast(mensaje);
      });

    });


  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-success', 
    });
    toast.present();
 
  }

  async alerta(message){
    
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alerta',
        message,
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
      await alert.present();
   
}


}
