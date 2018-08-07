import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	ventanas: any[];

	ventanaActiva: any;


  constructor(private modalService: NgbModal) { }


  ngOnInit() {
  	this.ventanas = [
  		"Proyecto",
  		"Contactanos",
  		"Terminos y Condiciones",
  		"Investigadores",
  		"Desarrolladores",
  		"Acerca de..."
  	]
  }

  abrirModal(ventana, content){
  	this.seleccionarVentana(ventana);
  	this.open(content);
  }

  seleccionarVentana(ventana){
  	this.ventanaActiva = ventana;
  }

  open(content) {

    this.modalService.open(content,{ size: 'lg' }).result.then((result) => {

		console.log("Saludos");
    }, (reason) => {

    });
  }


}
