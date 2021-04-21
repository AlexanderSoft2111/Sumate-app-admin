import { element } from 'protractor';
import { ModalController, AlertController } from '@ionic/angular';
import { ProductoPedido } from './../../Models/interfaces';
import { FirestoreService } from './../../servicios/firestore.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Pedido } from 'src/app/Models/interfaces';
import {MatTableDataSource} from '@angular/material/table';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
})
export class DetallePedidoComponent implements OnInit {
  
  
  @Input() verPedido: Pedido;
  displayedColumns: string[] = ['producto.codigo','producto.descripcion','cantidad','producto.precio'];
  dataSource = new MatTableDataSource<ProductoPedido>();
  private path = 'Pedidos';
  meses = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ]

  dias = [
    "Domingo","Lunes", "Martes", "Miercoles",
    "Jueves", "Viernes", "Sabado"
  ]

    fechaCreacion = '';
    fecha = new Date();
    year = null;
    month = null;
    day = null;
    dayCalendary = null;

    fechaEntrega: any;
    yearEntrega: any;
    monthEntrega: any;
    dayEntrega: any;
    dayCalendaryEntrega: any;

  @ViewChild('htmlData') htmlData:ElementRef;
  
  constructor( public firestoreService:FirestoreService,
               public modalController:ModalController,
               public alertController:AlertController) { }

  ngOnInit() {
    this.getPedido();
  }

  getPedido(){
    if(this.verPedido !== undefined ){
      this.dataSource.data = this.verPedido.productos;
      this.obtenerFechas();
    }
  }

  obtenerFechas(){
    if (this.verPedido.fecha !== undefined){
      this.fecha = new Date(this.verPedido.fecha.seconds * 1000);
      
      this.year = this.fecha.getFullYear();
      this.month = this.fecha.getMonth();
      this.day = this.fecha.getDay();
      this.dayCalendary = this.fecha.getDate();

      this.fechaCreacion = this.day+'/'+this.month+'/'+this.year;
      console.log(this.verPedido.fechaEnvio);
      
      if(this.verPedido.fechaEnvio !== null){
        this.fechaEntrega = new Date(this.verPedido.fechaEnvio.seconds * 1000);
        this.yearEntrega = this.fechaEntrega.getFullYear();
        this.monthEntrega = this.fechaEntrega.getMonth();
        this.dayEntrega = this.fechaEntrega.getDay();
        this.dayCalendaryEntrega = this.fechaEntrega.getDate();
      }
    }
 
  }

  cerrarModal(){
    this.modalController.dismiss();
  }

  fechaPedido(fecha:Date, dias:number){
      fecha.setDate(fecha.getDate() + dias);
      return fecha;
  }

  openPDF(){
    if(this.verPedido.fechaEnvio !== null){
      this.modalController.dismiss();
      const doc = new jsPDF();
      const date = new Date (this.verPedido.fechaEnvio)
      this.verPedido.fechaEnvio = this.fechaPedido(date,1);
      const yearEnvio = this.verPedido.fechaEnvio.getFullYear();
      const monthEnvio = this.verPedido.fechaEnvio.getMonth();
      const dayEnvio = this.verPedido.fechaEnvio.getDay();
      const dayEnvioCalendary = this.verPedido.fechaEnvio.getDate();
      doc.setFontSize(20);
      doc.setFont("helvetica",'bold' );  
      doc.text('Alistamiento de Productos',60, 10);
      doc.setFontSize(15);
      doc.setFont('times','italic');
      doc.setTextColor(26, 189, 156);
      doc.text('Datos del pedido ',120, 25);
      doc.text('Datos del cliente ',20, 25);
      doc.text('Detalle de productos ',20, 90);
      doc.setFontSize(11);
      doc.setFont('normal','normal');
      doc.setTextColor(0, 0, 0);
      doc.text('Cliente: '+this.verPedido.cliente.nombre+' '+this.verPedido.cliente.apellido,20, 35);
      doc.text('Cédula: '+this.verPedido.cliente.cedula,20, 45);
      doc.text('Teléfono: '+this.verPedido.cliente.telefono,20, 55);
      doc.text('Email: '+this.verPedido.cliente.email,20, 65);
      doc.text('Tipo Cliente: '+this.verPedido.cliente.rol,20, 75);
      doc.text('Fecha de pedido: '+this.dias[this.day]+' '+this.dayCalendary+' de '+this.meses[this.month]+' del '+this.year,120, 35);
      doc.text('Dirección: '+this.verPedido.cliente.direccion,120, 45);
      doc.text('Estado: '+this.verPedido.estado,120, 55);
      doc.text('Total: $'+this.verPedido.precioTotal,120, 65); 
      doc.setFont('bold');
      doc.text('Fecha de entrega: '+this.dias[dayEnvio]+' '+dayEnvioCalendary+' de '+this.meses[monthEnvio]+' del '+yearEnvio,120, 75);
      autoTable(doc, { html: '#table', theme:'grid', startY:95 }); 
      this.verPedido.estado = 'Alistamiento';
      this.firestoreService.updateDoc(this.verPedido, this.path, this.verPedido.id);  
      doc.save('Documento.pdf');  
      // añadir en una nueva pagina
      // doc.addPage();
      // doc.text('Visita programacion.net',100, 100);
    // autoTable(doc, { html: '#table', theme:'grid', startY:200 });
    // autoTable({startY: number = null});

  
    }else{
      this.presentAlertPrompt('Debe escoger una fecha de Envio para imprimir el alistamiento');
    }
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