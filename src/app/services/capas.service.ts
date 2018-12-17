import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CapasService {
  public url: string;
  
  constructor(public http: HttpClient) {
    this.url = '/api/capas';
   }

   buscar(capa): Observable<any>{
        return this.http.get(this.url+"/nombre/"+capa, {observe: 'response'});
    }   

    obtener(): Observable<any>{
        return this.http.get(this.url, { observe: 'response' });
    }

    traer(nombre): Observable<any>{

        return this.http.get(this.url+"/nombre/"+nombre, { observe: 'response' });
    }
  
  
}
