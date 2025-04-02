import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonIcon, IonButton, IonInput, IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule],
})
export class Tab1Page {
  nombre: string = '';
  apellido: string = '';
  latitud: number | null = null;
  longitud: number | null = null;
  constructor(private router: Router) {
    addIcons({ add })
  }

  enviarData(){
    if (this.nombre && this.apellido && this.latitud && this.longitud !== null) {
      this.router.navigate(['/tabs/tab2'], {
        queryParams: {
          nombre: this.nombre,
          apellido: this.apellido,
          latitud: this.latitud,
          longitud: this.longitud,
        },
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
