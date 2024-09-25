import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RifaService {

  urlBase = environment.urlBase;

  constructor(private httpCliente: HttpClient) { }

  crearRifa(data: any): Observable<any> {
    let datos = {
      "valor": data.valorRifa,
      "primera_suerte": data.rifasControl[0],
      "segunda_suerte": data.rifasControl[1],
      "tercera_suerte": data.rifasControl[2],
      "cuarta_suerte":  data.rifasControl[3],
      "quinta_suerte":  data.rifasControl[4],
      "sexta_suerte":  data.rifasControl[5],
      "septima_suerte": data.rifasControl[6],
      "estado": "1",
      "cifras":data.selectedCifra.code,
      "limite":data.limite
    }
    return this.httpCliente.post<any>(`${this.urlBase}rifa`, datos);
  }

  actualizarRifa(data: any,id:any): Observable<any> {
    let datos = {
      "id":id,
      "valor": data.valorRifa,
      "primera_suerte": data.rifasControl[0],
      "segunda_suerte": data.rifasControl[1],
      "tercera_suerte": data.rifasControl[2],
      "cuarta_suerte":  data.rifasControl[3],
      "quinta_suerte":  data.rifasControl[4],
      "sexta_suerte":  data.rifasControl[5],
      "septima_suerte": data.rifasControl[6],
      "estado": data.selectedEstado.value,
      "cifras":data.selectedCifra.code,
      "limite":data.limite
    }
    return this.httpCliente.put<any>(`${this.urlBase}rifa/${id}`, datos);
  }

  listaRifas(): Observable<any> {
    return this.httpCliente.get<any>(`${this.urlBase}rifa`);
  }
}
