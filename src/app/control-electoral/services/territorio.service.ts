import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerritorioService {

  urlBase;
  constructor(private httpCliente: HttpClient) {
    this.urlBase = environment.urlBase;
  }

  paises(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}pais/obtener-territorios`);
  }

  provincias(id: string): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}provincia/obtener-territorios/${id}`);
  }

  distritos(id: string): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}distrito/obtener-territorios/${id}`);
  }

  cantones(territorio: string, id: string): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}canton/obtener-territorios/${territorio}/${id}`);
  }

  parroquias(id: string): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}parroquia/obtener-territorios/canton/${id}`);
  }

  zonas(id: string) {
    return this.httpCliente.get<any>(`${this.urlBase}zona/obtener-territorios/${id}`);
  }

  recinto(id: string, territorio: string) {
    return this.httpCliente.get<any>(`${this.urlBase}recinto/obtener-territorios/${territorio}/${id}`);
  }

  mesa(id: string, territorio: string){
    return this.httpCliente.get<any>(`${this.urlBase}mesa/obtener-territorios/${territorio}/${id}`);
  }

  obtenerLocalidades(id: string): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}parroquia/obtener-localidades/${id}`);
  }

  elimanarTerritorio(id) {
    return this.httpCliente.delete(`${this.urlBase}territorio/${id}`);
  }

  actualizarTerritorio(datosterritorio: any, id: string) {
    return this.httpCliente.put(`${this.urlBase}territorio/${id}`, datosterritorio);
  }

  modificarPadronTerritorio(datosTerritorio: any) {
    const url = `${this.urlBase}modificar-territorio-padron`;
    return this.httpCliente.post<any>(url, datosTerritorio);
  }
}
