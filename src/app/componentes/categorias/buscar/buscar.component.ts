import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-buscar-categorias',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarCategoriasComponent implements OnInit {

	categorias: any;
	categoriaNueva: any;
	loading: boolean;

	@Output() categoriaCambiada = new EventEmitter<any>();
	@Output() categoriaActualizada = new EventEmitter<any>();
	@Output() categoriaEliminada = new EventEmitter<any>();


  constructor(private categoriasService: CategoriasService
  ) { }

  ngOnInit() {

  	this.loading = false;

  	this.categoriaNueva = {
  		nombre: "",
  		descripcion: ""
  	}

  	this.loading = true;
	this.categoriasService.obtener().subscribe(data =>{
  	this.loading = false;
		console.log(data)
		if(data.status == 200){
		
			this.categorias = data.body;
		}
		else{
		  	console.log(data);
		}
	},
		error => {
			console.log(error);
		}
	);

/*
	this.categorias = [{
			nombre: "Categoria 1",
			descripcion: "Descripcion 1",
			eliminable: false
		},
		{
			nombre: "Categoria 2",
			descripcion: "Descripcion 2",
			eliminable: true
		},
		{
			nombre: "Categoria 3",
			descripcion: "Descripcion 3",
			eliminable: false
		}
	]
*/
  }//Cierre ngOnInit


  agregarCategoria(){
	this.categoriaCambiada.emit(this.categoriaNueva);
  }

  editarCategoria(categoria){
  	this.categoriaActualizada.emit(categoria);
  }

  eliminarCategoria(categoria){
  	this.categoriaEliminada.emit(categoria);
  }

}