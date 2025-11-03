import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) { }

  private apiLink = "https://api.api-ninjas.com/v1/recipe"
  private apiKey = 'Gs+iTT6KlRix1mE7CMSXdA==8GZMBmNKcr2x4FXd';

  searchRecipes(query: string): Observable<any> {
    const headers = new HttpHeaders({ 'X-Api-Key': this.apiKey });
    return this.http.get(`${this.apiLink}?query=${encodeURIComponent(query)}`, { headers });
  }

}