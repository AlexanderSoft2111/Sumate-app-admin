import { CarritoService } from './../../servicios/carrito.service';
import { ProductoPedido } from './../../Models/interfaces';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-carrito',
  templateUrl: './item-carrito.component.html',
  styleUrls: ['./item-carrito.component.scss'],
})
export class ItemCarritoComponent implements OnInit {
  
  @Input() productoPedido: ProductoPedido;
  @Input() botones = true;

  precio = 0;
  cantidad = 0;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {
  
  }

  addPedido(){
     
    this.cantidad = this.productoPedido.cantidad + this.productoPedido.producto.cpVenta;
    this.precio = this.cantidad * this.productoPedido.precio;   
    this.carritoService.subirCantidad(this.productoPedido.producto, this.cantidad, this.precio);
   }

 
   removePedido(){
     this.carritoService.removeProducto(this.productoPedido.producto);
   }

}
