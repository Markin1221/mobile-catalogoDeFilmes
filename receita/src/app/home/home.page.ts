import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/receitas-api';
import { ErrorShakeDirective } from '../directives/error-shake';
import { StatusTentativaPipe } from '../pipes/status-tentativa-pipe'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ErrorShakeDirective],
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  agentes: any[] = [];
  agenteSecreto: string = '';
  letters: string[] = [];
  resultado: string[] = [];
  teclado: { [key: string]: string } = {};
  vitoria = false;
  derrota = false;

  tentativas: { letras: string[]; cores: string[] }[] = [];

  linhasTeclado: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  buscarAgentes() {
    // Impede trocar de agente se o jogador ainda não venceu o atual
    if (this.agenteSecreto && !this.vitoria) return;

    this.api.getAgents().subscribe({
      next: (res: any) => {
        this.agentes = res.data || [];
        if (!this.agentes.length) return;

        const rnd = Math.floor(Math.random() * this.agentes.length);
        this.agenteSecreto = String(this.agentes[rnd].displayName || '')
          .toUpperCase()
          .replace(/\s+/g, '');

        // Reseta o jogo
        this.letters = [];
        this.resultado = [];
        this.teclado = {};
        this.tentativas = [];
        this.vitoria = false;
        this.derrota = false;
      },
      error: (err) => console.error('Erro ao buscar agentes:', err),
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.processKey(String(event.key));
  }

  cliqueTecla(k: string) {
    this.processKey(k);
  }

  private processKey(rawKey: string) {
    if (!rawKey) return;
    const key = rawKey.toUpperCase();
    if (this.vitoria) return;

    if (key === 'BACKSPACE' || key === 'BACK') return this.backspace();
    if (key === 'ENTER') return this.trySubmit();

    if (!this.agenteSecreto) return;
    if (/^[A-Z]$/.test(key)) this.addLetter(key);
  }

  private addLetter(letter: string) {
    if (this.letters.length >= this.agenteSecreto.length) return;
    this.letters.push(letter);
  }

  private backspace() {
    this.letters.pop();
  }

  private trySubmit() {
    if (this.letters.length !== this.agenteSecreto.length) return;
    this.verificarPalpite();
  }

  private verificarPalpite() {
    const tentativa = this.letters.join('');
    const correta = this.agenteSecreto;

    this.resultado = new Array(correta.length).fill('#39334f');
    const freq: { [k: string]: number } = {};

    for (const ch of correta) freq[ch] = (freq[ch] || 0) + 1;

    // Primeira passada — letras corretas
    for (let i = 0; i < correta.length; i++) {
      if (tentativa[i] === correta[i]) {
        this.resultado[i] = '#1cc7d3';
        this.teclado[tentativa[i]] = '#1cc7d3';
        freq[correta[i]]--;
      }
    }

    // Segunda passada — letras parciais e erradas
    for (let i = 0; i < correta.length; i++) {
      if (this.resultado[i] === '#1cc7d3') continue;
      const letra = tentativa[i];
      if (freq[letra] > 0) {
        this.resultado[i] = '#142d74';
        if (this.teclado[letra] !== '#1cc7d3') {
          this.teclado[letra] = '#142d74';
        }
        freq[letra]--;
      } else {
        this.resultado[i] = '#13111aff';
        this.teclado[letra] ??= '#0f0d14ff';
      }
    }

    // Salva tentativa no histórico
    this.tentativas.push({
      letras: [...this.letters],
      cores: [...this.resultado],
    });

    // Verifica se acertou
    if (tentativa === correta) {
      this.vitoria = true;
      this.derrota = false;
    } else {
      // Se errou, limpa o campo atual e permite nova tentativa
      this.derrota = true;
      this.letters = [];
      this.resultado = [];
    }
  }
}
