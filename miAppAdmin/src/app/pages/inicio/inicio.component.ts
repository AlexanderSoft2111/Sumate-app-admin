import { FirestoreService } from './../../servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  
  titulohome = "Bienvenidos";

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(public firestoreService: FirestoreService,
              public route:Router,
              private navCtrl: NavController) { }

  ngOnInit() {}

  empezar(){
    this.navCtrl.navigateBack('/tienda')
  }


}
