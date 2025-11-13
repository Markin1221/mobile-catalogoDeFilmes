import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../services/receitas-api';
import { ErrorShakeDirective } from '../directives/error-shake';
import { StatusTentativaPipe } from '../pipes/status-tentativa-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ErrorShakeDirective, StatusTentativaPipe],
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

  // 🔥 AGORA SÃO 3 TENTATIVAS
  maxTentativas = 3;

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  // 🔥 Agora permite buscar NOVO agente depois de perder
  buscarAgentes() {
    // pode buscar se:
    // - não há agente ainda
    // - ou venceu
    // - ou perdeu
    if (this.agenteSecreto && !this.vitoria && !this.derrota) {
      return;
    }

    this.api.getAgents().subscribe({
      next: (res: any) => {
        this.agentes = res.data || [];
        if (!this.agentes.length) return;

        const rnd = Math.floor(Math.random() * this.agentes.length);

        this.agenteSecreto = String(this.agentes[rnd].displayName || '')
          .toUpperCase()
          .replace(/\s+/g, '');

        // reset completo
        this.letters = [];
        this.resultado = [];
        this.teclado = {};
        this.tentativas = [];
        this.vitoria = false;
        this.derrota = false;

        console.log('Novo agente secreto:', this.agenteSecreto);
      },
      error: (err) => {
        console.error('Erro ao buscar agentes:', err);
      },
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

    if (key === 'BACKSPACE' || key === 'BACK') {
      this.backspace();
      return;
    }

    if (key === 'ENTER') {
      this.trySubmit();
      return;
    }

    if (!this.agenteSecreto) return;

    if (/^[A-Z]$/.test(key)) {
      this.addLetter(key);
    }
  }

  private addLetter(letter: string) {
    if (!this.agenteSecreto) return;
    if (this.letters.length >= this.agenteSecreto.length) return;
    this.letters.push(letter);
  }

  private backspace() {
    this.letters.pop();
  }

  private trySubmit() {
    if (!this.agenteSecreto) return;
    if (this.letters.length !== this.agenteSecreto.length) return;

    if (this.tentativas.length >= this.maxTentativas) {
      this.derrota = true;
      return;
    }

    this.verificarPalpite();
  }

  private verificarPalpite() {
    const tentativa = this.letters.join('');
    const correta = this.agenteSecreto;

    this.resultado = new Array(correta.length).fill('#39334f');
    this.teclado = this.teclado || {};

    const freq: { [k: string]: number } = {};
    for (const ch of correta) freq[ch] = (freq[ch] || 0) + 1;

    for (let i = 0; i < correta.length; i++) {
      if (tentativa[i] === correta[i]) {
        this.resultado[i] = '#1cc7d3';
        this.teclado[tentativa[i]] = '#1cc7d3';
        freq[correta[i]]--;
      }
    }

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
        this.resultado[i] = '#39334f';
        this.teclado[letra] ??= '#39334f';
      }
    }

    this.tentativas.push({
      letras: [...this.letters],
      cores: [...this.resultado],
    });

    // 🔥 VITÓRIA
    if (tentativa === correta) {
      this.vitoria = true;
      this.derrota = false;
    } 
    // 🔥 DERROTA após 3 tentativas
    else if (this.tentativas.length >= this.maxTentativas) {
      this.derrota = true;
      this.vitoria = false;
    } else {
      this.vitoria = false;
      this.derrota = false;
    }

    this.letters = [];
    this.resultado = [];
  }
}
