import { Component, OnInit } from '@angular/core';
declare const L: any;
import 'leaflet-sidebar-v2';
import 'leaflet-search';
import {CapasService} from '../../services/capas.service';

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


  constructor(private capasService: CapasService) { }

  ngOnInit() {
    this.iniciar_mapa();
  }

  iniciar_mapa()
  {
       this.capasService.buscar("escuelas").subscribe(data =>{

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


      this.mapa = L.map('mapa', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm_provider]
        });

        this.baseMaps = {
            "OSM": osm_provider,
            "Carto": carto_provider,
            "Terreno": argis_provider,
            "Satelite": satelite_provider
        };


        this.overlayMaps = {};


       
        this.mapa.on('click', (e) => {this.onMapClick(e)});

        L.control.sidebar({
              autopan: false,
              closeButton: true, 
              container: 'sidebar', 
              position: 'left',     
          }).addTo(this.mapa);


          let geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            let escuelas = L.geoJSON(data.body, {
                pointToLayer: function (feature, latlng) {
                    return L.Marker(new L.latLng(feature.geometry.coordinates), {title: feature.properties.nombre} );
                }
            });

            this.overlayMaps = {
              "escuelas": escuelas
            };

             this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.mapa);

            this.mapa.addLayer(escuelas);

            let searchControl = new L.Control.Search({
              layer: escuelas
            });

            this.mapa.addControl(searchControl);

      });
  }

  buscar_capa(capa)
  {         
  }




  onMapClick(e) {
   L.popup().setLatLng(e.latlng).setContent("Latitud: " + e.latlng.lat + " <br/> Longitud: "+ e.latlng.lng).openOn(this.mapa);
  }





}
