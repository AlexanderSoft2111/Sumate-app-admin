import { Cliente, identificacionCliente } from './../Models/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetDatosService {
  cliente: Cliente;
  identCliente: identificacionCliente;
  item: number;
  constructor() {
    this.limpiarCliente();
    this.limpiarIdentCliente();
   }

  setItem(item: number){
    this.item = item;
    console.log('este es el item',item);
  }
 
  getItem(){
    if(this.item !==null){
      console.log('getitem',this.item);
      return this.item
    }
  }


  setCliente(editCliente: Cliente){
    this.cliente = editCliente;
    console.log("este es el cliente",this.cliente);
  }

  setIdentCliente(editCliente: identificacionCliente){
    this.identCliente = editCliente;
    console.log('setcliente', this.identCliente)
    this.getidentCliente();
  }

  getCliente(){
    console.log("getclientes", this.cliente);
    return this.cliente;
  }

  getidentCliente(){
    console.log("getidenclientes", this.identCliente);
    return this.identCliente;
  }

  limpiarCliente(){
    this.cliente = {
      id: '',
      codigo: '',
      cedula: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      latitud: null,
      longitud: null,
      telefono: '',
      FechaCreacion: new Date(),
      rol: 'Cliente',
      imagenBig: '',
      imagenSmall: '',
      emailRegistro: '',
      contrasena: '',
      tipoCliente: 'Mayorista',
      estado: 'activo',
    };
  }

  limpiarIdentCliente(){
    this.identCliente = {
      id: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      latitud: null,
      longitud: null,
      telefono: '',
      FechaCreacion: new Date(),
      tipoVisita: 'Visitado',
      estado: 'activo',
    };
  }
}
