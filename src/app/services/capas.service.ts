import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class CapasService {
  public url: string;
  public base_url: string;

  constructor(public http: HttpClient) {
    this.base_url = environment.baseUrl;
    this.url = this.base_url+'capas/';
   }

   buscar(capa): Observable<any>{
        return this.http.get(this.url+"nombre/"+capa, {observe: 'response'});
    }   

    obtener(): Observable<any>{
        return this.http.get(this.url, { observe: 'response' });
    }

    traer(nombre): Observable<any>{

        return this.http.get(this.url+"nombre/"+nombre, { observe: 'response' });
    }
  
  
}
