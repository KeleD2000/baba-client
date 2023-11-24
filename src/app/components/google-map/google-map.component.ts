/// <reference types="@types/googlemaps" />

import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FooldalService } from 'src/app/services/fooldal.service';

// Importáljuk be a Google Maps típusokat
declare var google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnDestroy {

  constructor(private fooldalService: FooldalService){}

  @ViewChild('map') mapElement: any;
  map: google.maps.Map | undefined;
  mapId: string = '';
  createdMaps: string[] = [];

  ngOnInit() {
    const localHall = localStorage.getItem('hall');
    var titles: any[] = [];

    if (localHall) {
      const dataArray = JSON.parse(localHall);

      for (let i in dataArray) {
        titles.push(dataArray[i].title);
      }
    }

    this.fooldalService.getHallSessionProduct().subscribe(hall => {
      // Töröld az összes korábban létrehozott térképet
      this.createdMaps.forEach(mapId => {
        const element = document.getElementById(mapId);
        if (element) {
          element.innerHTML = '';
        }
      });

      this.createdMaps = []; // Ürítsd a létrehozott térképek tömbjét

      for (const [key, value] of Object.entries(hall)) {
        if (key === 'data') {
          for (let i in value) {
            console.log(value[i].title);

            if (titles.includes(value[i].title)) {
              let coord = value[i].field_location.field_address;
              const coordSplit = coord.split(',');
              const NumberLat = Number(coordSplit[0]);
              const NumberLong = Number(coordSplit[1]);
              console.log(NumberLat, NumberLong);
              this.drawMap(NumberLat, NumberLong);
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.createdMaps.forEach(mapId => {
      const element = document.getElementById(mapId);
      if (element) {
        element.innerHTML = '';
      }
    });
    this.createdMaps = [];
  }
  
  drawMap(lat: number, lng: number): void {
    this.mapId = `map-${lat}-${lng}`;
    console.log(`Creating map for ${lat}, ${lng}`);
  
    const mapProperties: google.maps.MapOptions = {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById(this.mapId), mapProperties);
  
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Hello World!'
    });
  
    this.createdMaps.push(this.mapId);

    this.map?.panTo(new google.maps.LatLng(lat, lng))
  }
}
