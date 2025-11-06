import { Component } from '@angular/core';
import { ApiService } from '../services/receitas-api';  // Ajuste o caminho se necessário
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel
  ],
})
export class HomePage {
  agentes: any[] = [];

  constructor(private api: ApiService) {}

  // Método para buscar agentes ao clicar no botão
  buscarAgentes() {
    this.api.getAgents().subscribe({
      next: (data) => {
        // A API retorna { data: [...] }, então pegamos o array de agentes
        this.agentes = data.data || [];
        console.log('Agentes encontrados:', this.agentes);
      },
      error: (err) => {
        console.error('Erro ao buscar agentes:', err);
      }
    });
  }
}