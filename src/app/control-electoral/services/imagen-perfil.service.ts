import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appConfig } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ImagenPerfilService {
  private config = appConfig.apiImagenes;
  constructor(private httpCliente: HttpClient) { }

  obtenerToken(): Observable<string> {
    return this.httpCliente.post(this.config.urlToken,
      { userName: this.config.userName, password: this.config.password },
      { responseType: 'text' });
  }

  obtenerImagen(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${data.token}`, 'cedula': data.ci });
    return this.httpCliente.post<any>(this.config.urlImagen, {}, { headers });
  }
}
