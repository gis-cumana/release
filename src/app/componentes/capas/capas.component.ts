import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as Turf from '@turf/turf';
import 'leaflet-sidebar-v2';
import * as leafletImage from 'leaflet-image';
import {CapasService} from '../../services/capas.service';
import { FlashMessagesService } from 'angular2-flash-messages/module';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent implements OnInit {
   activeMap: any;
   baseMaps: any;
   control: any;
   overlayMaps: any;

  geoJsons: any;

  agregarDatosActivado: boolean;
  editarDatosActivado: boolean;
  eliminarDatosActivado: boolean;


  capas: any;
  categorias: any;


  loading: boolean;

  geojsonEditable: any;
  geojsonVertices: any;
  geojsonCamino: any;
  geojsonFigura: any;
  puntosEnEdicion: any;
  verticesEnEdicion: any;
  caminoEnEdicion: any;
  figuraEnEdicion: any;

  moviendoVertice: boolean;
  verticeEnMovimiento: any;
  caminoCerrado: boolean;

  popupOpened: boolean;
  insertandoVertice: boolean;

  capasActivas: any;
  categoriaActiva: any;

  capaShapefile: any;

  layerToFilter: string;
  attributesToFilter: any;
  atributoFiltrado: string;
  atributoElegido: any;
  filtroElegido: any;

  valorBusqueda: string;
  
  searchControl: any;
  medirDistanciaControl: any;
  medirAreaControl: any;
  searchPoint: any;

  marcadorBusqueda: any;
  colocandoPersona: boolean;
  personaPorColocar: boolean;
  
  medidaDistancia: number;
  medidaArea: number;

	latkm: number;
	lngkm: number;

	controlAbajo: boolean;

	interaccionCortada: boolean;

	dibujandoPunto: boolean;
	dibujandoCamino: boolean;
	dibujandoPoligono: boolean;
	pointHovered: boolean;
	distanceHovered: boolean;
	areaHovered: boolean;
	unidadDistancia: string;
	unidadPerimetro: string;
	unidadArea: string;

	capa: string;
	capaActiva: any;
	estructuraActiva: any;
	capaPaginada: any;
	paginaActiva: any;
	atributos: any;
	numeroPagina: number;
	estructuras: any;
	
	claseBotonFiltro: string;

	foto: any;
	fotoDibujada: boolean;

	claseMapa: string;
	claseFiltro: string;
	
	modalAbierta: boolean;
	
  constructor(
		private modalService: NgbModal,
        private flashMessage: FlashMessagesService,
        private capasService: CapasService) { }

  ngOnInit() {
  	
  	this.modalAbierta = false;
  	
  	this.claseMapa = "row-full"
  	this.claseFiltro = "row row-full"
  	this.fotoDibujada = false;
	
	this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin";
	
	this.capas = [];
	this.estructuras = [];

  	this.estructuraActiva = [];
  	this.atributos = [];
  	this.capaPaginada = [];
  	this.paginaActiva = [];
  	this.numeroPagina = 0;
	this.capa="";

  	this.unidadDistancia = "Km";
  	this.unidadArea = "Km2";
  	this.unidadPerimetro = "Km";

  	this.interaccionCortada = false;

  	this.controlAbajo = false;
  	console.log("Control: "+this.controlAbajo);
    var polygon = Turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
    var area = Turf.area(polygon);


  this.latkm = this.getKilometros(0,0,1,0);
  this.lngkm = this.getKilometros(0,0,0,1);

	this.medidaDistancia = 0;
	this.medidaArea = 0;
	
	this.medirDistanciaControl = {};
	this.medirAreaControl = {};

	this.colocandoPersona = false;
	this.personaPorColocar = false;
  	
  	this.searchPoint = {
  		"lng": 0,
  		"lat": 0,
  		"radius": 1,
  		"area": 0
  	};

  	this.categoriaActiva = "";

  	this.layerToFilter = "";
  	this.attributesToFilter = [];
  	this.atributoFiltrado = "";
  	this.atributoElegido = {
  		"nombre": "",
  		"tipo": ""
  	};

  	this.valorBusqueda = "";
  	this.filtroElegido = "";

  	this.capasActivas = [];

  	this.insertandoVertice = false;

  	this.caminoCerrado = false;

  	this.popupOpened = false;

  	this.control = [];
  	this.baseMaps = {};
  	this.overlayMaps = {};
  	this.geoJsons = [];

  	this.inicializarGeojsons();

	if(window.localStorage.capaActiva){
		window.localStorage.removeItem("capaActiva");
	}
	if(window.localStorage.coordenadas){
		window.localStorage.removeItem("coordenadas");
	}

  	this.loading = false;

    eval("window.yo = this");

  	this.agregarDatosActivado = false;
  	this.editarDatosActivado = false;
  	this.eliminarDatosActivado = false;


  	this.loading = true;
	this.capasService.obtener().subscribe(data =>{
  	this.loading = false;

		if(data.status == 200){
			this.capas = data.body;

			this.capas.forEach((element) =>{

				if(!element.categoria){
					element.categoria = {
						nombre: "N/A",
						id: ""
					}
				}

				element.geometria = element.tipo;

			});
			this.estructuras = this.capas;

			window.localStorage.capas = JSON.stringify(this.capas);
		}
		else{
		  	this.capas = [];
		}
	},
		error => {

		  	this.loading = false;
			console.log(error);
		}
	);


    this.iniciar_mapa();
  }


  iniciar_mapa()
  {
      const osm_provider = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMaps | CSUDO'
      });

      const carto_provider = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          attribution: 'Cartografica | CSUDO'
      });


      const argis_provider = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Argis | CSUDO'
      });

      const satelite_provider = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Satelital | CSUDO'
      });


      this.activeMap = L.map('mapa', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm_provider],
		preferCanvas: true
        });

        this.baseMaps = {
            "OSM": osm_provider,
            "Carto": carto_provider,
            "Terreno": argis_provider,
            "Satelite": satelite_provider
        };


        this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
        this.control.setPosition('topleft');



	    this.activeMap.on("click", (ev) =>{

		if(this.interaccionCortada) return false;

		if(this.colocandoPersona){

			this.personaPorColocar = false;
			this.searchPoint.lat = ev.latlng.lat;
			this.searchPoint.lng = ev.latlng.lng;
			this.encontrarPunto();
		}

		if(this.personaPorColocar){

			this.colocandoPersona = true;
		}else{

			if(window.localStorage.capaActiva){

				if(!this.insertandoVertice){
					if(!this.popupOpened && !this.moviendoVertice){

						if(!this.caminoCerrado){
							if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
							if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
						}
						this.addPointToArr(ev.latlng.lng, ev.latlng.lat);
					}
					if(this.moviendoVertice){
						this.moverVertice(ev.latlng, 2);
					}
				}
			}
		}

	});


	this.activeMap.on("popupopen", (ev) =>{

		this.popupOpened = true;
	});

	this.activeMap.on("popupclose", (ev) =>{

		this.popupOpened = false;
	});

	this.activeMap.scrollWheelZoom.disable();
	
	let init = this;


	window.addEventListener("keydown", function(e){

		if(e.keyCode == 16){
			init.activeMap.scrollWheelZoom.enable()
		}

		if(e.keyCode == 17){
			init.controlAbajo = true;
		}

	});

	window.addEventListener("keyup", function(e){

		if(e.keyCode == 16){
			init.activeMap.scrollWheelZoom.disable()
		}

		if(e.keyCode == 17){
			init.controlAbajo = false;
		}

	});


    L.control.sidebar({
              autopan: false,
              closeButton: true, 
              container: 'sidebar', 
              position: 'left',
          }).addTo(this.activeMap);
          this.configurarControlDistancia();
          this.configurarControlArea();
          this.configurarControlBusqueda();
          this.configurarControlFiltro();
  }


  traerCapa(nombre){

    console.log(nombre);

    this.loading = true;
    this.capasService.traer(nombre).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){     

          let capaNueva = {
            geojson: data.body,
            nombre: nombre
          }

          window.localStorage.capaNueva = JSON.stringify(capaNueva);
          //document.getElementById("mostrarCapaNueva").click();
          this.cargarGeojsonFromLocal();
          this.seleccionarCapa();
          console.log(data.body);
          console.log(data);
        }
        else{

          console.log(data);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

shout(mensaje, estilo, tiempo){
        this.flashMessage.show(mensaje, { cssClass: estilo, timeout: tiempo });
    }

  calcularAreaPunto(){

  	this.searchPoint.area = Math.PI*(this.searchPoint.radius*this.searchPoint.radius);
  }

  inicializarGeojsons(){

  	this.geojsonEditable = {
	  "type": "Feature",
	  "geometry": {
	    "type": "",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}  	

	this.geojsonVertices = {
	  "type": "FeatureCollection",
	  "features": []
	}  	

	this.geojsonCamino = {
	  "type": "FeatureCollection",
	  "features": []
	}	

	this.geojsonFigura = {
	  "type": "Feature",
	  "geometry": {
	    "type": "Polygon",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}

  }

  limpiarEditables(){

  	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
  	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  	if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

  }
  
getKilometros(lat1,lon1,lat2,lon2){
		
		var rad = function(x) {return x*Math.PI/180;}
		var R = 6378.137; //Radio de la tierra en km
		var dLat = rad( lat2 - lat1 );
		var dLong = rad( lon2 - lon1 );
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d; //Retorna tres decimales
	}
  
	medirCaminoDibujado(){

		let init = this;

		this.dibujandoCamino = true;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = false;

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([])
		this.medidaDistancia = 0;
		this.medidaArea = 0;

		setTimeout(()=>{
			
			init.flashMessage.show('Comience a dibujar el camino', { cssClass: 'alert-info', timeout: 4000 });
			window.localStorage.capaActiva = JSON.stringify({'tipo': 'LineString','geometria': 'LineString', 'coordenadas':[]});
		}, 500)
		
	}
	
	medirCaminoElegido(){

		
	}
	
	medirAreaDibujada(){

		let init = this;

		this.dibujandoCamino = false;
		this.dibujandoPoligono = true;
		this.dibujandoPunto = false;

		
		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([[]])
		this.medidaDistancia = 0;
		this.medidaArea = 0;

		setTimeout(()=>{
			
			init.flashMessage.show('Comience a dibujar el poligono', { cssClass: 'alert-info', timeout: 4000 });
			window.localStorage.capaActiva = JSON.stringify({'tipo': 'Polygon', 'geometria': 'Polygon', 'coordenadas':[[]]});
		}, 500)
		
		
	}
	
	medirAreaElegida(){

		


		
	}

	prevenirInteraccion(el){
		
		if(el == 'd'){
			this.distanceHovered = true;
		}		
		if(el == 'a'){
			this.areaHovered = true;
		}
		if(el == 'p'){
			this.pointHovered = true;
		}

		console.log("Cortando...");
		this.interaccionCortada = true;
		this.activeMap.dragging.disable();
		this.activeMap.doubleClickZoom.disable();
	}
	
	permitirInteraccion(el){

		if(el == 'd'){
			this.distanceHovered = false;
		}		
		if(el == 'a'){
			this.areaHovered = false;
		}
		if(el == 'p'){
			this.pointHovered = false;
		}
		console.log("Reactivando...");
		this.interaccionCortada = false;
		this.activeMap.dragging.enable();
		this.activeMap.doubleClickZoom.enable();
	}

	limpiarPunto(){

		this.dibujandoPunto = false;		
		if(this.marcadorBusqueda) this.activeMap.removeLayer(this.marcadorBusqueda);	
	}

	limpiarPoligono(){

		this.dibujandoPoligono = false;		
		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
		if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([[]])
		this.medidaDistancia = 0;
		this.medidaArea = 0;
	}

	limpiarCamino(){

		this.dibujandoCamino = false;		
		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([])
		this.medidaDistancia = 0;
		this.medidaArea = 0;
	}

	obtenerPunto(ev){

		this.dibujandoCamino = false;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = true;

		this.personaPorColocar = true;
		this.flashMessage.show('Haga click en el mapa para obtener las coordenadas', { cssClass: 'alert-info', timeout: 4000 });
	}
	
	encontrarPunto(){

		let init = this;

		this.dibujandoCamino = false;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = true;


		if(this.marcadorBusqueda) this.activeMap.removeLayer(this.marcadorBusqueda);
		this.colocandoPersona = false;

		console.log("break 1");
		this.activeMap.setView([this.searchPoint.lat, this.searchPoint.lng]);

		this.calcularAreaPunto();

		let popupDiv = document.createElement("div");
		let boton = document.createElement("button");
		boton.setAttribute("class","btn btn-danger");
		boton.innerHTML='<i class="fa fa-times" aria-hidden="true"></i>';
		boton.addEventListener("click", function(){

			init.dibujandoPunto = false;			
			init.activeMap.removeLayer(init.marcadorBusqueda);
		});
		popupDiv.appendChild(boton);

		console.log("break 2");
		this.marcadorBusqueda = L.circle([this.searchPoint.lat, this.searchPoint.lng],{
		    color: 'red',
		    fillColor: '#f03',
		    fillOpacity: 0.5,
		    radius: this.searchPoint.radius
		}).bindPopup(popupDiv).addTo(this.activeMap);
	}


	toggleFilter(){
		
		if(this.capasActivas.length==0){
			this.shout("No ha cargado ninguna capa que pueda filtrar aun", "alert-warning", 3000);
			return false;
		}
		
		if(this.claseBotonFiltro == "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin"){
			this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin filtro";
			this.claseFiltro = "row row-full push";
			this.claseMapa = "row-full push";
		}
		else{
			this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin";
			this.claseFiltro = "row row-full" 
			this.claseMapa = "row-full" 
		}
	}
  
  configurarControlFiltro(){
  	
///INICIO CONTROL
	
	let init = this;
	
	L.Control["Filtro"] = L.Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    L.Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioFiltro");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    L.DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	L.control["filtro"] = function(id, options) {
	  return new L.Control["Filtro"](id, options);
	}

	var items = [];

	this.searchControl = L.control["filtro"]({
	  data: items
	}).addTo(this.activeMap);
	
  }  
  
  configurarControlBusqueda(){
  	
///INICIO CONTROL
	
	let init = this;
	
	L.Control["Search"] = L.Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    L.Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioPunto");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    L.DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	L.control["search"] = function(id, options) {
	  return new L.Control["Search"](id, options);
	}

	var items = [];

	this.searchControl = L.control["search"]({
	  data: items
	}).addTo(this.activeMap);
	
  }  
  
  configurarControlDistancia(){
  	
///INICIO CONTROL
	

	L.Control["MedirDistancia"] = L.Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    L.Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioDistancia");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    L.DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	L.control["medirDistancia"] = function(id, options) {
	  return new L.Control["MedirDistancia"](id, options);
	}

	var items = [];

	this.medirDistanciaControl = L.control["medirDistancia"]({
	  data: items
	}).addTo(this.activeMap);
	
  }
  
  configurarControlArea(){
  	
///INICIO CONTROL
	

	L.Control["MedirArea"] = L.Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    L.Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioArea");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    L.DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	L.control["medirArea"] = function(id, options) {
	  return new L.Control["MedirArea"](id, options);
	}

	var items = [];

	this.medirAreaControl = L.control["medirArea"]({
	  data: items
	}).addTo(this.activeMap);
	
  }

  estiloEdicion(){

  	let estilo = "";

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);

  	
  	if(coordenadas.length > 1){

  		if((coordenadas[0][0] == coordenadas[0][1])&&(coordenadas[coordenadas.length-1][0] == coordenadas[coordenadas.length-1][1])){
  			estilo = "Polygon";
  		}
  		else{
  			estilo = "LineString";
  		}
  	}
	else{
  		estilo = "Point";
  	}

  	if(estilo == "Point"){
  	
		return {
			radius: 8,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		}
  	}
  	else if(estilo == "LineString"){
  	
		return {
			"color": '#08519c',
			"weight": 5,
			"opacity": 0.65
		}  	
	}
  	else if(estilo == "Polygon"){

		return { 
			fillColor: '#bdd7e7',
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		}
  	}

  }

  addPointToArr(lng, lat){

  	let tipo = "";
	let coordenadas = [];


  	if(window.localStorage.capaActiva){

  		let capa = JSON.parse(window.localStorage.capaActiva);
  		this.geojsonEditable.geometry.type = capa.geometria;

	  	tipo = JSON.parse(window.localStorage.capaActiva).geometria;

	  	if(window.localStorage.coordenadas){

	  		coordenadas = JSON.parse(window.localStorage.coordenadas);

			let init = this;

	  		switch(tipo){

	  			case "Point":
				  	
				  	coordenadas = [lng, lat];
			  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
					
			  		this.geojsonEditable.geometry.coordinates = coordenadas;

					if(this.puntosEnEdicion){
						this.activeMap.removeLayer(this.puntosEnEdicion);
					}

					this.puntosEnEdicion = L.geoJSON(this.geojsonEditable, {
			
						pointToLayer: function (feature, latlng) {
				        	return L.circleMarker(latlng, init.estiloEdicion);
				    	}}).addTo(this.activeMap);

	  			break;

	  			case "LineString":

			  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
			  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

					coordenadas.push([lng, lat]);

				    if(coordenadas.length>1){
				    	this.levantarCamino(coordenadas);
				    }

				    this.levantarVertices(tipo, coordenadas);

		  			window.localStorage.coordenadas = JSON.stringify(coordenadas);

	  			break;

	  			case "Polygon":

	  				if(!this.caminoCerrado){

				  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
				  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);


						coordenadas[0].push([lng, lat]);

					    if(coordenadas[0].length>1){
					    	this.levantarCamino(coordenadas[0]);
					    }

					    this.levantarVertices(tipo, coordenadas);

			  			window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  				}

	  			break;
	  		}


	  	}
	  	else{

	  		console.log("No habia coordenadas");
	  		if(tipo == 'LineString'){coordenadas.push([lng, lat]);}
	  		if(tipo == 'Point'){coordenadas.push([]);coordenadas[0].push([lng, lat])}
	  		if(tipo == 'Polygon'){coordenadas.push([]);coordenadas[0].push([lng, lat])}
	  		console.log(coordenadas);
	  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  	}

  	}
  	else{

  		console.log("No hay capa activa");
  		return false;
  	}

  }

  levantarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

	this.geojsonCamino.features = [];
	this.medidaDistancia = 0;

	console.log(coordenadas);
  	for(let i = 0, j = coordenadas.length; i<j-1; i++){

		let camino = {
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [coordenadas[i], coordenadas[i+1]]
			},
			"properties": {}
		}

		this.geojsonCamino.features.push(camino);
  	}
