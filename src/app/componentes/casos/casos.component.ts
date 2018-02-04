import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SelectItem} from 'primeng/primeng';
import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-casos',
  templateUrl: './casos.component.html',
  styleUrls: ['./casos.component.css']
})
export class CasosComponent implements OnInit {
   map: any;
   baseMaps: any;
   control: any;
   overlayMaps: any;
   display: boolean = false;
  suceso: any;
  lat: any;
  lng: any;
  fecha: Date;
  msgs: Message[] = [];
  hora: Date;
  descripcion: string;
  sucesos: SelectItem[];
  constructor() { }

  ngOnInit() {

      this.msgs.push({severity:'success', summary:'Haga click en el lugar donde ourrio el hecho'});

      this.iniciar_mapa();
  }

  iniciar_mapa()
  {
      const osm_provider = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMaps | CSUDO'
      });

      const carto_provider = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          attribution: 'Cartografica | CSUDO'
      });


      const argis_provider = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Argis | CSUDO'
      });

      const satelite_provider = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Satelital | CSUDO'
      });

      this.map = L.map('map', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm_provider],
        preferCanvas: true
        });

        this.baseMaps = {
            "OSM": osm_provider,
            "Carto": carto_provider,
            "Terreno": argis_provider,
            "Satelite": satelite_provider
        };

        this.overlayMaps = {};
        this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);
        this.map.on("click", (ev) => this.onClickEvent(ev));
  }


  onClickEvent(e) {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
        this.display = true;
    }

   registrar()
    {
        this.msgs = [];
        if (this.validar())
        {
        let caso = {
          "fecha": this.fecha,
          "hora": this.hora,
          "descripcion": this.descripcion,
          "lat": this.lat,
          "suceso": this.suceso,
          "lng": this.lng,
          "imagenes": []
        };
    }
    }


  validar()
  {
    let res = true;
    if (this.fecha == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Fecha', detail:'es requerida'});
    }
    if (this.hora == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Hora', detail:'es requerida'});
    }
    if (this.lat == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Latitud', detail:'es requerida'});
    }
    if (this.lng == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Longitud', detail:'es requerida'});
    }
    if (this.descripcion == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Descripcion', detail:'es requerida'});
    }
    if (this.suceso == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Suceso', detail:'es requerida'});
    }
    return res;
  }

}
