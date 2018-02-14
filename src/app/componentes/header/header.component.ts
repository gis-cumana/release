import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Message} from 'primeng/components/common/api';

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
  email: any;
  password: any;
  msgs: Message[] = [];
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

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

}
