import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RifaService } from '../../services/rifa.service';
import { FechaService } from '../../services/utils/fecha.service';

@Component({
  selector: 'app-validar-ticket',
  templateUrl: './validar-ticket.component.html',
  styleUrls: ['./validar-ticket.component.scss']
})
export class ValidarTicketComponent implements OnInit {
  codigoTicket: string;
  resultado: any;
  premio: any;
  fechaHoy;

  suertes = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima"];
  constructor(private route: ActivatedRoute, private rifaServide: RifaService, private fechaService: FechaService) {
    this.fechaHoy = fechaService.obtenerFechaHoy();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codigoTicket = params.get('codigoTicket');
      console.log('ID del ticket:', this.codigoTicket);
    });

    this.cargarResultado();
  }

  cargarResultado(): void {
    this.rifaServide.validar_ticket(this.codigoTicket, this.fechaHoy).subscribe({
      next: (data: any) => {
        if (data.result == 0) {
          this.resultado = `Lo sentimos! ⏳ La vigencia de este ticket ha finalizado, continúa probando tu suerte.`;
        } else if (data.result == 1) {
          let premio = data.data;
          let pago = premio.pago;
          let suertesGanadas = premio.suertesGanadas
          let suertesMapeadas = suertesGanadas.map(suerte => this.suertes[suerte - 1]);
          let suertesTexto = "";
          if (suertesMapeadas.length === 1) {
            suertesTexto = suertesMapeadas[0];
          } else if (suertesMapeadas.length === 2) {
            suertesTexto = suertesMapeadas.join(" y ");
          } else {
            const todasMenosUltima = suertesMapeadas.slice(0, -1).join(", ");
            const ultimaSuerte = suertesMapeadas[suertesMapeadas.length - 1];
            suertesTexto = `${todasMenosUltima} y ${ultimaSuerte}`;
          }
          this.resultado = `<strong>¡Felicitaciones!</strong> 🎉 Este ticket ha ganado la: <strong>${suertesTexto}</strong> suerte con un valor total: <strong>$${pago}</strong>`;
        } else if (data.result == 2) {
          this.resultado = `Lo sentimos! 😔 Esta vez no has ganado, esperamos que en la próxima la suerte te acompañe.`;
        } else if (data.result == 3) {
          this.resultado = `Sigue a la espera! ⏱️ Pronto se subirán los ganadores, esperamos que la suerte te acompañe.`;
        } else if (data.result == 4) {
          this.resultado = `Lo sentimos! ❌ Este ticket no es válido, continúa probando tu suerte.`;
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    })
  }
}
