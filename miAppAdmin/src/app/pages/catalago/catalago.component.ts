import { Producto } from './../../Models/interfaces';
import { Subscription } from 'rxjs';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import SwiperCore, { Swiper, EffectCoverflow, Navigation, Pagination, Scrollbar, A11y } from "swiper/core";

SwiperCore.use([EffectCoverflow, Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'app-catalago',
  templateUrl: './catalago.component.html',
  styleUrls: ['./catalago.component.scss'],
})
export class CatalagoComponent implements OnInit {

  tituloProductos = "Productos";
  productos: Producto[] = [];
  private path = '/Productos'
  producSuscribir: Subscription;

  swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  });

  
  constructor( public firestoreService: FirestoreService) { }

  ngOnInit() {

    this.getProducto();
  }

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  ngOnDestroy(): void {
    if(this.producSuscribir){
      this.producSuscribir.unsubscribe();
    }
    
  }

  getProducto(){
     this.producSuscribir = this.firestoreService.getCollectionChanges<Producto>(this.path).subscribe( res => {
        if(res.length){
          this.productos = res;
        }
      });
  }


}
