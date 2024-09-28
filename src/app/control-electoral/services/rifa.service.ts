import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FechaService } from './utils/fecha.service';

@Injectable({
  providedIn: 'root'
})
export class RifaService {

  urlBase = environment.urlBase;
  id_usuario;
  usuario
  constructor(private httpCliente: HttpClient, private fechaService: FechaService) {
    this.id_usuario = localStorage.getItem('id_usuario');
    this.usuario = localStorage.getItem('usuario');
  }

  crearRifa(data: any): Observable<any> {
    let datos = {
      "valor": data.valorRifa,
      "primera_suerte": data.rifasControl[0],
      "segunda_suerte": data.rifasControl[1],
      "tercera_suerte": data.rifasControl[2],
      "cuarta_suerte": data.rifasControl[3],
      "quinta_suerte": data.rifasControl[4],
      "sexta_suerte": data.rifasControl[5],
      "septima_suerte": data.rifasControl[6],
      "estado": "1",
      "cifras": data.selectedCifra.code,
      "limite": data.limite
    }
    return this.httpCliente.post<any>(`${this.urlBase}rifa`, datos);
  }

  actualizarRifa(data: any, id: any): Observable<any> {
    let datos = {
      "id": id,
      "valor": data.valorRifa,
      "primera_suerte": data.rifasControl[0],
      "segunda_suerte": data.rifasControl[1],
      "tercera_suerte": data.rifasControl[2],
      "cuarta_suerte": data.rifasControl[3],
      "quinta_suerte": data.rifasControl[4],
      "sexta_suerte": data.rifasControl[5],

      "septima_suerte": data.rifasControl[6],
      "estado": data.selectedEstado.value,
      "cifras": data.selectedCifra.code,
      "limite": data.limite
    }
    return this.httpCliente.put<any>(`${this.urlBase}rifa/${id}`, datos);
  }

  listaRifas(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}rifa`);
  }

  listaRifasAVender(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}rifas/activas`);
  }

  comprarTicket(data: any,numSuerte): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf', // Esto indica que esperas un PDF como respuesta
    });

    let datos = {
      "rifa_id": data.id,
      "usuario_id": this.id_usuario,
      "numero": numSuerte,
      "nombre_vendedor": this.usuario,
      "fecha_venta": this.fechaService.obtenerFechaHoy(),
      "fecha_juego": this.fechaService.obtenerFechaHoy()
    }
    
    return this.httpCliente.post(`${this.urlBase}ticket`, datos, { 
      headers: headers, 
      responseType: 'blob'  // Aquí se especifica que la respuesta será un archivo
    });
  }

  conteoVendidos(fechaHoy: any, numero: any, idRifa: any): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}ticket/conteo-vendidos/${fechaHoy}/${numero}/${idRifa}`);
  }

  ticketVendidos(fechaVenta):Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}ticket/ticketVendidos/${fechaVenta}`);

  }
}
