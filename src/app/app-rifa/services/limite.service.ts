import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptedService } from './utils/encrypted.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LimiteService {
  urlBase = environment.urlBase;
  constructor(private httpCliente: HttpClient, private encryptedService: EncryptedService) {
  }

  crearLimite(data: any): Observable<any> {
    const url = `${this.urlBase}limite`;
    return this.httpCliente.post<any>(url, data);
  }

  listarLimites(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}limite`);
  }

  actualizarLimite(data: any, id: any): Observable<any> {
    return this.httpCliente.put<any>(`${this.urlBase}limite/${id}`, data);
  }

  eliminarLimite(id:string):Observable<any> {
    return this.httpCliente.delete(`${this.urlBase}limite/${id}`);
  }

  obtenerLimiteDia(dia:string):Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}limite/obtener-dia/${dia}`);
  }
}
