import { Component, Input, OnInit } from '@angular/core';
import { MenuController} from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  @Input() titulo = '';
  @Input() carro = false;
  @Input() tienda = true;
  @Input() item = 0 ; 
  
  constructor(private menu:MenuController) { }

  ngOnInit() {
    
  }

}
