import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'
import { CategoriasService } from '../../../services/categorias/categorias.service'

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-datos',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})

export class AgregarDatosComponent implements OnInit {


	@Input() categorias;
  @Input() estructuras;
  @Input() capas;
  @Input() capasActivas;
	@Input() capaElegida;

  @Input() figura;
  @Input() color;
  @Input() registros;

  @Output() agregarTerminado = new EventEmitter<any>();
  @Output() capaCerrada = new EventEmitter<any>();
	@Output() coordenadaActualizada = new EventEmitter<any>();

	categoria: any;
	capa: any;
	capaActiva: any;
	capasFiltradas: any;
  coordenadaNueva: any;
  capaNueva: any;

  atributos: any;

  checkCoordVar: any;

  loading: boolean;

  estructuraActiva: any;

  iconos: string[];

  modalRef: any;

  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService,
        private modalService: NgbModal) {}

  ngOnInit() {

  	eval("window.yo2 = this");

    this.inicializarIconos();

    this.loading = false;
    this.atributos = {};

  	this.categoria = "";
  	this.capa = "";
  	this.capasFiltradas = [];

    let estruct = this.estructuras.find((element) =>{return element.nombre == this.capaElegida.nombre});
    this.elegirCapa(estruct);

    this.coordenadaNueva = {
      longitud: 0,
      latitud: 0
    };

  }


  checkCoordFunction(){

    let add = this;

    function check(){

      if(window.localStorage.coordenadas){

        let coordenadas = window.localStorage.coordenadas;
        let coordenadas2 = JSON.stringify(add.capaActiva.coordenadas);
        if (coordenadas != coordenadas2){
          console.log(coordenadas);
          add.capaActiva.coordenadas = JSON.parse(coordenadas);
        }
        add.evaluarCierre();
      }
    }

    this.checkCoordVar = setInterval(check, 500);
  }

  checkCoord(este){
      console.log("Quiero entrar");
    if(window.localStorage.coordenadas){
      console.log("Entre");
      este.capaActiva.coordenadas = JSON.parse(window.localStorage.coordenadas);
      este.evaluarCierre();
    }
  }


  filtrarCapas(){

    if(this.checkCoordVar) clearInterval(this.checkCoordVar);
  	
    this.capaActiva = {};
    this.atributos = {};

    this.capasFiltradas = this.capas.filter((element) =>{return element.categoria.id == this.categoria});
  }

  elegirCapa(estruct){

    if(this.checkCoordVar) clearInterval(this.checkCoordVar);

  	this.capaActiva = estruct;
    this.estructuraActiva = estruct.atributos.filter((element) =>{return element.nombre != "geom"});

    this.atributos = {};

    this.capaActiva.atributos.forEach((element) =>{
      if(element.nombre!='geom'){
        if(element.nombre == "figura" || element.nombre == "color"){
          this.atributos[""+element.nombre] = element.tipo;
        }
        else{
          this.atributos[""+element.nombre] = element.tipo == 'Text' ?  "" : 0;
        }
      }
    });

    this.capaActiva.cerrada = false;
    this.ambientarCoordenadas();  
  
    window.localStorage.capaActiva = JSON.stringify(this.capaActiva);

    this.checkCoordFunction();
  }

  ambientarCoordenadas(){
    
    if(window.localStorage.coordenadas) window.localStorage.removeItem("coordenadas");


    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = [];
      break;

      case "LineString":

        this.capaActiva.coordenadas = [];
      break;

      case "Polygon":

        this.capaActiva.coordenadas = [
          [
          ]
        ]
      break;

    }

    window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);

  }

  evaluarCierre(){

    console.log(this.capaActiva.geometria);

    switch(this.capaActiva.geometria){

      case "Point":

        if(this.capaActiva.coordenadas.length){
          this.capaActiva.cerrada = true;
        }
        else{
          this.capaActiva.cerrada = false;        
        }
      break;      

      case "LineString":

        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        let largo = this.capaActiva.coordenadas[0].length;

        if(!largo){

          this.capaActiva.cerrada = false;        
        }
        else{

          if(largo < 3){

            this.capaActiva.cerrada = false;        
          }
          else{

            let ln1 = this.capaActiva.coordenadas[0][0][0];
            let lt1 = this.capaActiva.coordenadas[0][0][1];
            let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
            let lt2 = this.capaActiva.coordenadas[0][largo-1][1];

            if( (ln1 == ln2) && (lt1 == lt2) ){
              this.capaActiva.cerrada = true;
              this.capaCerrada.emit(true);
            }
            else{
              this.capaActiva.cerrada = false;
            }

          }
        }

      break;

    }
  }

  evaluarApertura(){

    switch(this.capaActiva.geometria){

      case "Point":

        console.log("Entre en Point");
        this.capaActiva.cerrada = false;
      break;      

      case "LineString":

        console.log("Entre en LineString");
        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        console.log("Entre en Polygon");
        let largo = this.capaActiva.coordenadas[0].length;

        if(largo == 1) return false;

        let ln1 = this.capaActiva.coordenadas[0][0][0];
        let lt1 = this.capaActiva.coordenadas[0][0][1];
        let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
        let lt2 = this.capaActiva.coordenadas[0][largo-1][1];
        if( (ln1 != ln2) || (lt1 != lt2) ){
          this.capaActiva.cerrada = false;
        }
        else{
          this.capaActiva.cerrada = true;
        }
      break;

    }  }

  agregarCoordenada(lng, lat){


    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = [lng, lat];
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

      case "LineString":

        this.capaActiva.coordenadas.push([lng, lat]);
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

      case "Polygon":

        this.capaActiva.coordenadas[0].push([lng, lat]);
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

    }

    this.coordenadaNueva.longitud = 0;
    this.coordenadaNueva.latitud = 0;

    this.evaluarCierre();
    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "add", cerrada: this.capaActiva.cerrada});

  }

  removerCoordenada(pos){

    let coordenadas = [];
    let i = 0;
    console.log(this.capaActiva.coordenadas);

    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = coordenadas;
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);

      break;

      case "LineString":
    
        this.capaActiva.coordenadas.forEach((element) =>{

          if(i != pos){
            coordenadas.push(element);
          }

          i++;
        });
        this.capaActiva.coordenadas = coordenadas;
        window.localStorage.coordenadas = JSON.stringify(coordenadas);

      break;

      case "Polygon":

        coordenadas.push([]);

        this.capaActiva.coordenadas[0].forEach((element) =>{

          if(i != pos){
            coordenadas[0].push(element);
          }

          i++;
        });

        this.capaActiva.coordenadas = coordenadas;

        window.localStorage.coordenadas = JSON.stringify(coordenadas);

      break;

    }

    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "remove"});
    this.evaluarApertura();
  }


  bajarCoordenada(pos){

    let coord1;
    let coord2;

    if(this.capaActiva.tipo == "LineString"){

      coord1 = [this.capaActiva.coordenadas[pos][0],this.capaActiva.coordenadas[pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[pos+1][0], this.capaActiva.coordenadas[pos+1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos+1);
    
    }    

    if(this.capaActiva.tipo == "Polygon"){

      coord1 = [this.capaActiva.coordenadas[0][pos][0],this.capaActiva.coordenadas[0][pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[0][pos+1][0], this.capaActiva.coordenadas[0][pos+1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos+1);
    
    }
  }

  subirCoordenada(pos){

    let coord1;
    let coord2;

    if(this.capaActiva.tipo == "LineString"){

      coord1 = [this.capaActiva.coordenadas[pos][0],this.capaActiva.coordenadas[pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[pos-1][0], this.capaActiva.coordenadas[pos-1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos-1);
    
    }    

    if(this.capaActiva.tipo == "Polygon"){

      coord1 = [this.capaActiva.coordenadas[0][pos][0],this.capaActiva.coordenadas[0][pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[0][pos-1][0], this.capaActiva.coordenadas[0][pos-1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos-1);
    
    }

  }

  intercambiarCoordenadas(coord1, coord2, pos, pos2){

    if(this.capaActiva.tipo == "LineString"){

      this.capaActiva.coordenadas[pos] = coord2;
      this.capaActiva.coordenadas[pos2] = coord1;
    }

    if(this.capaActiva.tipo == "Polygon"){

      this.capaActiva.coordenadas[0][pos] = coord2;
      this.capaActiva.coordenadas[0][pos2] = coord1;
    }

    window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "remove"});
    this.evaluarApertura();
    this.evaluarCierre();

  }

  agregarDato(){

  console.log(this.capaActiva);
  console.log(this.atributos);

    this.atributos.nuevo = true;
    
    if(this.capaActiva.tipo == "Point"){
      
      if(this.figura == ""){
        return false;
      }
      if(this.color == ""){
        return false;
      }
      this.atributos["figura"] = this.figura;
      this.atributos["color"] = this.color;
    }
    if(this.capaActiva.tipo == "MultiPoint"){

      if(this.figura == ""){
        return false;
      }
      if(this.color == ""){
        return false;
      }
      this.atributos["figura"] = this.figura;
      this.atributos["color"] = this.color;
    }

    let datos = {
      "nombre": this.capaActiva.nombre,
      "geojson": {
        "type": "FeatureCollection",
        "features": [{
          "type": "feature",
          "geometry": {
            "type": this.capaActiva.tipo,
            "coordinates": this.capaActiva.coordenadas
          },
          "properties": this.atributos,
        }]
      }
    }

    console.log(datos);

    this.loading = true;
    this.capasService.editarDatos(datos).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){

          window.localStorage.removeItem("capaActiva");
          window.localStorage.lastLayer = this.capaActiva.nombre;
          this.terminarAgregar({"nombre": this.capaActiva.nombre, "geojson": data.body});
        }
        else{


        }
      },
      error => {
       this.loading = false;
       console.log(error);
      }
    );
  }

  terminarAgregar(evento){

    if(!evento){

    }
    clearInterval(this.checkCoordVar);
    this.agregarTerminado.emit(evento);
  }


  inicializarIconos(){

    this.iconos = [
"500px",
"address-book",
"address-book-o",
"address-card",
"address-card-o",
"adjust",
"adn",
"align-center",
"align-justify",
"align-left",
"align-right",
"amazon",
"ambulance",
"american-sign-language-interpreting",
"anchor",
"android",
"angellist",
"angle-double-down",
"angle-double-left",
"angle-double-right",
"angle-double-up",
"angle-down",
"angle-left",
"angle-right",
"angle-up",
"apple",
"archive",
"area-chart",
"arrow-circle-down",
"arrow-circle-left",
"arrow-circle-o-down",
"arrow-circle-o-left",
"arrow-circle-o-right",
"arrow-circle-o-up",
"arrow-circle-right",
"arrow-circle-up",
"arrow-down",
"arrow-left",
"arrow-right",
"arrow-up",
"arrows",
"arrows-alt",
"arrows-h",
"arrows-v",
"asl-interpreting",
"assistive-listening-systems",
"asterisk",
"at",
"audio-description",
"automobile",
"backward",
"balance-scale",
"ban",
"bandcamp",
"bank",
"bar-chart",
"bar-chart-o",
"barcode",
"bars",
"bath",
"bathtub",
"battery",
"battery-0",
"battery-1",
"battery-2",
"battery-3",
"battery-4",
"battery-empty",
"battery-full",
"battery-half",
"battery-quarter",
"battery-three-quarters",
"bed",
"beer",
"behance",
"behance-square",
"bell",
"bell-o",
"bell-slash",
"bell-slash-o",
"bicycle",
"binoculars",
"birthday-cake",
"bitbucket",
"bitbucket-square",
"bitcoin",
"black-tie",
"blind",
"bluetooth",
"bluetooth-b",
"bold",
"bolt",
"bomb",
"book",
"bookmark",
"bookmark-o",
"braille",
"briefcase",
"btc",
"bug",
"building",
"building-o",
"bullhorn",
"bullseye",
"bus",
"buysellads",
"cab",
"calculator",
"calendar",
"calendar-check-o",
"calendar-minus-o",
"calendar-o",
"calendar-plus-o",
"calendar-times-o",
"camera",
"camera-retro",
"car",
"caret-down",
"caret-left",
"caret-right",
"caret-square-o-down",
"caret-square-o-left",
"caret-square-o-right",
"caret-square-o-up",
"caret-up",
"cart-arrow-down",
"cart-plus",
"cc",
"cc-amex",
"cc-diners-club",
"cc-discover",
"cc-jcb",
"cc-mastercard",
"cc-paypal",
"cc-stripe",
"cc-visa",
"certificate",
"chain",
"chain-broken",
"check",
"check-circle",
"check-circle-o",
"check-square",
"check-square-o",
"chevron-circle-down",
"chevron-circle-left",
"chevron-circle-right",
"chevron-circle-up",
"chevron-down",
"chevron-left",
"chevron-right",
"chevron-up",
"child",
"chrome",
"circle",
"circle-o",
"circle-o-notch",
"circle-thin",
"clipboard",
"clock-o",
"clone",
"close",
"cloud",
"cloud-download",
"cloud-upload",
"cny",
"code",
"code-fork",
"codepen",
"codiepie",
"coffee",
"cog",
"cogs",
"columns",
"comment",
"comment-o",
"commenting",
"commenting-o",
"comments",
"comments-o",
"compass",
"compress",
"connectdevelop",
"contao",
"copy",
"copyright",
"creative-commons",
"credit-card",
"credit-card-alt",
"crop",
"crosshairs",
"css3",
"cube",
"cubes",
"cut",
"cutlery",
"dashboard",
"dashcube",
"database",
"deaf",
"deafness",
"dedent",
"delicious",
"desktop",
"deviantart",
"diamond",
"digg",
"dollar",
"dot-circle-o",
"download",
"dribbble",
"drivers-license",
"drivers-license-o",
"dropbox",
"drupal",
"edge",
"edit",
"eercast",
"eject",
"ellipsis-h",
"ellipsis-v",
"empire",
"envelope",
"envelope-o",
"envelope-open",
"envelope-open-o",
"envelope-square",
"envira",
"eraser",
"etsy",
"eur",
"euro",
"exchange",
"exclamation",
"exclamation-circle",
"exclamation-triangle",
"expand",
"expeditedssl",
"external-link",
"external-link-square",
"eye",
"eye-slash",
"eyedropper",
"fa",
"facebook",
"facebook-f",
"facebook-official",
"facebook-square",
"fast-backward",
"fast-forward",
"fax",
"feed",
"female",
"fighter-jet",
"file",
"file-archive-o",
"file-audio-o",
"file-code-o",
"file-excel-o",
"file-image-o",
"file-movie-o",
"file-o",
"file-pdf-o",
"file-photo-o",
"file-picture-o",
"file-powerpoint-o",
"file-sound-o",
"file-text",
"file-text-o",
"file-video-o",
"file-word-o",
"file-zip-o",
"files-o",
"film",
"filter",
"fire",
"fire-extinguisher",
"firefox",
"first-order",
"flag",
"flag-checkered",
"flag-o",
"flash",
"flask",
"flickr",
"floppy-o",
"folder",
"folder-o",
"folder-open",
"folder-open-o",
"font",
"font-awesome",
"fonticons",
"fort-awesome",
"forumbee",
"forward",
"foursquare",
"free-code-camp",
"frown-o",
"futbol-o",
"gamepad",
"gavel",
"gbp",
"ge",
"gear",
"gears",
"genderless",
"get-pocket",
"gg",
"gg-circle",
"gift",
"git",
"git-square",
"github",
"github-alt",
"github-square",
"gitlab",
"gittip",
"glass",
"glide",
"glide-g",
"globe",
"google",
"google-plus",
"google-plus-circle",
"google-plus-official",
"google-plus-square",
"google-wallet",
"graduation-cap",
"gratipay",
"grav",
"group",
"h-square",
"hacker-news",
"hand-grab-o",
"hand-lizard-o",
"hand-o-down",
"hand-o-left",
"hand-o-right",
"hand-o-up",
"hand-paper-o",
"hand-peace-o",
"hand-pointer-o",
"hand-rock-o",
"hand-scissors-o",
"hand-spock-o",
"hand-stop-o",
"handshake-o",
"hard-of-hearing",
"hashtag",
"hdd-o",
"header",
"headphones",
"heart",
"heart-o",
"heartbeat",
"history",
"home",
"hospital-o",
"hotel",
"hourglass",
"hourglass-1",
"hourglass-2",
"hourglass-3",
"hourglass-end",
"hourglass-half",
"hourglass-o",
"hourglass-start",
"houzz",
"html5",
"i-cursor",
"id-badge",
"id-card",
"id-card-o",
"ils",
"image",
"imdb",
"inbox",
"indent",
"industry",
"info",
"info-circle",
"inr",
"instagram",
"institution",
"internet-explorer",
"intersex",
"ioxhost",
"italic",
"joomla",
"jpy",
"jsfiddle",
"key",
"keyboard-o",
"krw",
"language",
"laptop",
"lastfm",
"lastfm-square",
"leaf",
"leanpub",
"legal",
"lemon-o",
"level-down",
"level-up",
"life-bouy",
"life-buoy",
"life-ring",
"life-saver",
"lightbulb-o",
"line-chart",
"link",
"linkedin",
"linkedin-square",
"linode",
"linux",
"list",
"list-alt",
"list-ol",
"list-ul",
"location-arrow",
"lock",
"long-arrow-down",
"long-arrow-left",
"long-arrow-right",
"long-arrow-up",
"low-vision",
"magic",
"magnet",
"mail-forward",
"mail-reply",
"mail-reply-all",
"male",
"map",
"map-marker",
"map-o",
"map-pin",
"map-signs",
"mars",
"mars-double",
"mars-stroke",
"mars-stroke-h",
"mars-stroke-v",
"maxcdn",
"meanpath",
"medium",
"medkit",
"meetup",
"meh-o",
"mercury",
"microchip",
"microphone",
"microphone-slash",
"minus",
"minus-circle",
"minus-square",
"minus-square-o",
"mixcloud",
"mobile",
"mobile-phone",
"modx",
"money",
"moon-o",
"mortar-board",
"motorcycle",
"mouse-pointer",
"music",
"navicon",
"neuter",
"newspaper-o",
"object-group",
"object-ungroup",
"odnoklassniki",
"odnoklassniki-square",
"opencart",
"openid",
"opera",
"optin-monster",
"outdent",
"pagelines",
"paint-brush",
"paper-plane",
"paper-plane-o",
"paperclip",
"paragraph",
"paste",
"pause",
"pause-circle",
"pause-circle-o",
"paw",
"paypal",
"pencil",
"pencil-square",
"pencil-square-o",
"percent",
"phone",
"phone-square",
"photo",
"picture-o",
"pie-chart",
"pied-piper",
"pied-piper-alt",
"pied-piper-pp",
"pinterest",
"pinterest-p",
"pinterest-square",
"plane",
"play",
"play-circle",
"play-circle-o",
"plug",
"plus",
"plus-circle",
"plus-square",
"plus-square-o",
"podcast",
"power-off",
"print",
"product-hunt",
"puzzle-piece",
"qq",
"qrcode",
"question",
"question-circle",
"question-circle-o",
"quora",
"quote-left",
"quote-right",
"ra",
"random",
"ravelry",
"rebel",
"recycle",
"reddit",
"reddit-alien",
"reddit-square",
"refresh",
"registered",
"remove",
"renren",
"reorder",
"repeat",
"reply",
"reply-all",
"resistance",
"retweet",
"rmb",
"road",
"rocket",
"rotate-left",
"rotate-right",
"rouble",
"rss",
"rss-square",
"rub",
"ruble",
"rupee",
"s15",
"safari",
"save",
"scissors",
"scribd",
"search",
"search-minus",
"search-plus",
"sellsy",
"send",
"send-o",
"server",
"share",
"share-alt",
"share-alt-square",
"share-square",
"share-square-o",
"shekel",
"sheqel",
"shield",
"ship",
"shirtsinbulk",
"shopping-bag",
"shopping-basket",
"shopping-cart",
"shower",
"sign-in",
"sign-language",
"sign-out",
"signal",
"signing",
"simplybuilt",
"sitemap",
"skyatlas",
"skype",
"slack",
"sliders",
"slideshare",
"smile-o",
"snapchat",
"snapchat-ghost",
"snapchat-square",
"snowflake-o",
"soccer-ball-o",
"sort",
"sort-alpha-asc",
"sort-alpha-desc",
"sort-amount-asc",
"sort-amount-desc",
"sort-asc",
"sort-desc",
"sort-down",
"sort-numeric-asc",
"sort-numeric-desc",
"sort-up",
"soundcloud",
"space-shuttle",
"spinner",
"spoon",
"spotify",
"square",
"square-o",
"stack-exchange",
"stack-overflow",
"star",
"star-half",
"star-half-empty",
"star-half-full",
"star-half-o",
"star-o",
"steam",
"steam-square",
"step-backward",
"step-forward",
"stethoscope",
"sticky-note",
"sticky-note-o",
"stop",
"stop-circle",
"stop-circle-o",
"street-view",
"strikethrough",
"stumbleupon",
"stumbleupon-circle",
"subscript",
"subway",
"suitcase",
"sun-o",
"superpowers",
"superscript",
"support",
"table",
"tablet",
"tachometer",
"tag",
"tags",
"tasks",
"taxi",
"telegram",
"television",
"tencent-weibo",
"terminal",
"text-height",
"text-width",
"th",
"th-large",
"th-list",
"themeisle",
"thermometer",
"thermometer-0",
"thermometer-1",
"thermometer-2",
"thermometer-3",
"thermometer-4",
"thermometer-empty",
"thermometer-full",
"thermometer-half",
"thermometer-quarter",
"thermometer-three-quarters",
"thumb-tack",
"thumbs-down",
"thumbs-o-down",
"thumbs-o-up",
"thumbs-up",
"ticket",
"times",
"times-circle",
"times-circle-o",
"times-rectangle",
"times-rectangle-o",
"tint",
"toggle-down",
"toggle-left",
"toggle-off",
"toggle-on",
"toggle-right",
"toggle-up",
"trademark",
"train",
"transgender",
"transgender-alt",
"trash",
"trash-o",
"tree",
"trello",
"tripadvisor",
"trophy",
"truck",
"try",
"tty",
"tumblr",
"tumblr-square",
"turkish-lira",
"tv",
"twitch",
"twitter",
"twitter-square",
"umbrella",
"underline",
"undo",
"universal-access",
"university",
"unlink",
"unlock",
"unlock-alt",
"unsorted",
"upload",
"usb",
"usd",
"user",
"user-circle",
"user-circle-o",
"user-md",
"user-o",
"user-plus",
"user-secret",
"user-times",
"users",
"vcard",
"vcard-o",
"venus",
"venus-double",
"venus-mars",
"viacoin",
"viadeo",
"viadeo-square",
"video-camera",
"vimeo",
"vimeo-square",
"vine",
"vk",
"volume-control-phone",
"volume-down",
"volume-off",
"volume-up",
"warning",
"wechat",
"weibo",
"weixin",
"whatsapp",
"wheelchair",
"wheelchair-alt",
"wifi",
"wikipedia-w",
"window-close",
"window-close-o",
"window-maximize",
"window-minimize",
"window-restore",
"windows",
"won",
"wordpress",
"wpbeginner",
"wpexplorer",
"wpforms",
"wrench",
"xing",
"xing-square",
"y-combinator",
"y-combinator-square",
"yahoo",
"yc",
"yc-square",
"yelp",
"yen",
"yoast",
"youtube",
"youtube-play",
"youtube-square"];

  }

  open(content) {

    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {

      console.log("Saludos");

    }, (reason) => {

    });
  }

  elegirIcono(icono){
    this.figura = icono;
    this.modalRef.close();
  }


}
