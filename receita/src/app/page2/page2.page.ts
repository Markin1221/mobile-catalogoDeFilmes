import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';  
type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    NgClass,
  ],
})
export class Page2Page implements OnInit {

  // --- Configurações ---
  attempts = 6;

  // Lista de palavras Valorant (mix agentes + mapas). Todas em MAIÚSCULAS.
  // Pode editar/adicionar conforme quiser.
  private DICTIONARY = [
    // Agents (exemplos)
    'JETT','REYNA','SOVA','VIPER','SAGE','RAZE','OMEN','PHOENIX','BRIMSTONE','ASTRA','KAYO','NEON','KILLJOY','SKYE',
    // Maps
    'BIND','ASCENT','HAVEN','SPLIT','ICEBOX','BREEZE','FRACTURE','PEARL',
    // Abilities / termos curtinhos pra variedade
    'SMOKE','ULT','SPIKE','FLASH'
  ].map(w => w.toUpperCase());

  // tecla virtual
  keyboardRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];

  toggleTheme() {
  document.body.classList.toggle('light-mode');
}

  // --- Estado do jogo ---
  answer = '';             // palavra do dia selecionada
  wordLength = 5;          // comprimento atual
  rows: string[] = [];     // array com 6 strings (tentativas)
  cols: number[] = [];
  currentRow = 0;
  currentCol = 0;
  tileStates: TileState[][] = []; // estados por tile
  message = '';
  gameOver = false;

  // para exibir no teclado o estado das letras
  keyStates: Record<string, TileState> = {};

  ngOnInit() {
    this.setupDailyWord();
    this.initGrid();
    // captura teclado físico
    window.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  // --- Seleciona a palavra do dia determinística por data ---
  setupDailyWord() {
    const today = new Date();
    // gerar um índice determinístico baseado na data (dia-ano)
    const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const idx = seed % this.DICTIONARY.length;
    this.answer = this.DICTIONARY[idx].toUpperCase();
    this.wordLength = this.answer.length;
  }

  initGrid() {
    this.rows = Array.from({length: this.attempts}, () => '');
    this.cols = Array.from({length: this.wordLength}, (_, i) => i);
    this.tileStates = Array.from({length: this.attempts}, () => Array.from({length: this.wordLength}, () => 'empty' as TileState));
    this.currentRow = 0;
    this.currentCol = 0;
    this.message = '';
    this.gameOver = false;
    this.keyStates = {};
  }

  // retorna a letra a ser exibida na célula (ou vazio)
  getLetter(r: number, c: number) {
    return (this.rows[r] && this.rows[r][c]) ? this.rows[r][c] : '';
  }

  // retorna classe CSS baseada no estado do tile
  getTileClass(r: number, c: number) {
    return this.tileStates[r][c];
  }

  // tecla virtual ou física
  onKey(k: string) {
    if (this.gameOver) return;
    if (this.currentCol >= this.wordLength) return; // já cheio
    const row = this.rows[this.currentRow] || '';
    this.rows[this.currentRow] = (row + k).slice(0, this.wordLength);
    this.tileStates[this.currentRow][this.currentCol] = 'filled';
    this.currentCol++;
  }

  onBackspace() {
    if (this.gameOver) return;
    if (this.currentCol === 0) return;
    const row = this.rows[this.currentRow] || '';
    this.rows[this.currentRow] = row.slice(0, -1);
    this.currentCol = Math.max(0, this.currentCol - 1);
    this.tileStates[this.currentRow][this.currentCol] = (this.rows[this.currentRow][this.currentCol]) ? 'filled' : 'empty';
  }

  onEnter() {
    if (this.gameOver) return;
    const guess = (this.rows[this.currentRow] || '').toUpperCase();
    if (guess.length !== this.wordLength) {
      this.showMessage(`A palavra tem ${this.wordLength} letras.`);
      return;
    }
    if (!this.isValidWord(guess)) {
      // se quiser, pode checar contra um dicionário maior. Aqui aceitamos qualquer string.
      // this.showMessage('Palavra não encontrada no dicionário.');
      // return;
    }
    // avaliar
    const evaluation = this.evaluateGuess(guess, this.answer);
    // aplicar estados
    for (let i=0;i<this.wordLength;i++) {
      const state = evaluation[i];
      this.tileStates[this.currentRow][i] = state;
      const letter = guess[i];
      // atualiza keyStates (prioridade: correct > present > absent)
      const prev = this.keyStates[letter];
      if (!prev || precedence(state) > precedence(prev)) this.keyStates[letter] = state;
    }

    if (guess === this.answer) {
      this.showMessage('Acertou! Parabéns, agente 🎉');
      this.gameOver = true;
      return;
    }

    // próxima linha ou fim
    this.currentRow++;
    this.currentCol = 0;
    if (this.currentRow >= this.attempts) {
      this.showMessage(`Fim de jogo — palavra: ${this.answer}`);
      this.gameOver = true;
    }
  }

  // teclado físico
  handleKeydown(e: KeyboardEvent) {
    if (this.gameOver) return;
    const k = e.key;
    if (k === 'Enter') { this.onEnter(); return; }
    if (k === 'Backspace') { this.onBackspace(); return; }
    const letter = k.length === 1 ? k.toUpperCase() : '';
    if (letter && /[A-ZÁÉÍÓÚÀÂÊÕÇ]/i.test(letter)) {
      // normalizar acentos removendo (para manter consistência) -> manter só letras ASCII
      const normalized = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      this.onKey(normalized);
    }
  }

  // reinicia o jogo (para debug / testar)
  restart() {
    this.setupDailyWord(); // opção: manter a palavra do dia ou gerar nova. aqui definimos nova por data
    this.initGrid();
  }

  // --- util --- 
  showMessage(m: string, t = 2500) {
    this.message = m;
    setTimeout(() => { if (this.message === m) this.message = ''; }, t);
  }

  // aceita qualquer palavra; se quiser validar com dicionário, implementa aqui.
  isValidWord(w: string) {
    return true;
  }

  // avalia a tentativa e retorna um array de estados por posição:
  // 'correct' (verde), 'present' (amarelo), 'absent' (cinza)
  evaluateGuess(guess: string, answer: string): TileState[] {
    guess = guess.toUpperCase();
    answer = answer.toUpperCase();

    const result: TileState[] = Array.from({length: this.wordLength}, () => 'absent' as TileState);

    // conta frequências das letras da resposta que ainda não foram marcadas como correct
    const answerCounts: Record<string, number> = {};
    for (let i=0;i<answer.length;i++) {
      const a = answer[i];
      answerCounts[a] = (answerCounts[a] || 0) + 1;
    }

    // primeira passada: correct
    for (let i=0;i<this.wordLength;i++) {
      if (guess[i] === answer[i]) {
        result[i] = 'correct';
        answerCounts[guess[i]] = (answerCounts[guess[i]] || 1) - 1;
      }
    }

    // segunda passada: present quando ainda houver contagem
    for (let i=0;i<this.wordLength;i++) {
      if (result[i] === 'correct') continue;
      const g = guess[i];
      if (answerCounts[g] > 0) {
        result[i] = 'present';
        answerCounts[g]--;
      } else {
        result[i] = 'absent';
      }
    }

    return result;
  }
  // exibir classe no teclado
  keyClass(k: string) {
    const st = this.keyStates[k];
    return st ? st : '';
  }
}

// helpers
function precedence(s: TileState) {
  if (s === 'correct') return 3;
  if (s === 'present') return 2;
  if (s === 'absent') return 1;
  return 0;
}
