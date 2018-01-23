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

      let argis = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'

      let satelite = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

      const argis_provider = L.tileLayer(argis, {
          attribution: 'Argis | CSUDO'
      });

      const satelite_provider = L.tileLayer(satelite, {
          attribution: 'Satelital | CSUDO'
      });


      this.mapa = L.map('mapa', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm]
        });

        this.baseMaps = {
            "OSM": osm,
            "Carto": carto,
            "Terreno": argis_provider,
            "Satelite": satelite_provider
        };

        this.overlayMaps = {};

        this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.mapa);
        this.mapa.on('click', (e) => {this.onMapClick(e)});
        let geojsonFeature = {
            "type": "Feature",
            "properties": {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "description": "This is where the Rockies play!",
                "color": "blue"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-64.1675, 10.456389]
            }
        };
let style = {
                radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
                };


        L.geoJSON(geojsonFeature,{

                style: style
        }).addTo(this.mapa);
  }


  onMapClick(e) {
   L.popup().setLatLng(e.latlng).setContent("Latitud: " + e.latlng.lat + " <br/> Longitud: "+ e.latlng.lng).openOn(this.mapa);
  }





}
