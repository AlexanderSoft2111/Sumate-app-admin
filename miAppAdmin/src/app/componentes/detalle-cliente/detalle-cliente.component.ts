
import { Cliente } from './../../Models/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss'],
})
export class DetalleClienteComponent implements OnInit {
  
  @Input() verCliente: Cliente;
  constructor(public modalController:ModalController) { }



  ngOnInit() {

  }

  cerrarModal(){
    this.modalController.dismiss();
  }

}
