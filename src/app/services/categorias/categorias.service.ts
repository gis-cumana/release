import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class CategoriasService {

    public url: string;
    public url_par: string;
    public base_url: string;

    constructor(
        public http: HttpClient
    ){
        //this.url = '/api/categorias';
        this.base_url = environment.baseUrl;
        this.url = this.base_url+'categorias/';
        this.url_par = this.base_url+'parametros/';
    }

	obtener(): Observable<any>{

	    return this.http.get(this.url, { observe: 'response' });
	}

	agregar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        let hola = this.http.post(this.url, categoria, {headers: headers, observe: 'response'});
        console.log(hola);
        return hola;
    }

	actualizar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.put(this.url+'/'+categoria.id, categoria, {headers: headers, observe: 'response'});
    }

	eliminar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this.http.delete(this.url+'/'+categoria.id, {headers: headers,  observe: 'response'});
    }
 
    crearParametros(parametros): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.post('this.url_par', parametros, {headers: headers,  observe: 'response'});
    }   

    eliminarParametros(id): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.delete(this.url_par+'/'+id, {headers: headers,  observe: 'response'});
    }   


}