/*
		this.caminoEnEdicion = L.geoJSON(this.geojsonCamino, {style: {
			"color": '#FFFF00',
			"weight": 2,
			"opacity": 0.65
			}
		}).addTo(this.activeMap);
*/
		this.caminoEnEdicion = L.geoJSON(this.geojsonCamino, {style: this.estiloEdicion}).addTo(this.activeMap);

		let init = this;

		this.caminoEnEdicion.eachLayer((layer) =>{
				 				
			
			layer.on("preclick", (ev)=>{
				
				if(window.localStorage.capaActiva && !init.controlAbajo){
					init.insertandoVertice = true;
					init.insertarVertice(ev);					
				}

			});
			let coords = layer.feature.geometry.coordinates;
			//let km = init.getKilometros(coords[0][0],coords[0][1],coords[1][0],coords[1][1]);
			let from = Turf.point([coords[0][0],coords[0][1]]);
			let to = Turf.point([coords[1][0],coords[1][1]]);
			let options = {units: 'Kilometers'};
			let km = Turf.distance(from, to, {units: 'kilometers'});
			layer.bindPopup("Distancia (Km.): "+km);
			init.medidaDistancia = init.medidaDistancia+km;
			console.log(km);
			console.log(init.medidaDistancia);
		});



  }

  insertarVertice(evento){

  	console.log("insertandoVertice");

  	let tipo = JSON.parse(window.localStorage.capaActiva).tipo;
  	let origen = evento.target.feature.geometry.coordinates[0];
  	let destino = [evento.latlng.lng, evento.latlng.lat]
  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coords;
  	let punto;
  	let coordenadasNuevas = [];

  	console.log(coordenadas);
  	console.log(tipo);

  	this.activeMap.removeLayer(this.caminoEnEdicion);
  	this.activeMap.removeLayer(this.verticesEnEdicion);

  	if(tipo == "LineString"){
		
		coords = coordenadas;
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);  			
	  	}

		coordenadas = coordenadasNuevas;
		this.levantarCamino(coordenadas);
		this.levantarVertices(tipo, coordenadas);
  	}

  	if(tipo == "Polygon"){

		coords = coordenadas[0];
		console.log("Poligono");
		console.log(coords);
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);
	  			console.log(coordenadasNuevas);
	  	}

		coordenadas = [coordenadasNuevas];
		this.levantarCamino(coordenadas[0]);
		this.levantarVertices(tipo, coordenadas);
  	}



  	window.localStorage.coordenadas = JSON.stringify(coordenadas);

  	let init = this;
  	setTimeout(()=> {init.insertandoVertice = false;}, 500);
  }

  levantarVertices(tipo, coordenadas){


  	let init = this;
  	let coords;

  	if(tipo == "LineString"){coords = coordenadas}
  	if(tipo == "Polygon"){coords = coordenadas[0]}

	console.log("añadiendo normalito");

	this.geojsonVertices.features = [];
	  		
	console.log(coordenadas);
	console.log(coords);
	
	coords.forEach((element) =>{

		let vertice = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": element
			},
			"properties": {}
		}

		this.geojsonVertices.features.push(vertice);
	});
	



	this.verticesEnEdicion = L.geoJSON(this.geojsonVertices, {
			
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 6,
					fillColor: "#FF0000",
					color: "#FFFF00",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.6 });
			}}).addTo(this.activeMap);

	let i = 0;

	this.verticesEnEdicion.eachLayer((layer) =>{ 
							
		i++;

		layer.on("preclick", (ev)=>{
			this.popupOpened = true;
		});

		let div = document.createElement("div");

		let buttonMove = document.createElement("button");
		buttonMove.setAttribute("class","btn btn-outline-warning");
		buttonMove.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'
		buttonMove.addEventListener("click", function(){
			window.localStorage.geometria = tipo;
			init.moverVertice(layer._latlng, 1);
		}, false);


		let buttonDelete = document.createElement("button");
		buttonDelete.setAttribute("class","btn btn-outline-danger");
		buttonDelete.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'
		buttonDelete.addEventListener("click", function(){
			init.quitarVertice(layer._latlng, tipo);
		}, false);


		div.appendChild(buttonMove);
		div.appendChild(buttonDelete);

		if(tipo == "Polygon" && coordenadas[0].length > 2 && !this.caminoCerrado){

			if( (i == 1 ) || (i == coordenadas[0].length)){
				let buttonClose = document.createElement("button");
				buttonClose.setAttribute("class","btn btn-outline-success");
				buttonClose.innerHTML='<i class="fa fa-lock" aria-hidden="true"></i>'
				buttonClose.addEventListener("click", function(){
					init.cerrarCamino(coordenadas);
				}, false);
				div.appendChild(buttonClose);
			}
			else{
				console.log("NO MATCH");
			}

		}
		
		if(i == 1 && !this.caminoCerrado && ( (tipo == "LineString" && coordenadas.length>1) || (tipo == "Polygon" && coordenadas[0].length>1) ) ){
			let buttonSetHead = document.createElement("button");
			buttonSetHead.setAttribute("class","btn btn-outline-primary");
			buttonSetHead.innerHTML='<i class="fa fa-flag" aria-hidden="true"></i>'
			buttonSetHead.addEventListener("click", function(){
				init.cambiarCabeza(tipo, coordenadas);
			}, false);
			div.appendChild(buttonSetHead);			
		}
		
		layer.bindPopup(div);

	});

  }

  cambiarCabeza(tipo, coordenadas){

  	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

  		for(let i = 1, j = coordenadas.length; i<=j; i++){
  			coordenadasNuevas.push(coordenadas[j-i]);
  		}

		this.levantarCamino(coordenadasNuevas);
  	}
  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);
  		for(let i = coordenadas[0].length-1; i>=0; i--){
  			coordenadasNuevas[0].push(coordenadas[0][i]);
  		}


		for(let i = 0, j = this.geojsonVertices.features.length; i<j; i++){
			
			console.log(this.geojsonVertices.features[i].geometry.coordinates);
			console.log(coordenadasNuevas[0][i]);

			this.geojsonVertices.features[i].geometry.coordinates = coordenadasNuevas[0][i];
		}

		this.levantarCamino(coordenadasNuevas[0]);
  	}
	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);

	this.levantarVertices(tipo, coordenadasNuevas);
  }


  moverVertice(punto, stage){

  	if(stage === 1){

	  	this.activeMap.closePopup();

	  	if(this.verticeEnMovimiento){
	  		this.activeMap.removeLayer(this.verticeEnMovimiento);
	  	}

	  	this.moviendoVertice = true;

	  	window.localStorage.verticeNuevo = JSON.stringify(punto);

		this.verticeEnMovimiento = L.circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);
	}
  	if(stage === 2){

  		let init = this;

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

		this.verticeEnMovimiento = L.circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);

		let boton = document.createElement("button");
		boton.setAttribute("class","btn btn-outline-success")
		boton.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'		
		boton.addEventListener("click", function(ev){

			init.moverVertice(punto, 3);
		}, false);

		let boton2 = document.createElement("button");
		boton2.setAttribute("class","btn btn-outline-danger")
		boton2.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'		
		boton2.addEventListener("click", function(ev){

	  		init.activeMap.removeLayer(init.verticeEnMovimiento);
		  	init.moviendoVertice = false;
		}, false);

		let div = document.createElement("div");
		div.appendChild(boton);
		div.appendChild(boton2);
		this.verticeEnMovimiento.bindPopup(div);

  	}
  	if(stage === 3){

  		let geometria = window.localStorage.geometria;

	  	this.moviendoVertice = false;

  		let origen = JSON.parse(window.localStorage.verticeNuevo);
  		let coordenadas = JSON.parse(window.localStorage.coordenadas);

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

	  		this.geojsonVertices.features.forEach((element) =>{

	  			if(element.geometry.coordinates[0] == origen.lng && element.geometry.coordinates[1] == origen.lat){

	  				element.geometry.coordinates[0] = punto.lng;
	  				element.geometry.coordinates[1] = punto.lat;
	  			}
	  		});

  		if(geometria == "LineString"){
			
	  		
	  		coordenadas.forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		console.log(coordenadas);
	  		this.levantarCamino(coordenadas);
	  		this.levantarVertices("LineString", coordenadas);
  		}

  		if(geometria == "Polygon"){

	  		
	  		coordenadas[0].forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		this.levantarCamino(coordenadas[0]);
	  		this.levantarVertices("Polygon", coordenadas);

	  		if(this.caminoCerrado){

				this.cerrarCamino(coordenadas);
	  		} 
  		}

  		window.localStorage.coordenadas = JSON.stringify(coordenadas);


  	}


  }

  quitarVertice(latlng, tipo){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

	  	coordenadas.forEach((element) =>{
	  		if((element[0] != latlng.lng) && (element[1] != latlng.lat)) coordenadasNuevas.push(element);
	  	});

	  	this.levantarCamino(coordenadasNuevas);
  		this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);

  		let pos = coordenadas[0].findIndex((element) =>{
  			return (element[0] == latlng.lng) && (element[1] == latlng.lat);
  		});

	  	if(this.caminoCerrado){

	  		console.log("EL camino estaba cerrado");
	  		console.log("Posicion: "+pos);

	  		this.activeMap.removeLayer(this.figuraEnEdicion);

	  		if(pos == 0){


		  		for(let i = 1; i < coordenadas[0].length-1; i++){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

	  		}
	  		else{

		  		for(let i = pos-1; i > 0 ; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

		  		for(let i = coordenadas[0].length-1; i>pos; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}
	  		}


	  		this.caminoCerrado = false;

	  	}
	  	else{

	  		console.log("EL camino NO estaba cerrado");

	  		coordenadasNuevas[0] = coordenadas[0].filter((element) =>{
	  			return (element[0] != latlng.lng) && (element[1] != latlng.lat);
	  		})
			console.log(coordenadasNuevas[0]);
	  	}

	  	this.levantarCamino(coordenadasNuevas[0]);
	  	this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);
  }

  cerrarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);



	if(coordenadas[0].length>2 && (coordenadas[0][0][0] != coordenadas[0][coordenadas[0].length-1][0]) && (coordenadas[0][0][1] != coordenadas[0][coordenadas[0].length-1][1])){
		
		console.log("acomodando el camino");
		coordenadas[0].push(coordenadas[0][0]);
		this.caminoCerrado = true;
	}

	let oldCoords = [[]];
	let i = 1;
	coordenadas[0].forEach((element) =>{

		if(i<coordenadas[0].length) oldCoords[0].push([element[0], element[1]]);
		i++;
	});

		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	



	this.geojsonFigura.geometry.coordinates = coordenadas;
