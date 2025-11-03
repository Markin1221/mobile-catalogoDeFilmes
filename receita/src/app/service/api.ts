import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) { }

  apiLink = "https://api.api-ninjas.com/v2/recipe"
  
  getReceita(){
    return this.http.get(this.apiLink)
  }
}
