import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FipeService {
  private baseUrlCarros = 'https://parallelum.com.br/fipe/api/v1/carros';
  private baseUrlMotos = 'https://parallelum.com.br/fipe/api/v1/motos';

  constructor(private http: HttpClient) {}

  // CARROS
  getMarcasCarros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlCarros}/marcas`);
  }

  getModelosCarros(marcaId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCarros}/marcas/${marcaId}/modelos`);
  }

  getAnoDetalhesCarro(marcaId: string, modeloId: string, anoId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCarros}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
  }

  // MOTOS
  getMarcasMotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlMotos}/marcas`);
  }

  getModelosMotos(marcaId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlMotos}/marcas/${marcaId}/modelos`);
  }

  getAnoDetalhesMoto(marcaId: string, modeloId: string, anoId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlMotos}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
  }
}
