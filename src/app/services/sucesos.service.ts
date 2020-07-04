import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class SucesosService {
public url: string;
public base_url: string;
public key = JSON.parse(localStorage.getItem('currentUser')).header;
    constructor(public http: HttpClient) {
        this.base_url = environment.baseUrl;
        this.url = this.base_url+'sucesos/';
    }

   all(): Observable<any>{
        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);

        return this.http.get(this.url, {headers: headers,  observe: 'response' });
    }

    post(suceso): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', this.key);
        return this.http.post(this.url, suceso, {headers: headers,  observe: 'response'});
    }

    delete(id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);
        return this.http.delete(this.url+id , {headers: headers,  observe: 'response'});
    }

    get(id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);
        return this.http.get(this.url+id , {headers: headers,  observe: 'response'});
    }

    update(suceso, id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', this.key);
        return this.http.put(this.url+id, suceso, {headers: headers,  observe: 'response'});
    }

}
