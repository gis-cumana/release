import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-buscar-capas',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarCapasComponent implements OnInit {

	loading: boolean;	
	capas: any;
	capaNueva: any;


	@Input() categorias;
	@Output() capaCambiada = new EventEmitter<any>();
	@Output() capaActualizada = new EventEmitter<any>();
	@Output() capaEliminada = new EventEmitter<any>();

  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) {}

  ngOnInit() {

  	eval("window.yo2 = this");

  	this.loading = false;
  	this.capaNueva = {
  		categoria: "",
  		nombre: "",
  		geometria: "",
  		atributos: []
  	}


  	this.capas = [];

  	this.cargarCapas();

  	document.querySelector("body > ngb-modal-window > div").setAttribute("style","max-width: 700px;");

  }//Cierre ngOnInit


  cargarCapas(){

  	this.loading = true;
	this.capasService.obtener().subscribe(data =>{
  	this.loading = false;

		if(data.status == 200){	
			console.log(data);
			this.capas = data.body;

			this.capas.forEach((element) =>{

				if(!element.categoria){
					element.categoria = {
						nombre: "N/A",
						id: ""
					}
				}

				element.geometria = element.atributos.find((element) =>{return element.nombre=="geom"}).tipo;

			});
		}
		else{
		  	this.capas = [];
		}
	},
		error => {
			console.log(error);
		}
	);


  }

  agregarCapa(){
	this.capaCambiada.emit(this.capaNueva);
  }

  editarCapa(capa){
  	this.capaActualizada.emit(capa);
  }

  eliminarCapa(capa){
  	this.capaEliminada.emit(capa);
  }

  cargarGeojson(evento){
  	
  	let file = evento.target.files[0];
  	console.log(file);

  	this.loading = true;
	this.capasService.importar(file).subscribe(data =>{
  	this.loading = false;

  		if(data.status == 200){			
  			this.cargarCapas();
  		}
  		else{
  		}
	  },
	  error => {
	  	console.log(error);
	  }
	);

  }


}
