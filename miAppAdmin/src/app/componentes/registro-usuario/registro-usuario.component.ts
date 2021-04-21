import { ToastController, ModalController, LoadingController } from '@ionic/angular';
import { FirestoreService } from './../../servicios/firestore.service';
import { Usuario } from './../../Models/interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss'],
})
export class RegistroUsuarioComponent implements OnInit {

    @Input() userEdit: Usuario;
    user: Usuario = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    FechaCreacion: new Date,
    cedula: '',
    contrasena: '',
    celular: '',
    rol: 'Administrador',
    estado: 'activo'
  }
    confcontrasena= '';
    registrando = false;
    uid = '';
    roles = '';
    editUser = false;
    saveUser = true;
    loading: any;
    private path = 'Usuarios';

  constructor(public firestoreService: FirestoreService,
              public toastController: ToastController,
              public route: Router,
              public modalController:ModalController,
              public loadingController: LoadingController) { }

  ngOnInit() {
    if(this.userEdit !== undefined){
      this.user = this.userEdit;
      this.confcontrasena = this.userEdit.contrasena;
      this.editUser = true;
      this.saveUser = false
    } 
  }

  addUser(){
   this.presentLoading();
    if(this.user.contrasena === this.confcontrasena){
      this.firestoreService.createUser(this.user.email, this.user.contrasena).then(async (res) => {
        console.log(res);
        const uid = await this.firestoreService.getUid();
        this.registrando = false;
        this.user.id = uid;
        this.firestoreService.createDocument(this.user, this.path, this.user.id);
        this.loading.dismiss();
        this.presentToast("Se guardo con éxito");
        this.cerrarModal();
          }).catch(error => {
        console.log("el error es = ",error);
        this.registrando = false;
      });
    } else{
      
      this.presentToast("Las contraseñas no coinciden, vuelva a registrarlas");
      this.registrando = false;
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

  async updateUser(){
    this.presentLoading();
    const name = this.user.nombre;
    this.firestoreService.updateDoc(this.user, this.path,this.user.id).then(res => {
      this.loading.dismiss();
      this.presentToast("Se actualizo con éxito");
      this.editUser = false;
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
    this.user = {
      id: '',
    nombre: '',
    apellido: '',
    email: '',
    FechaCreacion: new Date,
    cedula: '',
    contrasena: '',
    celular: '',
    rol: 'Administrador',
    estado: 'activo'
  };
  this.confcontrasena = '';
}

}
