import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	ventanas: any[];
	investigadores: any[];
	desarrolladores: any[];

	ventanaActiva: any;

	modalRef: any;


  constructor(private modalService: NgbModal) { }


  ngOnInit() {
  	this.ventanas = [
  		{"corto". "Proyecto", nombre": Proyecto",}
  		{"corto". "Contactanos", nombre": Contactanos",}
  		{"corto". "TyC", nombre": Terminos y Condiciones",}
  		{"corto". "Investigadores", nombre": Investigadores",}
  		{"corto". "Desarrolladores", nombre": Desarrolladores",}
  		{"corto". "Acerca de", nombre": Acerca de"}
  	];
  	this.investigadores = [
  		{
  		"nombre": "Dr. Jorge Rojas",
  		"correo": "rogojorge@gmail.com",
  		"telefono": "0416-3200906",
  		"foto": "jorge.jpg"
  		},
  		{
  		"nombre": "MSc. Francisco Alvarez",
  		"correo": "faovenezuela@gmail.com",
  		"telefono": "0414-8242002",
  		"foto": "francisco.jpeg"
  		},
  		{
  		"nombre": "MSc. Ysimar Rivera",
  		"correo": "ysymar.river@gmail.com",
  		"telefono": "0416-8936376",
  		"foto": "ysimar.jpg"
  		}
  	];
  	this.desarrolladores = [
  		[{
  			"nombre": "MSc. Yalgis Rodriguez",
  			"correo": "yalgisrodriguez@gmail.com",
  			"telefono": "0416-6143465",
  			"foto": "yalgis.jpeg"
  		},{
  			"nombre": "MSc. Luis M. Rodriguez",
  			"correo": "luismrodriguezf@gmail.com",
  			"telefono": "0416-8945712",
  			"foto": "luism.jpeg"
  		},{
  			"nombre": "MSc. Yulia Sardella",
  			"correo": "sardellayulia@gmail.com",
  			"telefono": "0416-4813369",
  			"foto": "yulia.jpg"
  		}],
  		[{
  			"nombre": "MSc. Gregorio Ruiz",
  			"correo": "gruizleon@gmail.com",
  			"telefono": "0426-2871235",
  			"foto": "gregorio.jpg"
  		},{
  			"nombre": "TSU. Benjamin Escobar",
  			"correo": "benjamin.s1.e@gmail.com",
  			"telefono": "0416-0337683",
  			"foto": "benjamin.jpg"
  		},{
  			"nombre": "Ing. Carlos Cercado",
  			"correo": "cercadocarlos@gmail.com",
  			"telefono": "0426-3814727",
  			"foto": "cercado.png"
  		}]
  	];
  }

  abrirModal(ventana, content){
  	this.seleccionarVentana(ventana);

    this.modalRef = this.modalService.open(content, { size: 'lg' }).result.then((result) => {

    }, (reason) => {
  
    });
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