/*	
	this.figuraEnEdicion = L.geoJSON(this.geojsonFigura, {style: {
										fillColor: '#bdd7e7',
									    weight: 2,
									    opacity: 1,
									    color: 'white',
									    dashArray: '3',
									    fillOpacity: 0.7} 
									}).addTo(this.activeMap);	
*/

	this.figuraEnEdicion = L.geoJSON(this.geojsonFigura, {style: this.estiloEdicion}).addTo(this.activeMap);

	this.caminoCerrado = true;

	if(coordenadas[0].length>1){

		this.levantarCamino(coordenadas[0]);
	}
	/*
	let xlng = [];
	let ylat = [];
	
	for(let i = 0, j = coordenadas[0].length; i<j; i++){
		
		xlng.push(this.getKilometros(0,0,0,coordenadas[0][i][0]));
		ylat.push(this.getKilometros(0,0,coordenadas[0][i][1],0));
	}
	
	this.medidaArea = this.areaPoligono(coordenadas[0]);
	*/
	console.log("Coordenadas para turf...");
	console.log(coordenadas[0]);
	var poligono = Turf.polygon([coordenadas[0]]);
	this.medidaArea = (Turf.area(poligono)/1000000);
	console.log(coordenadas);
	console.log(oldCoords);
	this.levantarVertices('Polygon', oldCoords);

  }

	areaPoligono(coordenadas){

		var equises = [];
		var yeses = [];

		coordenadas.forEach((element) =>{

			/*
			if(element[0]>0){
				equises.push(this.getKilometros(0,0,0,element[0]));				
			}
			else{
				equises.push(-1*this.getKilometros(0,0,0,element[0]));				
			}
			
			if(element[1]>0){
				yeses.push(this.getKilometros(0,element[0],element[1],element[0]));
			}
			else{
				yeses.push(-1*this.getKilometros(0,element[0],element[1],element[0]));
			}
			*/
			
			equises.push(element[0]*111320.7)
			yeses.push(element[1]*110567.2)
			
		});

		console.log("Kilometros metodo nuevo");		
		console.log(equises);
		console.log(yeses);
			
		let multi1 = [];
		let multi2 = [];

		console.log("Testing area calculation...");

		for(let i = 0, j = equises.length-1; i<j; i++){
			
			multi1.push(equises[i]*yeses[i+1]);
			multi2.push(yeses[i]*equises[i+1]);
		console.log(""+equises[i]+" * "+yeses[i+1]+" = "+multi1[i] );
		console.log(""+yeses[i]+" * "+equises[i+1]+" = "+multi2[i] );
		}		
		/*
		for(let i = equises.length-1, j = 0; i>j; i--){
			
			multi2.push(equises[i]*yeses[i-1])
			console.log(""+equises[i]+" * "+yeses[i-1]+" = "+multi2[multi2.length-1] );
		}
		*/
		let sum1 = 0;
		multi1.forEach((element) =>{
			sum1+=element;
		});		
		
		console.log("SUM1:  "+sum1);
		
		let sum2 = 0;
		multi2.forEach((element) =>{
			sum2+=element;
		});
		console.log("SUM2:  "+sum2);
		
		return Math.abs((sum1-sum2)/2);
	}

  trancarExterno(){

  }

  actualizarGeojsonEditable(ev){

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let init = this;
	this.geojsonEditable.geometry.type = ev.geom;

  	switch(ev.geom){

  		case "Point":

  			if(ev.tipo == "add"){

				this.geojsonEditable.geometry.coordinates = coordenadas;
				console.log(this.geojsonEditable);
				let init = this;

				this.puntosEnEdicion = L.geoJSON(this.geojsonEditable, {
				
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, init.estiloEdicion);
					}}).addTo(this.activeMap);
  			}

  			if(ev.tipo == "remove"){

				if(this.puntosEnEdicion){
					this.activeMap.removeLayer(this.puntosEnEdicion);
				}  			
  			}
  		break;

  		case "LineString":


			if(this.verticesEnEdicion || this.moviendoVertice){
				
				console.log("Quitando vertices");
				this.activeMap.removeLayer(this.verticesEnEdicion);				
			} 
			
			if(this.caminoEnEdicion){
				
				console.log("Quitando el camino");
				this.activeMap.removeLayer(this.caminoEnEdicion);				
			} 

			if(coordenadas.length>1){
				this.levantarCamino(coordenadas);
			}


			console.log("añadiendo por update");

			this.levantarVertices(ev.geom, coordenadas);

			window.localStorage.coordenadas = JSON.stringify(coordenadas);
  		break;  		

  		case "Polygon":

			window.localStorage.coordenadas = JSON.stringify(coordenadas);

			if(this.verticesEnEdicion || this.moviendoVertice) this.activeMap.removeLayer(this.verticesEnEdicion);
			
			if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

			if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);

			if(coordenadas[0].length>1){
				this.levantarCamino(coordenadas[0]);
			}


			console.log("añadiendo por update");

			if(this.caminoCerrado && (coordenadas[0][0][0] == coordenadas[0][coordenadas.length-1][0]) && (coordenadas[0][0][1] == coordenadas[0][coordenadas.length-1][1])){
	
				console.log("Trancando nuevamente");

				this.caminoCerrado = true;
				this.cerrarCamino(coordenadas);
			}
			else{
				if(ev.cerrada){

					console.log("Ajustar trancado");

					this.cerrarCamino(coordenadas);
				}
				else{
					
					console.log("Liberando");
					this.caminoCerrado = false;
				}
			}
			console.log(coordenadas);
			this.levantarVertices(ev.geom, coordenadas);

  		break;
  	}


  }

  cargarGeojson(capaNueva){


  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }  

  cargarGeojsonFromLocal(){

  	let capaNueva = JSON.parse(window.localStorage.capaNueva);
  	console.log(capaNueva);

  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }


  verificarGeojsonExistente(capaNueva){

  	let geoJson;

  	console.log(capaNueva);

  	if(capaNueva.geojson){ 
  		geoJson = capaNueva.geojson;
  	}
  	else{
  		geoJson = capaNueva;
  	}

  	let match = false;

	console.log("Largo: "+geoJson.features.length);
	if (geoJson.features.length == 0){ 
		
		console.log("No hay features");		
	}
	
	this.geoJsons.forEach((element) =>{

  		if(element.nombre == capaNueva.nombre){
  			match = true;
  		}
	});

  	return match;
  }

  addOverlayToControl(capaNueva){

  	let geoJson = capaNueva.geojson;

	switch(geoJson.features[0].geometry.type){

		case 'Polygon':
		case 'MultiPolygon':

			let polygonStyle = function(){
			  return { 
			    fillColor: '#ff0000',
			    weight: 1,
			    opacity: 1,
			    color: 'white',
			    dashArray: '3',
			    fillOpacity: 0.5
			  }
			}

			this.addPolygonLayerToControl(capaNueva, polygonStyle);

		break;

		case 'LineString':
		case 'MultiLineString':

			let lineStyle = function(){
				return {
				    "color": '#08519c',
				    "weight": 5,
				    "opacity": 0.65
				}
			}

			this.addLineLayerToControl(capaNueva, lineStyle);

		break;

		case 'Point':
		case 'MultiPoint':

			let circleStyle = function(){

				return {
				    radius: 8,
				    fillColor: "#ff7800",
				    color: "#000",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
				}

			}

			this.addPointLayerToControl(capaNueva, circleStyle)

		break;

		default:
			
			console.log("Desconocido");

		break;
	} //FIN DEL SWTICH


  }

  addPolygonLayerToControl(capaNueva, estilo){

  	console.log(capaNueva);

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});

		if(feature.geometry.type == "Polygon"){

				let area = document.createElement("li");
				area.innerHTML = "Area (Km2.): "+(Turf.area(feature)/1000000);
				ul.appendChild(area);				

				let dist = 0;

				for(let i = 0, j = feature.geometry.coordinates[0].length-1; i<j; i++){
					
					let p1 = feature.geometry.coordinates[0][i];
					let p2 = feature.geometry.coordinates[0][i+1];

					dist+= Turf.distance(p1, p2);
				}

				let perimetro = document.createElement("li");
				perimetro.innerHTML = "Perimetro (Km.): "+dist;
				ul.appendChild(perimetro);
		}
		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');
	
	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush){

		console.log("No lo meto");
		return false;
	}
	else{

		console.log("Si lo meto");
		this.geoJsons.push(capaNueva);
	}

  }

  addLineLayerToControl(capaNueva, estilo){

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);

	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});

		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');

	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush) return false;

	this.geoJsons.push(capaNueva);
  }

  addPointLayerToControl(capaNueva, estilo){

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk" && element != "latitud" && element != "longitud"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});

				let lat = document.createElement("li");
				lat.innerHTML = "Latitud: "+feature.geometry.coordinates[1];
				ul.appendChild(lat);

				let lng = document.createElement("li");
				lng.innerHTML = "Longitud: "+feature.geometry.coordinates[0];
				ul.appendChild(lng);


		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, estilo);
	    },
	    onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');

	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush) return false;

	this.geoJsons.push(capaNueva);
  }

	montarCapaImportada(){

		let shape = window["archivoConvertidoGeojson"];

		this.addOverlayToControl(shape);


	}

  previsualizarCapa(){

	let shape = window["archivoConvertidoGeojson"];

	let popup = function(feature, layer){

  		let popupdiv = document.createElement("div");

  		let botonConfirmar = document.createElement("button");
		botonConfirmar.setAttribute("class","btn btn-outline-success");
		botonConfirmar.innerHTML = "Aceptar";

		let botonCancelar = document.createElement("button");
		botonCancelar.setAttribute("class","btn btn-outline-danger");
		botonCancelar.innerHTML = "Cancelar";

		layer.bindPopup(popupdiv);
	}

  	this.capaShapefile = L.geoJSON(shape, { onEachFeature: popup }).addTo(this.activeMap);
  }

  filtrarAtributos(){

  	this.atributoFiltrado = "";
  	this.filtroElegido = "";

  	let atributos = this.capas.find((element) =>{return element.nombre == this.layerToFilter}).atributos;
  	this.attributesToFilter = atributos.filter((element) =>{return (element.nombre != "geom")&&(element.nombre != "latitud")&&(element.nombre != "longitud")});
  	console.log(this.attributesToFilter);
  }

  elegirAtributo(){

  	this.filtroElegido = "";

  	this.atributoElegido = this.attributesToFilter.find((element) =>{return element.nombre == this.atributoFiltrado});
  }

  aplicarFiltro(){

  	if(this.overlayMaps[""+this.layerToFilter]){
  		this.activeMap.removeLayer(this.overlayMaps[""+this.layerToFilter]);
  	}

  	let geojson = this.geoJsons.find((element) =>{return element.nombre == this.layerToFilter}).geojson;

  	let features = [];

  	switch(this.filtroElegido){

  		case "mayor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] > this.valorBusqueda});
  		break;

  		case "mayorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] >= this.valorBusqueda});
  		break;

  		case "menor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] < this.valorBusqueda});
  		break;

  		case "menorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] <= this.valorBusqueda});
  		break;

  		case "igual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] == this.valorBusqueda});
  		break;

  		case "diferente":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] != this.valorBusqueda});
  		break;
  	}

  	let capaNueva = {
  		"nombre": this.layerToFilter,
  		"geojson": {
  			"type": geojson.type,
  			"features": features
  		},
  		"dontpush": true
  	}

  	console.log(capaNueva);
	this.addOverlayToControl(capaNueva);
  }

  refrescarMapa(evento){

  	console.log(evento);

	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

  	this.activeMap.removeLayer(this.overlayMaps[""+evento.nombre]);

  	evento.dontpush = true;

	this.addOverlayToControl(evento);
  }
  
