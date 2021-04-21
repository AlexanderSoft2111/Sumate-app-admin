import SwiperCore, { EffectFade, Swiper, EffectCoverflow, Navigation, Pagination, Scrollbar, A11y } from "swiper/core";
import { FirestoreService } from './../../servicios/firestore.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/Models/interfaces';
import { Component, OnInit } from '@angular/core';


SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss'],
})

export class TiendaComponent implements OnInit {
  
  private path ='Productos/';
  productos: Producto [] = [];
  subscribir: Subscription;
  items: number;
  loading = true;

  swiper = new Swiper('.swiper-container', {
    cssMode: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination'
    },
    mousewheel: true,
    keyboard: true,
  });

  constructor( public firestoreService:FirestoreService) {
              this.getProducts();
   }

  ngOnInit() {}

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  ionViewWillEnter(){
    const pedidolocal = JSON.parse(localStorage.getItem('pedido'));
    if(pedidolocal !== null){
      this.items = pedidolocal.productos.length;
    } else {
      this.items = 0;
    }
  }

  ngOnDestroy(){
    if(this.subscribir){
        this.subscribir.unsubscribe();
    }
  }

  getProducts(){
     this.subscribir = this.firestoreService.getCollectionChanges<Producto>(this.path).subscribe(res => {
      this.productos = res;
      if(!this.productos){
        console.log("no hay productos");
      } else{
        this.loading = false;
      }
    });
  }

  recibirItem(item: number){
    this.items = item;
  }

}
