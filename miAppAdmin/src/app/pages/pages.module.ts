import { TutorialesComponent } from './tutoriales/tutoriales.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { TiendaComponent } from './tienda/tienda.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CatalagoComponent } from './catalago/catalago.component';
import { ProductosComponent } from './productos/productos.component';
import { ComponentesModule } from './../componentes/componentes.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './../app-routing.module';
import { IonicModule } from '@ionic/angular';
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [
    UsuariosComponent,
    InicioComponent,
    ProductosComponent,
    CatalagoComponent,
    ClientesComponent,
    TiendaComponent,
    CarritoComponent,
    PedidosComponent,
    TutorialesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    AppRoutingModule,
    FormsModule,
    ComponentesModule,
    SwiperModule
  ]
})
export class PagesModule { }
