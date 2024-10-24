import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FechaService } from './utils/fecha.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  urlBase = environment.urlBase;
  constructor(private httpCliente: HttpClient, private fechaService: FechaService) {}

  listaResultados(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}suerte`);
  }

  crearResultado(data: any): Observable<any> {
    return this.httpCliente.post<any>(`${this.urlBase}suerte`, data);
  }

  actualizarResultado(data: any, id: any): Observable<any> {
    data = {...data, id:id};
    return this.httpCliente.put<any>(`${this.urlBase}suerte/${id}`, data);
  }

  cargarContabilidad(fecha:any): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}ticket/contabilidad/${fecha}`);
  }

}
