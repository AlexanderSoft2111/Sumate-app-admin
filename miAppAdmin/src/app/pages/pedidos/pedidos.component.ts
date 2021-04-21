import { Subscription } from 'rxjs';
import { CarritoService } from './../../servicios/carrito.service';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/Models/interfaces';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  nuevoSubscribir: Subscription;
  entregadoSubscribir: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];
  starAt = null;
  private path = '/Pedidos';
  pedidoNuevo = true;
  loadNuevos = false;
  loadEntregados = false;
  opc= '';

  constructor(public firestoreService:FirestoreService,
               public carritoService:CarritoService) { }

  ngOnInit() {}

  
  ngOnDestroy(){
    if(this.nuevoSubscribir){
      this.nuevoSubscribir.unsubscribe();
    }
    
    if(this.entregadoSubscribir){
      this.entregadoSubscribir.unsubscribe();
    }
  }

   changeSegment(ev: any){
    this.opc = ev.detail.value;
     console.log("changeEvent");
    if(this.opc === 'Nuevos'){
      this.vaciarPedido(); 
      this.pedidoNuevo = true;
        if(!this.loadNuevos){
          this.getNuevos();
        }
    } else if(this.opc === 'Entregados'){
          this.vaciarPedidoEntregado();
              this.pedidoNuevo = false;
              if(!this.loadEntregados){
                this.getEntregados();
                
              }
            }
  }

  async getNuevos(){

      if(this.pedidos.length){
        this.starAt = this.pedidos[this.pedidos.length -1].fecha;
      }
      this.nuevoSubscribir = this.firestoreService.getCollectionQueryVendedor<Pedido>(this.path,'estado','==','enviado', this.starAt).subscribe(res => {
        if(res.length){
          console.log("usuarios",res);
          this.loadNuevos = true;
          res.forEach(pedido => {
            const existe = this.pedidos.find(pedidoExiste => {
              return pedidoExiste.id === pedido.id;
            });
            if(existe === undefined){
              this.pedidos.push(pedido);
            }
          });
          this.ordenarPedidos(this.pedidos);
         }
        });
          
  }

  

 async getEntregados(){

  if(this.pedidosEntregados.length){
    this.starAt = this.pedidosEntregados[this.pedidosEntregados.length -1].fecha;
  }
  this.entregadoSubscribir = this.firestoreService.getCollectionQueryVendedor<Pedido>(this.path,'estado','==','entregado', this.starAt).subscribe(res => {
    if(res.length){
      this.loadEntregados = true;
      res.forEach(pedido => {
        this.pedidosEntregados.push(pedido);
      });
      this.ordenarPedidos(this.pedidosEntregados);
     }
    });
   
  }

  cargarmas(){
    if(this.pedidoNuevo){
     this.getNuevos();
    } else {
      this.getEntregados();
    }
    
  }

  ordenarPedidos(pedidos: Pedido[]){

    pedidos.sort((a, b) => {
      if(a.fecha > b.fecha){
        return -1;
      } else if(a.fecha > b.fecha){
          return 1;
      }
      return 0;
    });
  
  }

  vaciarPedido(){
    if(this.pedidos.length){
  
      this.pedidos.splice(3, this.pedidos.length)
  
    }   
  } 

  vaciarPedidoEntregado(){
    if(this.pedidosEntregados.length){
  
      this.pedidosEntregados.splice(3, this.pedidosEntregados.length)
    }
  
  } 

}
