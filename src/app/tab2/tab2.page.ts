import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent ]
})
export class Tab2Page implements AfterViewInit, OnDestroy{
  nombre: string = '';
  apellido: string = '';
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = 'Cargando...';
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private routeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      this.apellido = params['apellido'];
      this.latitud = parseFloat(params['latitud']) || 0;
      this.longitud = parseFloat(params['longitud']) || 0;

      if (!this.map) {
        this.inicializarMapa();
      }
      this.actualizarMarker();
      this.obtenerDireccion();
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 0);
    });
  }
  inicializarMapa() {
    this.map = L.map('map').setView([this.latitud, this.longitud], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([this.latitud, this.longitud], { icon: this.crearIcono() }).addTo(this.map);
  }

  actualizarMarker() {
    if (this.marker) {
      this.marker.setLatLng([this.latitud, this.longitud]);
    } else {
      this.marker = L.marker([this.latitud, this.longitud], { icon: this.crearIcono() }).addTo(this.map!);
    }
    this.map!.setView([this.latitud, this.longitud], 15);
  }

  crearIcono(){
    return L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  obtenerDireccion() {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitud}&lon=${this.longitud}`)
      .then(response => response.json())
      .then(data => {
        this.direccion = data.display_name || 'Ubicación desconocida';

        if (this.marker) {
          this.marker.unbindPopup();
          this.marker.bindPopup(`<b>${this.nombre} ${this.apellido}</b><br>${this.direccion}`).openPopup();
        }
      })
      .catch(() => {
        this.direccion = 'No se pudo obtener la ubicación';
    });
  }
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
