import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

interface HistoryItem {
  word: string;
  attempts: number;
  triedWords: string[];
}

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Page2Page {

  // ====== BOTÃO "INICIAR" ======
  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/page1']); // redireciona para a página 1
  }

  // ====== DADOS DO HISTÓRICO ======
  history: HistoryItem[] = [
    {
      word: 'sova',
      attempts: 4,
      triedWords: ['jett', 'omen', 'sage', 'sova']
    },
    {
      word: 'raze',
      attempts: 3,
      triedWords: ['neon', 'fade', 'raze']
    }
  ];

  selectedItem: HistoryItem | null = null;

  // Número de letras da palavra selecionada
  get wordLength(): number {
    return this.selectedItem ? this.selectedItem.word.length : 0;
  }

  // ====== AO CLICAR NA CAIXINHA DO HISTÓRICO ======
  openHistoryItem(item: HistoryItem) {
    this.selectedItem = item;
    this.prepareGrid();
  }

  // ====== GRID (apenas visual, não é o jogo real) ======
  rows: any[] = [];
  cols: any[] = [];

  prepareGrid() {
    if (!this.selectedItem) return;

    const len = this.selectedItem.word.length;
    const attempts = this.selectedItem.triedWords.length;

    this.rows = Array(attempts).fill(0);
    this.cols = Array(len).fill(0);
  }

  // Retorna a letra da tentativa na posição da grade
  getLetter(row: number, col: number): string {
    if (!this.selectedItem) return '';
    const attempt = this.selectedItem.triedWords[row];
    return attempt[col] ?? '';
  }

  // Define cor das tiles
  getTileClass(row: number, col: number) {
    if (!this.selectedItem) return {};

    const attemptWord = this.selectedItem.triedWords[row];
    const correctWord = this.selectedItem.word;

    const letter = attemptWord[col];
    const correctLetter = correctWord[col];

    if (!letter) return {};

    if (letter === correctLetter) return 'correct';
    if (correctWord.includes(letter)) return 'present';
    return 'absent';
  }

  keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  onKey(k: string) {
    // o teclado no histórico é apenas ilustrativo
    console.log('tecla pressionada:', k);
  }

  onBackspace() {
    // limpa o histórico inteiro
    this.history = [];
    this.selectedItem = null;
  }

  keyClass(k: string) {
    return ''; // sem cores, pois não é o jogo real
  }
}
