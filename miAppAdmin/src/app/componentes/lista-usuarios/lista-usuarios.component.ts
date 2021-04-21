import { RegistroUsuarioComponent } from './../registro-usuario/registro-usuario.component';
import { FirestoreService } from './../../servicios/firestore.service';
import { Usuario } from './../../Models/interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from  '@angular/material/sort' ;
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';



// const ELEMENT_DATA: Usuario[] = [];

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})



export class ListaUsuariosComponent implements OnInit {
  
  listaUsuarios: Usuario [] = [];
  displayedColumns: string[] = ['nombre', 'apellido', 'cedula' ,'email' ,'contrasena' ,'celular', 'rol','FechaCreacion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild (MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  private path = 'Usuarios';
  loading: any;
  constructor(public firestoreService: FirestoreService,
              public modalController: ModalController,
              public alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) {
    
   }

  ngOnInit() {

    this.getListUser();

  }

  getListUser(){
    this.firestoreService.getCollectionChanges<Usuario>(this.path).subscribe( res => { 
    this.dataSource.data = res;
  }); 
  
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openModal(){
        const modal = await this.modalController.create({
      component: RegistroUsuarioComponent,
    });
  
    await modal.present();
      
   }

   async eliminarUsuario(usuario:Usuario){
    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Alerta!',
      message: 'Desea <strong>eliminar</strong> este Usuario!!!',
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
            usuario.estado = 'inactivo';
            this.firestoreService.updateDoc(usuario, this.path, usuario.id).then(res =>{
              const mensaje = 'Se elímino con éxito a ' + usuario.nombre + ' ' + usuario.apellido;
              this.presentToast(mensaje); 
            }).catch(error => {
              const mensaje = 'No se elimar a ' + usuario.nombre + ' ' + usuario.apellido;
              this.presentToast(mensaje);
            });
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

 async editCliente(editUsuario: Usuario){
  const modal = await this.modalController.create({
    component: RegistroUsuarioComponent,
    componentProps: {
      userEdit: editUsuario,
    }
  });

  await modal.present();
  const {data}= await modal.onWillDismiss();
  console.log(data)
  
}

}
