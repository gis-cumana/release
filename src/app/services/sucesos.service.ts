import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SucesosService {
public url: string;
  constructor(public http: HttpClient) {
      this.url = 'http://127.0.0.1:8000/sucesos';
   }

   all(): Observable<any>{
        let headers = new HttpHeaders()
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');

        return this.http.get(this.url, {headers: headers,  observe: 'response' });
    }

    post(suceso): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');
        return this.http.post(this.url, suceso, {headers: headers,  observe: 'response'});
    }

    get(id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');
        return this.http.get(this.url+"/"+id , {headers: headers,  observe: 'response'});
    }

    update(suceso, id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');
        return this.http.put(this.url+"/"+id, suceso, {headers: headers,  observe: 'response'});
    }

}
