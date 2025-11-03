import { Component } from '@angular/core';
import { Api } from '../services/receitas-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput
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
    IonInput
  ],
})

export class HomePage {
  receitas: any[] = [];
  termoBusca: string = 'a';

  constructor(private api: Api) {} 

  buscarReceitas() {
    if (!this.termoBusca.trim()) return;

    this.api.searchRecipes(this.termoBusca).subscribe({
      next: (data) => {
        this.receitas = data;
        console.log('Receitas encontradas:', data);
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      }
    });
  } 


  
}
