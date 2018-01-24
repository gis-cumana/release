import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CapasService {
  public url: string;
  
  constructor(public http: HttpClient) {
    this.url = 'http://127.0.0.1:8000/capas/';
   }

   buscar(capa): Observable<any>{
        return this.http.get(this.url+"nombre/"+capa, {observe: 'response'});
    }   

}
