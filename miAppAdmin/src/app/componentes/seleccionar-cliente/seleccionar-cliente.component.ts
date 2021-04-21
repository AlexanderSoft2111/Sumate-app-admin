import { Subscription } from 'rxjs';
import { Cliente } from './../../Models/interfaces';
import { ModalController } from '@ionic/angular';
import { SetDatosService } from './../../servicios/set-datos.service';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.scss'],
})
export class SeleccionarClienteComponent implements OnInit {
  
  clientes: Cliente[] = [];
  loading: any;
  starAt = null;
  nuevoSubscribir: Subscription;
  private path ='Clientes/';
  
  constructor(public firestoreService:FirestoreService,
              public setDatosService:SetDatosService,
              public route: Router,
              public modalController: ModalController) { }

  ngOnInit() {
    this.getClientes();
  }

  getClientes(){
    if(this.clientes.length){
      this.starAt = this.clientes[this.clientes.length -1].FechaCreacion;
      }
      this.nuevoSubscribir = this.firestoreService.getCollectionQueryVendedor<Cliente>(this.path, 'estado', '==', 'activo', this.starAt).subscribe(res => {
        console.log(res);
        if(res.length){
        res.forEach(cliente => {
          const existe = this.clientes.find(clienteExiste => {
            return clienteExiste.id === cliente.id;    
          });
            if(existe === undefined){
            this.clientes.push(cliente);
              }
          });
        }
      });
  }

  selectCliente(editCliente: Cliente){
    this.modalController.dismiss({
      cliente: editCliente,
    });
    this.vaciarClientes();
  }

  cargarMas(){
    if(this.clientes){
      this.getClientes();  
    }
    
  }

  vaciarClientes(){
    if(this.clientes.length){
      this.clientes.splice(5, this.clientes.length)
    }
  }

  salir(){
    this.modalController.dismiss();
  }

}
