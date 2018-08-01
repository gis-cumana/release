import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Message} from 'primeng/components/common/api';

import { Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../services/capas/capas.service'
import { CategoriasService } from '../../services/categorias/categorias.service'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  providers: [NgbDropdownConfig],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = true;

  categorias: any;
  capas: any;
///
  capasPresentes: any[];
///
  capasFiltradas: any;

  display: boolean = false;
  registro: boolean = false;
  recover: boolean = false;
  logged: boolean = false;
  email: any;
  nombre: any;
  apellido: any;
  password: any;
  msgs: Message[] = [];
  loading: boolean = false;
  user_logged = "Usurario";

  filterOpen: boolean;
  distanceOpen: boolean;
  areaOpen: boolean;
  pointOpen: boolean;

  constructor(private router: Router, 
              private authService: AuthService,
              private capasService: CapasService, 
              private categoriasService: CategoriasService, 
              private modalService: NgbModal,
              config: NgbDropdownConfig) { 

                config.autoClose = false;
              }

  ngOnInit() {
    
    eval("window.yo3 = this");

    this.filterOpen = false;
    this.distanceOpen = false;
    this.areaOpen = false;
    this.pointOpen = false;

    
    this.is_autenticate();

    this.capasPresentes = [];

    window.localStorage.categorias = JSON.stringify([]);
    window.localStorage.capas = JSON.stringify([]);

    this.categorias = [];
    this.capas = [];
    this.capasFiltradas = [];

    var nav;
    eval("nav = this")

    function cargar(yo){
      nav.montarDatos();
    }

    function cargarFunction(){
      let cargarVar = setInterval(cargar, 1000);
    }

    cargarFunction();
    
  }


    showRegister() {
        this.registro = false;
        this.display = true;
    }

    showLogin() {
        this.display = false;
        this.recover = false;
        this.registro = true;
    }

    showRecover() {
        this.registro = false;
        this.recover = true;
    }

    is_autenticate(){
      let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user != null){
        this.logged = true;
        this.user_logged = user.nombre;
      }else{
        this.logged = false;
      }
    }

    login(){
        this.msgs = [];
        if (this.validar())
        {
        this.loading = true;
        let user = {
          "email": this.email,
          "password": this.password
        };

        this.authService.login(user).subscribe(data =>{
           this.loading = false;
           let header = "basic "+btoa(user.email+":"+user.password);
           this.authService.info(header).subscribe(data =>{
              let datos = data.body;
              this.registro = false;
              console.log(data);
              let key = {
              "header": header,
              "nombre": datos.first_name,
              "apellido": datos.last_name,
              "email": user.email
             }

             this.password = "";
             this.email = "";

             localStorage.setItem("currentUser", JSON.stringify(key));
             this.is_autenticate();
           },error => {
              console.log(error);
           });
          },
          error => {
            console.log(error);
            this.msgs.push({severity:'error', summary:'Datos incorrectos', detail:''});
            this.loading = false;
            this.password = "";
          });
      }

    }

    validar(){
    let res = true;
      if (this.email == null){
        res = false;
        this.msgs.push({severity:'error', summary:'Email', detail:'es requerido'});
      }
      if (this.password == null){
        res = false;
        this.msgs.push({severity:'error', summary:'Clave', detail:'es requerida'});
      }
      return res;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['/']);
        this.is_autenticate();
    }

    register(){
      this.msgs = [];
        this.loading = true;
        let user = {
          "username": this.email,
          "email": this.email,
          "password1": this.password,
          "password2": this.password,
          "first_name": this.nombre,
          "last_name": this.apellido
        };

        this.authService.register(user).subscribe(data =>{
           this.loading = false;
           let header = "basic "+btoa(user.email+":"+user.password1);
           this.authService.update(header, user).subscribe(data =>{
              let datos = data.body;
              this.display = false;
              let key = {
              "header": header,
              "nombre": datos.first_name,
              "apellido": datos.last_name,
              "email": user.email
             }

             localStorage.setItem("currentUser", JSON.stringify(key));
             this.is_autenticate();
           },error => {
              this.msgs.push({severity:'error', summary:'Datos incorrectos', detail:error});
              console.log(error);
           });
          },
          error => {
            console.log(error);
            this.msgs.push({severity:'error', summary:'Datos incorrectos', detail:''});
            this.loading = false;
            this.password = "";
          });
    }
