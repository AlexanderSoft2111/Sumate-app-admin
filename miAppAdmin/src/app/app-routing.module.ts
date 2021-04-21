import { TutorialesComponent } from './pages/tutoriales/tutoriales.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { CatalagoComponent } from './pages/catalago/catalago.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CarritoComponent } from './pages/carrito/carrito.component';

const routes: Routes = [

  {path:'inicio', component: InicioComponent},

  {path:'usuarios', component: UsuariosComponent},

  {path: 'catalago', component: CatalagoComponent},

  {path: 'productos', component:ProductosComponent},

  {path: 'clientes', component:ClientesComponent},

  {path: 'tienda', component:TiendaComponent},

  {path: 'carrito', component:CarritoComponent},

  {path: 'pedidos', component:PedidosComponent},

  {path: 'tutoriales', component:TutorialesComponent},
 
  {path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},

  {path: '**', redirectTo: 'login', pathMatch:'full'},
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
