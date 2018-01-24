import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
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


        this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.mapa);
        this.mapa.on('click', (e) => {this.onMapClick(e)});

        L.control.sidebar({
              autopan: false,
              closeButton: true, 
              container: 'sidebar', 
              position: 'left',     
          }).addTo(this.mapa);
  }

  buscar_capa(capa)
  {

  let circleStyle = function(){

                return {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }

            }


       this.capasService.buscar(capa).subscribe(data =>{

        this.addEscuelas(data.body, circleStyle);
            
       }, error =>{
         alert("ERROR");
       });
  }

    addEscuelas(capa, estilo){

    let atributos = Object.getOwnPropertyNames(capa.features[0].properties);
    let popup = function(feature, layer){

        let popupDiv = document.createElement("div");
        let ul = document.createElement("ul");

        atributos.forEach((element) =>{

            if(element != "pk"){

                let li = document.createElement("li");
                li.innerHTML = ""+element+": "+feature.properties[""+element];
                ul.appendChild(li);
            }
        });
        popupDiv.appendChild(ul);
        layer.bindPopup(popupDiv);
    }

    let myLayer = L.geoJSON(capa, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, estilo);
        },
        onEachFeature: popup}).addTo(this.mapa);

    let nombre = capa.nombre;

    this.overlayMaps[""+capa.nombre] = myLayer;

    this.mapa.removeControl(this.control);
    this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.mapa);

  }


  onMapClick(e) {
   L.popup().setLatLng(e.latlng).setContent("Latitud: " + e.latlng.lat + " <br/> Longitud: "+ e.latlng.lng).openOn(this.mapa);
  }





}
