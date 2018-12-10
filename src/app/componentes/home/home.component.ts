import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Message} from 'primeng/components/common/api';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: any[];

  email: string;
  password: string;

  msgs: Message[] = [];

  logged: boolean;
  user_logged: string;

  constructor(private flashMessage: FlashMessagesService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
        this.is_autenticate();
        this.user_logged = "";
        this.email = "";
        this.password = "";
        this.images = [];
        this.images.push({source:'assets/images/indio.jpg', title:'El indio de Cumaná'});
        this.images.push({source:'assets/images/altagracia.jpg', title:'Calle el alacrán'});
        this.images.push({source:'assets/images/arriba.jpg', title:'Cumaná'});
  }

  toggleSidebar(event){

    let el = <HTMLElement>document.querySelector(".my-sidebar");
    let target = <HTMLElement>(event.target.nodeName == "BUTTON" ? event.target : event.target.parentNode);
    if(el.classList.contains("reveal")){
      el.classList.remove("reveal");
      target.classList.remove("reveal");
    }
    else{
      el.classList.add("reveal");
      target.classList.add("reveal");
    }
  }

  open(content) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
      
    });
  }


    login(){

        let usuarios = [
        {
          "email": "rojojorge@gmail.com",
          "password": "04163200906",
          "nombre": "Jorge",
          "apellido": "Rojas",
          "admin": true
        },{
          "email": "luismrodriguezf@gmail.com",
          "password": "04168945712",
          "nombre": "Luis",
          "apellido": "Rodriguez",
          "admin": true
        },{
          "email": "benjamin.s1.e@gmail.com",
          "password": "04160337683",
          "nombre": "Benjamin",
          "apellido": "Escobar",
          "admin": true
        },{
          "email": "adminbid@gmail.com",
          "password": "123456",
          "nombre": "Banco Interamericano de Desarrollo",
          "apellido": "",
          "admin": true
        },{
          "email": "usuario@gmail.com",
          "password": "123456",
          "nombre": "Usuario",
          "apellido": "Comun",
          "admin": false
        }]

        this.msgs = [];
        if (this.validar()){
 
        let user = {
          "email": this.email,
          "password": this.password
        };

        if(usuarios.find((el)=>{return (el.email == this.email)&&(el.password == this.password)})){

          //Entra

              let header = "basic "+btoa(this.email+":"+this.password);
              let datos = usuarios.find((el)=>{return (el.email == this.email)&&(el.password == this.password)});

              let key = {
                "header": header,
                "nombre": datos.nombre,
                "apellido": datos.apellido,
                "email": datos.email,
                "admin": datos.admin
              }

             this.password = "";
             this.email = "";

             localStorage.setItem("currentUser", JSON.stringify(key));
             this.is_autenticate();
             this.flashMessage.show('Autenticado con exito!', { cssClass: 'alert-success', timeout: 3000 });

        }
        else{

          //Rebota
          this.flashMessage.show('Usuario o contraseña invalidos', { cssClass: 'alert-danger', timeout: 3000 });
        }
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

    is_autenticate(){

      let el = <HTMLElement>document.querySelector("#is_autenticate");
      el.click();
      let user = JSON.parse(localStorage.getItem('currentUser'));
      if (user != null){
        this.logged = true;
        this.user_logged = user.nombre;
      }else{
        this.logged = false;
      }

    }

}