///////////////////////////////////////
/////TRAIDO DE DATOS COMPONENT/////////
///////////////////////////////////////


  paginarCapa(){

  	this.capaPaginada = [];

  	for(let i = 0, j = this.capaActiva.geojson.features.length, k = 0; i<j; i++){

  		if(i%5==0){

  			this.capaPaginada.push([]);
  			k++;
  		}

  		this.capaPaginada[k-1].push(this.capaActiva.geojson.features[i]);
  	}

  	this.numeroPagina = 0;
  	this.paginaActiva = this.capaPaginada[this.numeroPagina];

  }

  seleccionarCapa(){

	if(this.geoJsons.find((element) =>{return element.nombre == this.capa})){

	  	let estruct = this.estructuras.find((element) =>{return element.nombre == this.capa});
	  	this.estructuraActiva = estruct.atributos.filter((element) =>{return element.nombre != "geom"});
	  	this.capaActiva = this.geoJsons.find((element) =>{return element.nombre == this.capa});
	  	this.paginarCapa();
	}
	else{
		
		this.capaPaginada = [];		
	}
  }

  retrocederPagina(){

	this.numeroPagina--;
	this.paginaActiva = this.capaPaginada[this.numeroPagina];
  }
  avanzarPagina(){

	this.numeroPagina++;
	this.paginaActiva = this.capaPaginada[this.numeroPagina];
  }

  open(content) {

	if( !this.geoJsons.find((element) =>{return element.nombre == this.capa}) ){
		this.shout("Primero debe montar la capa antes de ver los datos","alert-warning",4000);
	}
	else{

	    this.modalService.open(content).result.then((result) => {
			this.modalAbierta = true;
	    }, (reason) => {
	
	    });
		
	}
  }

	tomarFoto(){
		
		this.shout("Espere un momento mientras su imagen es capturada", "alert-info", 3000);
		this.loading = true;
		
		let init = this;
		
		leafletImage(this.activeMap, function(err, canvas){
		
			var img = document.createElement("img");
			var size = init.activeMap.getSize();
		
			img.width = size.x;
			img.height = size.y;

			img.src = canvas.toDataURL();
			
			let init2 = init;
			
			img.addEventListener("load", function(ev){
				
				init2.dibujarFoto(img);
				init2.fotoDibujada = true;
				init2.loading = false;
				init2.foto = img;
			})
		});
	}
	
	dibujarFoto(img){

		var canvas = document.createElement("canvas");
		canvas.setAttribute("id","myCanvas");
		canvas.width = 150;
		canvas.height = 150;

		var ctx = canvas.getContext("2d");
		

		if(!document.getElementById("myCanvas")){
			document.getElementById("fotoCanvas").appendChild(canvas);
		}
			
		ctx.drawImage(img, 0, 0, 150, 150);
	}
	
	descargarFoto(){

		var link = document.createElement("a");
		link.href = this.foto.src;
		link.download = 'Download.jpg';
		link.click();
		
	}

}
