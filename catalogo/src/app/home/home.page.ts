import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true, // 👈 mantém standalone
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  searchTerm: string = '';

  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Bolo de Chocolate',
      description: 'Um bolo fofinho e delicioso com cobertura cremosa.',
      category: 'Sobremesa',
      image: 'assets/bolo-chocolate.jpg',
    },
    {
      id: 2,
      title: 'Lasanha de Frango',
      description: 'Lasanha cremosa com frango desfiado e molho branco.',
      category: 'Prato Principal',
      image: 'assets/lasanha-frango.jpg',
    },
    {
      id: 3,
      title: 'Salada Grega',
      description: 'Refrescante e saudável, perfeita para o verão.',
      category: 'Salada',
      image: 'assets/salada-grega.jpg',
    },
  ];

  get filteredRecipes(): Recipe[] {
    const term = this.searchTerm.toLowerCase();
    return this.recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        recipe.category.toLowerCase().includes(term)
    );
  }
}