///////////
/////////////
//////////////


  collapse(){
  	this.isCollapsed = !this.isCollapsed;
  	return this.isCollapsed;
  }

  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
      
    });
  }

  limpiarCapasFiltradas(ev){
    this.capasFiltradas = [];
    if(ev.nextState){

      setTimeout(()=>{

        let boton = <HTMLElement>document.querySelector("#"+ev.panelId+" button.btn-filter");
        boton.click();
      },100);
    }
  }

  cargarGeojson(evento){

    let nav = this;

    let fr = new FileReader();
    
    fr.addEventListener("load", (e)=>{

      let geoJson = JSON.parse(e.target["result"]);
      window.localStorage.geojsonToLoad = JSON.stringify(geoJson);
    }, false);

    fr.readAsText(evento.target.files[0]);

  }

  importGeojson(geojson){

    this.loading = true;
    this.capasService.importar(geojson).subscribe(data =>{
    this.loading = false;
    window.localStorage.removeItem("geojsonToLoad");

        if(data.status == 200){     

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

  filtrarCapas(catId){

    window.localStorage.categoriaActiva = JSON.stringify(catId);
    console.log(catId);
    this.capasFiltradas = this.capas.filter((element) =>{return element.categoria.id == catId});
  }

  montarDatos(){

    if(window.localStorage.categorias){
    
      this.categorias = JSON.parse(window.localStorage.categorias);
    }
    if(window.localStorage.capas){

      this.capas = JSON.parse(window.localStorage.capas);
    }

  }



  traerCapa(nombre){

    console.log(nombre);
    
    let guardada = this.capasPresentes.findIndex((el)=>{return el.nombre == nombre});
    
    if(guardada >= 0){
        
      window.localStorage.capaNueva = JSON.stringify(this.capasPresentes[guardada]);
      document.getElementById("mostrarCapaNueva").click();
      return false;
    }

    this.loading = true;
    this.capasService.traer(nombre).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){     

          let capaNueva = {
            geojson: data.body,
            nombre: nombre
          }

          window.localStorage.capaNueva = JSON.stringify(capaNueva);
          document.getElementById("mostrarCapaNueva").click();
          if(!this.capasPresentes.find((el)=>{return el.nombre == capaNueva.nombre})){
            this.capasPresentes.push(capaNueva);
          }
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

  isRouteMapa(){
    
    if(this.router.url == "/mapa"){
      return true;
    }
    else{
      return false;
    }
  }
/*
  shout(mensaje, estilo, tiempo){
    this.flashMessage.show(mensaje, { cssClass: estilo, timeout: tiempo });
  }

  verificarElementos(el){

    let ready = false;
    let mensaje = "";

      this.shout(mensaje, "alert-warning", 2000);
    this.flashMessage.show(mensaje, { cssClass: "alert-danger", timeout: 5000 });
    alert("Auxilio");
    
    if(el == 'cap'){
      if(this.capasFiltradas.length > 0){ready = true;}
      else{ mensaje = "Elija una categoria primero" }
    }

    if(el == 'cat'){
      if(this.categorias.length > 0){ ready = true; }
      else{ mensaje = "Aun no hay elementos de esta lista, espere un momento" }
    }

    if(!ready){
      this.shout(mensaje, "alert-warning", 2000);
    }

  }
*/


  isLayerSelected(nombre){

    if(!window.localStorage.capasActivas){

      return false;
    }else{

      let capas = JSON.parse(window.localStorage.capasActivas);

      if(capas.find((capa)=>{return capa == nombre})){

        return true;
      }
      else{

        return false;
      }

    }

  }

  openMapFilter(){

    let boton = <HTMLElement>document.querySelector("#openMapFilter");
    boton.click();
  }

  openMapDistance(){

    if(!this.distanceOpen){

      if(this.areaOpen){
        this.openMapArea();
      }
      if(this.pointOpen){
        this.openMapPoint();
      }
    }

    let boton = <HTMLElement>document.querySelector("#openMapDistance");
    boton.click();
    this.distanceOpen = !this.distanceOpen;
  }

  openMapArea(){

    if(!this.areaOpen){

      if(this.distanceOpen){
        this.openMapDistance();
      }
      if(this.pointOpen){
        this.openMapPoint();
      }
    }


    let boton = <HTMLElement>document.querySelector("#openMapArea");
    boton.click();
    this.areaOpen = !this.areaOpen;
  }

  openMapPoint(){

    if(!this.pointOpen){

      if(this.distanceOpen){
        this.openMapDistance();
      }
      if(this.areaOpen){
        this.openMapArea();
      }
    }

    let boton = <HTMLElement>document.querySelector("#openMapPoint");
    boton.click();
    this.pointOpen = !this.pointOpen;
  }

}