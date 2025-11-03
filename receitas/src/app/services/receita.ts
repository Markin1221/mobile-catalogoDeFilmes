import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://api.api-ninjas.com/v1/recipe';
  private apiKey = 'COLOQUE_SUA_API_KEY_AQUI'; // ⚠️ coloque sua chave real

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });
    return this.http.get(`${this.apiUrl}?query=${encodeURIComponent(query)}`, { headers });
  }
}
