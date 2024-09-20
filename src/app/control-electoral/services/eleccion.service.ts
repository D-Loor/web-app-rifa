import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Eleccion } from '../api/interface';

@Injectable({
  providedIn: 'root'
})
export class EleccionService {

  urlBase;
  constructor(private httpCliente:HttpClient) { 
    this.urlBase = environment.urlBase;
  }

  obtenerEleccion(): Observable<Eleccion> {
    return this.httpCliente.get<any>(`${this.urlBase}obtener-eleccion/EP2025`);
  }

  listEleccion(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}eleccion`);
  }
}
