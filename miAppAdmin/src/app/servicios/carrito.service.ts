import { Producto } from 'src/app/Models/interfaces';
import { ToastController, AlertController } from '@ionic/angular';
import { FirestoreService } from './firestore.service';
import { Pedido, Cliente, ProductoPedido } from './../Models/interfaces';
import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;
  pedido$ = new Subject<Pedido>();
  private path= "carrito/";
  uid = 'aYc9NfGPQhRtFvG9oCAe7RzDCj22';
  cliente: Cliente;
  carritoSusbcribe: Subscription;

  constructor(public firestoreService:FirestoreService,
              public router: Router,
              public toastController: ToastController,
              public alertController: AlertController) { 

                this.initCarrito(); 
                this.firestoreService.getUidState().subscribe(res => {
                  if(res !== undefined){
                    this.loadCliente();
                  }
                });

  }
  loadCarrito(){
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.carritoSusbcribe = this.firestoreService.getDoc<Pedido>(path,this.uid).subscribe( res => {
      if(res){
        this.pedido = res;
        this.pedido$.next(this.pedido);
      }else{
        this.initCarrito();
      }
    });
  }

  initCarrito( ){
    this.pedido = {
      id: this.uid,
      cliente: this.cliente,
      productos: [],
      precioTotal: null,
      estado: 'Pendiente',
      fecha: new Date(),
      valorCobrado: 0,
      fechaEnvio: null,
    };
    this.pedido$.next(this.pedido);
  }

  getCarrito():Observable<Pedido>{
    setTimeout(() => {
      this.pedido$.next(this.pedido);  
    }, 100);

   return this.pedido$.asObservable();

  }

  loadCliente(){
    const path = "Clientes/"
    this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe(res => {
      this.cliente = res;
      this.loadCarrito();
    });
  }

  async addProducto(producto: Producto, cantidad: number, precio:number){
      
    if(cantidad === 0){
      this.presentAlertPrompt('Seleccionar la cantidad a comprar');
    } else {

      if(this.uid.length){
      const item = this.pedido.productos.find( productoPedido => {
        return (productoPedido.producto.id === producto.id);
      });
        if(item !== undefined){
                    this.presentAlertPrompt('El producto ya esta añadido al carrito');
                }else{
                  const add: ProductoPedido = {
                      cantidad,
                      precio,
                      producto,
                     };
                 this.pedido.productos.push(add);
                 localStorage.setItem('pedido', JSON.stringify(this.pedido));
                 this.presentToast('Se añadio el producto al carrito');
                 const pedidolocal = JSON.parse(localStorage.getItem('pedido'));
              }
           } else{
             this.router.navigate(['/login']);
             return;
           }
    }
  }

async subirCantidad(producto: Producto, cantidad: number, precio:number){
     if(this.uid.length){
      const item = this.pedido.productos.find( productoPedido => {
        return (productoPedido.producto.id === producto.id);
      });
          if(item !== undefined){
                item.cantidad = item.cantidad + producto.cpVenta;
            }else{
              const add: ProductoPedido = {
                  cantidad,
                  precio,
                  producto,
                 };
             this.pedido.productos.push(add);
          }
       } else{
         this.router.navigate(['/login']);
         return;
       }
      this.pedido$.next(this.pedido);
      localStorage.setItem('pedido', JSON.stringify(this.pedido));
      const pedidolocal = JSON.parse(localStorage.getItem('pedido'));
            //  console.log("en add pedido = ", this.pedido);
            //  const path = 'Clientes/' + this.uid + '/' + this.path;
            //  await this.basedeDatosService.createDocument(this.pedido, path, this.uid).then( () =>{
            //  });
  }
  

  removeProducto(producto: Producto){
    if(this.uid.length){
      let position = 0;
      const item = this.pedido.productos.find( (productoPedido, index) => {
        position = index;
        return (productoPedido.producto.id === producto.id);
      });
          if(item !== undefined){
              item.cantidad = item.cantidad - producto.cpVenta;
              if(item.cantidad === 0){
                this.pedido.productos.splice(position,1);
                console.log(this.pedido);
                this.pedido$.next(this.pedido);  
                localStorage.setItem('pedido', JSON.stringify(this.pedido));
                console.log("Se removio con exito");
                const pedidolocal = JSON.parse(localStorage.getItem('pedido'));
              }
              //this.clearCarrito();
              // console.log("en remove pedido = ", this.pedido);
              // const path = 'Clientes/' + this.uid + '/' + this.path;
              // this.basedeDatosService.createDocument(this.pedido, path, this.uid).then( () =>{
              // console.log("Se removio con exito");
              // });
            }
       } 
       
  }

  realizarPedido(){

  }

  clearCarrito(){
    this.initCarrito();
    localStorage.clear();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-success', 
      // enterAnimation: ((baseEl: any, opts?: any) => Animation) | undefined,
    });
    toast.present();

    // const toast = await this.toastController.create({
    //   message,
    //   position: 'middle',
    //   buttons: [
    //     {
    //       side: 'start',
    //       icon: 'star',
    //       text: 'Favorite',
    //       handler: () => {
    //         console.log('Favorite clicked');
    //       }
    //     }
    //   ]
    // });
    // toast.present();
  
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
