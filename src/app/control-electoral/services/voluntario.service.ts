import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PadronElectoral, VoluntarioDatosRegistro } from '../api/interface';


@Injectable({
  providedIn: 'root'
})
export class VoluntarioService {

  urlBase;
  constructor(private httpCliente:HttpClient) { 
    this.urlBase = environment.urlBase;
  }

  obtenerPersonaPadron(cedula:string, eleccion_id:number): Observable<PadronElectoral> {
    return this.httpCliente.get<any>(`${this.urlBase}obtener-persona-padron/${cedula}/${eleccion_id}`);
  }
  obtenerUbicacionPadron(cedula:string, eleccion_id:number): Observable<PadronElectoral> {
    return this.httpCliente.get<any>(`${this.urlBase}obtener-ubicacion-padron/${cedula}/${eleccion_id}`);
  }

  voluntario(data: VoluntarioDatosRegistro, eleccion): Observable<VoluntarioDatosRegistro> {
    const url = `${this.urlBase}voluntario-registro`;
    const conbinacion = {...data, ...eleccion};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpCliente.post<VoluntarioDatosRegistro>(url, conbinacion, { headers });
  }

  voluntarioUpdate(data:VoluntarioDatosRegistro, datos:any): Observable<VoluntarioDatosRegistro>{
    const url = `${this.urlBase}voluntario/${data.id}`;
    const resultado = { ...data, ...datos };
    return this.httpCliente.put<VoluntarioDatosRegistro>(url, resultado);
  }

  listaVoluntarios(): Observable<any>{
    const url = `${this.urlBase}voluntario`;
    return this.httpCliente.get<any>(url);
  }

  listarVoluntariosEleccion(data:any): Observable<any>{
    const url = `${this.urlBase}voluntario/eleccion-territorio`;
    return this.httpCliente.post<any>(url,data);
  }

  validarCorreoTelefono(correo: string, telefono: string): Observable<any> {
    let params = new HttpParams()
      .set('correo', correo)
      .set('telefono', telefono);
    const url = `${this.urlBase}validar-contactos`;
    return this.httpCliente.get<any>(url, { params });
  }
  

}
