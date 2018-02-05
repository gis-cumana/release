import { Component, OnInit } from '@angular/core';
import {SucesosService} from '../../services/sucesos.service';
import {CasosService} from '../../services/casos.service';
import * as L from 'leaflet';
import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-sucesos',
  templateUrl: './sucesos.component.html',
  styleUrls: ['./sucesos.component.css']
})
export class SucesosComponent implements OnInit {
  sucesos: any;
  suceso: any;
  casos: any;
  msgs: Message[] = [];
  loading: boolean;
  detalle: boolean = false;
  map: any;
  mapa: boolean = false;
  constructor(private sucesosService: SucesosService, private casosService: CasosService) { }

  ngOnInit() {
      this.sucesos = [];
      this.get_lista_sucesos();
  }

  get_lista_sucesos(){
      this.loading = true;
    this.sucesosService.all().subscribe(data =>{
      console.log(data);
      data.body.forEach((element) =>{
        this.sucesos.push(element);
      });
      this.loading = false;
    },
    error => {
      console.log(error);
      this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
    });
  }

   ver_casos(suceso: any) {
       this.suceso = suceso.id;
        this.casos = suceso.casos;
        this.detalle = true;
    }

    cambiar_visibilidad(caso_id: any) {
        this.casosService.change_state(caso_id).subscribe(data => {
            this.sucesosService.get(this.suceso).subscribe(data => {
                console.log(data);
                 this.casos = data.body.casos;
            }, error =>{
                console.log(error);
                this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
            });
        }, error =>{
            console.log(error);
            this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
        });
    }

    ver_mapa(suceso: any){
        this.mapa = true;
        const osm_provider = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMaps | CSUDO'
          });
        this.map = L.map('map', {
            center: [10.456389, -64.1675],
            zoom: 13,
            layers: [osm_provider],
            preferCanvas: true
            });

        suceso.casos.forEach((element) =>{
            let marker = L.marker([element.lat, element.lng]).addTo(this.map);
        });
    }

}
