import { Component, HostListener } from '@angular/core';
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
  agenteSecreto: string = ''; // Nome do agente a ser adivinhado
  letters: string[] = []; // Letras digitadas
  resultado: string[] = []; // Cores de feedback para cada letra
  vitoria = false;
  derrota = false;

  constructor(private api: ApiService) {
    this.buscarAgentes();
  }

  // Busca agentes e escolhe um aleatório
  buscarAgentes() {
    this.api.getAgents().subscribe({
      next: (data) => {
        this.agentes = data.data || [];
        if (this.agentes.length > 0) {
          const aleatorio = Math.floor(Math.random() * this.agentes.length);
          this.agenteSecreto = this.agentes[aleatorio].displayName.toUpperCase();
          console.log('Agente secreto:', this.agenteSecreto);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar agentes:', err);
      }
    });
  }

  // Captura teclado físico
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toUpperCase();

    if (/^[A-Z]$/.test(key) && this.letters.length < this.agenteSecreto.length) {
      this.letters.push(key);
    }

    if (key === 'BACKSPACE') {
      this.letters.pop();
    }

    if (key === 'ENTER') {
      this.verificarPalavra();
    }
  }

  // Verifica se a palavra está certa
  verificarPalavra() {
    if (this.letters.length !== this.agenteSecreto.length) return;

    this.resultado = this.letters.map((letra, i) => {
      if (letra === this.agenteSecreto[i]) return '#1cc7d3'; // posição e letra corretas
      else return '#142d74'; // errada
    });

    const palavra = this.letters.join('');
    if (palavra === this.agenteSecreto) {
      this.vitoria = true;
      console.log('🎉 Vitória!');
    } else {
      this.derrota = true;
      console.log('❌ Derrota! O agente era:', this.agenteSecreto);
    }

    setTimeout(() => {
      this.letters = [];
      this.resultado = [];
      this.vitoria = false;
      this.derrota = false;
      this.buscarAgentes();
    }, 3000);
  }
}
