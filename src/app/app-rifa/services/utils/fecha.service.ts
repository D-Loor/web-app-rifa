import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  obtenerFechaHoy(): string {
    const fecha = new Date(); // Captura la fecha actual
    const anio = fecha.getFullYear(); // Obtiene el año
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11), así que sumamos 1
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtiene el día y lo formatea a 2 dígitos
    return `${anio}-${mes}-${dia}`; // Retorna la fecha en el formato deseado
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
