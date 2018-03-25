import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

	@Input() capasActivas;
  @Input() capas;
	@Input() estructuras;
	@Input() categorias;

  @Output() mapaRefrescadoRequerido = new EventEmitter<any>();
  @Output() coordenadaActualizada = new EventEmitter<any>();
  @Output() capaCerrada = new EventEmitter<any>();

  capaElegida: any;

  agregarDatosActivado: boolean;

  constructor() { }

  ngOnInit() {

    this.agregarDatosActivado = false;
  }

  pedirRefrescarMapa(evento){

    this.mapaRefrescadoRequerido.emit(evento);
  }

  pedirTrancarExterno(evento){

    this.capaCerrada.emit(evento);
  }
  pedirActualizarGeojsonEditable(evento){


    this.coordenadaActualizada.emit(evento);
  }

  pedirTerminarAgregar(evento){

    this.mapaRefrescadoRequerido.emit(evento);
    this.agregarDatosActivado = false;
  }

  comenzarRegistro(evento){

    this.capaElegida = evento;
    this.agregarDatosActivado = true;
  }

}
