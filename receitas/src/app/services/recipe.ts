import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'https://api.api-ninjas.com/v1/recipe';
  private apiKey = 'SUA_API_KEY_AQUI'; //guga ou algum outro idiota, antes de dar comit tira a chave da api pfv

  constructor(private http: HttpClient) {}

  // Buscar receitas por nome ou termo
  searchRecipes(query: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });

    return this.http.get(`${this.apiUrl}?query=${query}`, { headers });
  }
}
