import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase = environment.urlBase;

  constructor(private httpCliente:HttpClient) { }

  login(correo:any, password:any):Observable<any> {
    const url = `${this.urlBase}login`;
    return this.httpCliente.post<any>(url, {correo, password});
  }

  crearUsuario(datos:any):Observable<any> {
    const url = `${this.urlBase}usuario`;
    return this.httpCliente.post<any>(url, datos);
  }

  actualizarUsuario(data:any,id:string): Observable<any>{
    const url = `${this.urlBase}usuario/${id}`;
    return this.httpCliente.put<any>(url, data);
  }

  terriroio(data:any):Observable<any>{
    const url = `${this.urlBase}territorio`;
    return this.httpCliente.post<any>(url, data);
  }

  rolesAsignadosTerriroio(data:any):Observable<any>{
    const url = `${this.urlBase}territorio/roles-asignados`;
    return this.httpCliente.post<any>(url, data);
  }

  listUsuarios(data: any):Observable<any>{
    const url = `${this.urlBase}usuario/obtener-sucesores`;
    return this.httpCliente.post<any>(url, data);
  }

  usuarioUpdate(data:any): Observable<any>{
    let dato = {
      id:data.id,
      estado:data.estado
    }
    const url = `${this.urlBase}usuario/${data.id}`;
    const resultado = { ...dato };
    return this.httpCliente.put<any>(url, resultado);
  }

  restablecerPassword(data:any): Observable<any> {
    const url = `${this.urlBase}usuario/restablecer-password`;
    return this.httpCliente.post<any>(url, data);
  }

  validarCedula(cedula:string): Observable<any>{
    const url = `${this.urlBase}validar-cedula/${cedula}`;
    return this.httpCliente.get<any>(url);
  }

  registrarUsuarioPadron(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlBase}registrar-usuario-padron`;
    return this.httpCliente.post<any>(url, data,{headers});
  }

  eliminarUsuario(idUsuario: string): Observable<any>{
    return this.httpCliente.delete(`${this.urlBase}usuario/${idUsuario}`);
  }
}
