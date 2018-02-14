import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    public url: string;
  
  constructor(public http: HttpClient) {
        this.url = 'https://gis-entorno-benjamin-s-e.c9users.io:8080/auth/';
   }

   login(user): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json');
        return this.http.post(this.url+"login/", user, {headers: headers,  observe: 'response'});
    }

    info(header): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', header);
        console.log(header);                                    
        return this.http.get(this.url+"user/", {headers: headers,  observe: 'response'});
    }



}
