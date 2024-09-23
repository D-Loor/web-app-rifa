import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  urlBase = environment.urlBase;

  constructor(private httpCliente: HttpClient) { }

  login(correo: any, password: any): Observable<any> {
    const url = `${this.urlBase}login`;
    return this.httpCliente.post<any>(url, { correo, password });
  }

  crearUsuario(data: any): Observable<any> {
    const url = `${this.urlBase}usuario`;
    const datos = {
      "rol_id": data.selectedRol.id,
      "correo": data.correo,
      "estado": "1",
      "usuario": data.nombres,
      "rol": data.selectedRol.rol
    }
    return this.httpCliente.post<any>(url, datos);
  }

  listUsuarios(): Observable<any> {
    const url = `${this.urlBase}usuario`;
    return this.httpCliente.get<any>(url);
  }

  actualizarUsuario(data: any, id: string): Observable<any> {
    const url = `${this.urlBase}usuario/${id}`;
    const datos = {
      "id": id,
      "rol_id": data.selectedRol.id,
      "correo": data.correo,
      "estado": data.selectedEstado.value,
      "usuario": data.nombres,
      "rol": data.selectedRol.rol
    }
    return this.httpCliente.put<any>(url, datos);
  }

  terriroio(data: any): Observable<any> {
    const url = `${this.urlBase}territorio`;
    return this.httpCliente.post<any>(url, data);
  }

  rolesAsignadosTerriroio(data: any): Observable<any> {
    const url = `${this.urlBase}territorio/roles-asignados`;
    return this.httpCliente.post<any>(url, data);
  }

  

  usuarioUpdate(data: any): Observable<any> {
    let dato = {
      id: data.id,
      estado: data.estado
    }
    const url = `${this.urlBase}usuario/${data.id}`;
    const resultado = { ...dato };
    return this.httpCliente.put<any>(url, resultado);
  }

  restablecerPassword(data: any): Observable<any> {
    const url = `${this.urlBase}usuario/restablecer-password`;
    return this.httpCliente.post<any>(url, data);
  }

  validarCedula(cedula: string): Observable<any> {
    const url = `${this.urlBase}validar-cedula/${cedula}`;
    return this.httpCliente.get<any>(url);
  }

  registrarUsuarioPadron(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlBase}registrar-usuario-padron`;
    return this.httpCliente.post<any>(url, data, { headers });
  }

  eliminarUsuario(idUsuario: string): Observable<any> {
    return this.httpCliente.delete(`${this.urlBase}usuario/${idUsuario}`);
  }
}
