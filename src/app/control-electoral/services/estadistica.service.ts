import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {
  urlBase = environment.urlBase;

  constructor(private httpCliente: HttpClient) { }

  obtenerConteoRegistros(request: any): Observable<any> {
    const url = `${this.urlBase}estadisticas/conteo-registros`;
    return this.httpCliente.post<any>(url, request);
  }

}
