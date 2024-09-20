import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  urlBase = environment.urlBase;

  constructor(private httpCliente: HttpClient) { }

  obtenerRoles(): Observable<any> {
    const url = `${this.urlBase}rol`;
    return this.httpCliente.get<any>(url);
  }

  obtenerRolPorId(id: string): Observable<any> {
    const url = `${this.urlBase}rol/obtener-sucesores/${id}`;
    return this.httpCliente.get<any>(url);
  }

  obtenerRolesAsignados(data: any): Observable<any> {
    const url = `${this.urlBase}rol/obtener-asignados`;
    return this.httpCliente.post<any>(url, data);
  }

  actualizarRol(datosRol):Observable<any>{
    const url = `${this.urlBase}rol/${datosRol.id}`;
    return this.httpCliente.put<any>(url, datosRol);
  }

}
