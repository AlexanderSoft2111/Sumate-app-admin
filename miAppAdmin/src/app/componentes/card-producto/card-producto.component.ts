import { CarritoService } from './../../servicios/carrito.service';
import { AlertController } from '@ionic/angular';
import { SetDatosService } from './../../servicios/set-datos.service';
import { Cliente } from './../../Models/interfaces';
import { Producto } from 'src/app/Models/interfaces';
import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss'],
})
export class CardProductoComponent implements OnInit {

  @Input() producto: Producto;
  @Output() enviar: EventEmitter<number> = new EventEmitter<number>();
  cantidad = 0;
  subtotal = 0;
  cliente: Cliente;
  id: '';
  items: 0;

  constructor(public carritoService: CarritoService,
              public setDatosService: SetDatosService,
              public router: Router,
              public alertController: AlertController) { }

  ngOnInit() {}

  onSwiper(swiper) {
    console.log(swiper)
  }
  onSlideChange() {
    console.log('slide change')
  }


  addPedido(){
    this.carritoService.addProducto(this.producto, this.cantidad, this.subtotal);
    const pedidolocal = JSON.parse(localStorage.getItem('pedido'));
    if(pedidolocal !== null){
      this.items = pedidolocal.productos.length;
      this.enviar.emit(this.items);
    }
    

  }

  subirCantidad(){
    if(this.cantidad < this.producto.cantidadDisponible){
      this.cantidad = this.cantidad + this.producto.cpVenta; 
      this.subtotal = this.cantidad * this.producto.precio;
    } else{
      this.presentAlertPrompt('La cantidad pedida sobrepasa a la disponible !!');
    }
    this.subtotal.toFixed(2);
  }

  restarCantidad(){

    if(this.cantidad > 0){
      this.cantidad = this.cantidad - this.producto.cpVenta;
    } else{
      this.presentAlertPrompt('La cantida es 0, no se puede restar la cantidad !!');
      console.log();
    }
    this.subtotal = this.cantidad * this.producto.precio;
    this.subtotal.toFixed(2);
    
  }

  goCar(){

    this.router.navigate(['carrito']);
  }

  async presentAlertPrompt(message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: message,
      buttons: [
       
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });
  
    await alert.present();
  }

}
