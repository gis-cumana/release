import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as search from 'leaflet-search'

@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent implements OnInit {
   mapa: any;
   baseMaps: any;
   control: any;
   overlayMaps: any;

  constructor() { }

  ngOnInit() {
    this.iniciar_mapa();
  }

  iniciar_mapa()
  {
      let osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
      
      const osm = L.tileLayer(osmUrl, {
          attribution: 'Open Street Maps | CSUDO'
      });

      let cartoUrl='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'

      const carto = L.tileLayer(cartoUrl, {
          attribution: 'Carto Tiles | CSUDO'
      });

      this.mapa = L.map('mapa', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm]
        });
        
        this.baseMaps = {
            "OSM": osm,
            "Carto": carto
        };

        this.overlayMaps = {};

        this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.mapa);
        this.control_busqueda();
  }

  control_busqueda()
  {
      let markersLayer = new L.LayerGroup();
      this.mapa.addLayer(markersLayer);
      this.mapa.addControl( new L.Control.Search({layer: markersLayer}) );
  }



}
