import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	ventanas: any[];

  constructor() { }

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

  abrirModal(ventana){
  
  }

}
