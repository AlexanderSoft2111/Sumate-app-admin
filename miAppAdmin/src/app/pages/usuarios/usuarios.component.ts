import { LoadingController, ToastController } from '@ionic/angular';
import { FirestoreService } from './../../servicios/firestore.service';
import { Usuario } from './../../Models/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

  listaUsuarios: Usuario [] = [];
  eliminando: any;

  constructor(public firestoreService: FirestoreService,
              public toastController: ToastController,
              public loadingController: LoadingController) { }

  ngOnInit() {

    this.getListUser();

  }

  getListUser(){
    const enlace = 'Usuarios';
    this.firestoreService.getCollectionChanges<Usuario>(enlace).subscribe( res => { 
    this.listaUsuarios = res;
  }); 
}


}
