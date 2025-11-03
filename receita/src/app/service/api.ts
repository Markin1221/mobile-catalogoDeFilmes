import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://api.api-ninjas.com/v1/recipe';
  private apiKey = 'Gs+iTT6KlRix1mE7CMSXdA==8GZMBmNKcr2x4FXd'; // ⚠️ coloque sua chave real

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });
    return this.http.get(`${this.apiUrl}?query=${encodeURIComponent(query)}`, { headers });
  }
}