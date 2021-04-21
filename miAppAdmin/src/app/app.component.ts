import { SetDatosService } from './servicios/set-datos.service';
import { FirestoreService } from './servicios/firestore.service';
import { Subscription } from 'rxjs';
import { Usuario } from './Models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  uid = '';
  usuario: Usuario = {
    id: '',
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    rol: 'Administrador',
    contrasena: '',
    cedula: '',
    FechaCreacion: new Date,
    estado: 'activo',
  }
  suscribirDoc: Subscription;
  suscribirUser: Subscription;
  admin = false;
  menuActivo = 'true';
  tamano = '1500px'
  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              public menu:MenuController,
              public firestoreService:FirestoreService,
              public route:Router,
              public setDatosService:SetDatosService) {
                this.initializeApp();
              }

   initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     this.Permisos();
    });
  }      
  
 
  Permisos(){
    this.suscribirDoc = this.firestoreService.getUidState().subscribe( res => {
       if(res !== null){
         this.uid = res.uid;
         const path = 'Usuarios';
         this.suscribirUser = this.firestoreService.getDoc<Usuario>(path, this.uid).subscribe(user =>{
           if(user.rol !== undefined){
            if(user !== null && user.rol === 'Administrador' && user.estado === 'activo'){
              this.admin = true;
              this.menuActivo = 'false';
              this.tamano = 'md';
              this.usuario = user;
               this.suscribirUser.unsubscribe();
               this.suscribirDoc.unsubscribe();
            }
           }
          });
       }
       else if(res===null){
        this.admin = false;
        this.menuActivo = 'true';
        this.tamano = '1500px';
       } 
     });
     
   }

  Salir(){
    this.firestoreService.logout();
    this.admin = false;
    this.menuActivo = 'true';
    this.tamano = '1500px';
    this.cerrarMenu();
    this.route.navigate(['login']);
    console.log('menu activo',this.menuActivo);
  }

  cerrarMenu(){
    this.menu.close();
  }
           
}
