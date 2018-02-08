import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  display: boolean = false;
  registro: boolean = false;
  recover: boolean = false;
  logged: boolean = false;

  constructor() { }

  ngOnInit() {
    this.is_autenticate();
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
      }
    }

    login(){
        alert("Hola desarrolla la funcionalidad para iniciar sesion")

    }

}
