import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private apiLink = "https://valorant-api.com/v1/agents";

  // Método para buscar todos os agentes (sem query, pois a API retorna todos)
  getAgents(): Observable<any> {
    return this.http.get(this.apiLink);
  }
}