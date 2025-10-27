import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FipeService } from '../services/fipe.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {

  // ================= CARROS =================
  marcasCarros: any[] = [];
  modelosCarros: any[] = [];
  anosCarros: any[] = [];
  carroDetalhes: any = null;
  marcaCarroSelecionada: any;
  modeloCarroSelecionado: any;
  anoCarroSelecionado: any;

  // ================= MOTOS =================
  marcasMotos: any[] = [];
  modelosMotos: any[] = [];
  anosMotos: any[] = [];
  motoDetalhes: any = null;
  marcaMotoSelecionada: any;
  modeloMotoSelecionado: any;
  anoMotoSelecionado: any;

  constructor(private fipeService: FipeService) {}

  ngOnInit() {
    this.fipeService.getMarcasCarros().subscribe(data => this.marcasCarros = data);
    this.fipeService.getMarcasMotos().subscribe(data => this.marcasMotos = data);
  }

  // ================= CARROS =================
  selecionarMarcaCarro(marca: any) {
    this.marcaCarroSelecionada = marca;
    this.modeloCarroSelecionado = null;
    this.anosCarros = [];
    this.carroDetalhes = null;

    this.fipeService.getModelosCarros(marca.codigo)
      .pipe(catchError(err => { console.error(err); return of({ modelos: [] }); }))
      .subscribe(data => this.modelosCarros = data.modelos || []);
  }

  selecionarModeloCarro(modelo: any) {
    this.modeloCarroSelecionado = modelo;
    this.anosCarros = [];
    this.carroDetalhes = null;

    this.fipeService.getModelosCarros(this.marcaCarroSelecionada.codigo)
      .pipe(catchError(err => { console.error(err); return of({ anos: [] }); }))
      .subscribe(data => this.anosCarros = data.anos || []);
  }

  selecionarAnoCarro(ano: any) {
    this.anoCarroSelecionado = ano;
    this.fipeService.getAnoDetalhesCarro(this.marcaCarroSelecionada.codigo, this.modeloCarroSelecionado.codigo, ano.codigo)
      .pipe(catchError(err => { 
        console.error(err); 
        alert('Detalhes deste carro não estão disponíveis.');
        return of(null);
      }))
      .subscribe(data => this.carroDetalhes = data);
  }

  // ================= MOTOS =================
  selecionarMarcaMoto(marca: any) {
    this.marcaMotoSelecionada = marca;
    this.modeloMotoSelecionado = null;
    this.anosMotos = [];
    this.motoDetalhes = null;

    this.fipeService.getModelosMotos(marca.codigo)
      .pipe(catchError(err => { console.error(err); return of({ modelos: [] }); }))
      .subscribe(data => this.modelosMotos = data.modelos || []);
  }

  selecionarModeloMoto(modelo: any) {
    this.modeloMotoSelecionado = modelo;
    this.anosMotos = [];
    this.motoDetalhes = null;

    this.fipeService.getModelosMotos(this.marcaMotoSelecionada.codigo)
      .pipe(catchError(err => { console.error(err); return of({ anos: [] }); }))
      .subscribe(data => this.anosMotos = data.anos || []);
  }

  selecionarAnoMoto(ano: any) {
    this.anoMotoSelecionado = ano;
    this.fipeService.getAnoDetalhesMoto(this.marcaMotoSelecionada.codigo, this.modeloMotoSelecionado.codigo, ano.codigo)
      .pipe(catchError(err => { 
        console.error(err); 
        alert('Detalhes desta moto não estão disponíveis.');
        return of(null);
      }))
      .subscribe(data => this.motoDetalhes = data);
  }
}
