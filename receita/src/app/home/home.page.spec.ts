import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-valoroso-historico',
  templateUrl: './valoroso-historico.page.html',
  styleUrls: ['./valoroso-historico.page.scss'],
})
export class ValorosoHistoricoPage {
  isDarkMode = true;

  palavras = [
    { palavra: 'valorant', letras: 8, tentativas: 3, acertou: true },
    { palavra: 'phantom', letras: 7, tentativas: 5, acertou: true },
    { palavra: 'vandal', letras: 6, tentativas: 4, acertou: false },
  ];

  constructor(private platform: Platform) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('light-mode', !this.isDarkMode);
    this.playSound('click');
  }

  // Funções para som
  playSound(tipo: 'acerto' | 'erro' | 'click') {
    const audio = new Audio();
    switch (tipo) {
      case 'acerto':
        audio.src = 'assets/sounds/acerto.mp3'; break;
      case 'erro':
        audio.src = 'assets/sounds/erro.mp3'; break;
      default:
        audio.src = 'assets/sounds/click.mp3'; break;
    }
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Evita erro se o som não carregar
  }
}

