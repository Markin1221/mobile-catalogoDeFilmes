import { Component, OnInit } from '@angular/core';
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
export class Page2Page implements OnInit {

  constructor(private router: Router) {}

  history: HistoryItem[] = [];
  selectedItem: HistoryItem | null = null;

  ngOnInit() {
    const hist = localStorage.getItem('history');
    if (hist) {
      this.history = JSON.parse(hist);
    }
  }
  voltar() {
  this.router.navigate(['/home']);
}

  startGame() {
    this.router.navigate(['/page1']);
  }

  get wordLength(): number {
    return this.selectedItem ? this.selectedItem.word.length : 0;
  }

  openHistoryItem(item: HistoryItem) {
    this.selectedItem = item;
    this.prepareGrid();
  }

  rows: any[] = [];
  cols: any[] = [];

  prepareGrid() {
    if (!this.selectedItem) return;

    const len = this.selectedItem.word.length;
    const attempts = this.selectedItem.triedWords.length;

    this.rows = Array(attempts).fill(0);
    this.cols = Array(len).fill(0);
  }

  getLetter(row: number, col: number): string {
    if (!this.selectedItem) return '';
    const attempt = this.selectedItem.triedWords[row];
    return attempt[col] ?? '';
  }

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
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  onKey(k: string) {
    console.log("tecla:", k);
  }

  onBackspace() {
    this.history = [];
    this.selectedItem = null;
    localStorage.removeItem('history');
  }

  keyClass(k: string) {
    return '';
  }
}
