import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/receita';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';

interface Recipe {
  id?: number;
  title: string;
  description?: string;
  ingredients?: string;
  image?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  ]
})
export class HomePage implements OnInit {
  searchTerm: string = '';
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes(''); // carrega todas as receitas inicialmente
  }

  loadRecipes(query: string) {
    this.recipeService.searchRecipes(query).subscribe({
      next: (data: Recipe[]) => {
        this.recipes = data;
      },
      error: (err:any) => {
        console.error('Erro ao carregar receitas:', err);
        this.recipes = [];
      }
    });
  }

  onSearchChange() {
    this.loadRecipes(this.searchTerm);
  }
}
