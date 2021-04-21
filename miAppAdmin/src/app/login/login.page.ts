import { Usuario } from './../Models/interfaces';
import { Subscription } from 'rxjs';
import { FirestoreService } from './../servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: '',
  };
  
  uid = '';
  suscribirUser: Subscription;

  constructor(public firestoreService:FirestoreService,
              public route: Router,
              public toastController: ToastController) { }
              

  ngOnInit() {
  }



  async login(){
    if(this.user.email !== '' || this.user.password !== ''){
      await this.firestoreService.login(this.user.email, this.user.password).then(res => {
        if(res !== null){
          console.log('id', res.user.uid);
          this.uid = res.user.uid
          const path = 'Usuarios';
            this.suscribirUser = this.firestoreService.getDoc<Usuario>(path, this.uid).subscribe(user =>{
              if(user !== null && user.rol === 'Administrador' && user.estado === 'activo'){
                this.presentToast("Login exitoso");
                this.vaciarCredenciales();
                this.route.navigate(['inicio']);
                this.suscribirUser.unsubscribe();
              } else if(user.estado === 'inactivo'){
                      this.presentToast("Las credenciasles no son válidas");
                      this.suscribirUser.unsubscribe();
                      this.firestoreService.logout();
              }
              
              else if (user !== null && user.rol === 'Vendedor'){
                this.presentToast("Usted no es un usuario con permisos de administrador");
                this.suscribirUser.unsubscribe();
                this.firestoreService.logout();
              }
            });
          }
        }).catch(error => {
          this.presentToast("Error, usuario y contraseña invalidos");
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


 vaciarCredenciales(){
  this. user = {
    email: '',
    password: '',
  };
 }


}
