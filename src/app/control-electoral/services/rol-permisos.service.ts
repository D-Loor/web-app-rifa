import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permiso } from '../api/interface';

@Injectable({
  providedIn: 'root'
})
export class RolPermisosService {

  urlBase = environment.urlBase;

  constructor(private httpCliente:HttpClient) { }

  listPermisos():Observable<any> {
    const url = `${this.urlBase}permiso`;
    return this.httpCliente.get<any>(url);
  }

  postPermisos(data:any):Observable<any> {
    
    const url = `${this.urlBase}permiso`;
    return this.httpCliente.post<any>(url,data);
  }

  putPermiso(data:any): Observable<any> {
    
    const url = `${this.urlBase}permiso/${data.id}`;
    return this.httpCliente.put(url, data);
  }

  deletePermiso(id): Observable<any> {
    
    const url = `${this.urlBase}permiso/${id}`;
    return this.httpCliente.delete(url);
  }
}