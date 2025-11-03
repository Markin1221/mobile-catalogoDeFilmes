import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../services/recipe';
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
  IonIcon,
} from '@ionic/angular/standalone';

interface Recipe {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  ingredients?: string;
  instructions?: string;
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
    IonIcon,
  ],
})




export class HomePage implements OnInit {
  searchTerm: string = '';


  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Lasanha à Bolonhesa',
      description: 'Uma deliciosa lasanha com molho de carne e queijo.',
      category: 'Massas',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
    },
    {
      id: 2,
      title: 'Bolo de Cenoura',
      description: 'Com cobertura de chocolate cremosa e irresistível.',
      category: 'Sobremesas',
      image: 'https://images.unsplash.com/photo-1605475128023-5d99b0a818cf',
    },
    {
      id: 3,
      title: 'Salada Tropical',
      description: 'Refrescante, colorida e muito saudável.',
      category: 'Saladas',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    },
  ];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Busca inicial da API com letra genérica para mostrar receitas aleatórias
    this.loadRecipes('a');
  }

  // Buscar receitas via API
  loadRecipes(query: string) {
    this.recipeService.searchRecipes(query).subscribe({
      next: (data) => {
        // Substitui apenas se retornar algo da API, senão mantém as receitas fixas
        if (data && data.length > 0) {
          this.recipes = data.map((r: any, index: number) => ({
            id: r.id || index,
            title: r.title,
            description: r.instructions || '',
            ingredients: r.ingredients || '',
          }));
        }
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  // Chamado quando o usuário digita algo no searchbar
  onSearchChange() {
    if (this.searchTerm.trim() !== '') {
      this.loadRecipes(this.searchTerm);
    }
  }

  // Filtro local para buscar nas receitas fixas ou carregadas da API
  get filteredRecipes() {
    const term = this.searchTerm.toLowerCase();
    return this.recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term)) ||
        (r.category && r.category.toLowerCase().includes(term))
    );
  }
}
