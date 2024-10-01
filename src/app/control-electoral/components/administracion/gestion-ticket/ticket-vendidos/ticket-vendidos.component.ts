import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { RifaService } from 'src/app/control-electoral/services/rifa.service';
import { FechaService } from 'src/app/control-electoral/services/utils/fecha.service';

@Component({
  selector: 'app-ticket-vendidos',
  templateUrl: './ticket-vendidos.component.html',
  styleUrls: ['./ticket-vendidos.component.scss'],
  providers: [MessageService]
})
export class TicketVendidosComponent implements OnInit {
  fechaFiltro: any;
  listaTickets: any[] = [];
  cols: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  fechaHoy: any;
  constructor(private rifaService: RifaService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fechaService: FechaService) {
    this.fechaFiltro = this.fechaService.obtenerFechaHoy();
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'numero', header: 'Número', type: 'text', maxWidth: '30%' },
      { field: 'rifa.valor', header: 'Valor', type: 'text', maxWidth: '30%' },
      { field: 'usuario.usuario', header: 'Vendedor', type: 'text', maxWidth: '30%' },
      { field: 'codigo', header: 'Codigo', type: 'text', maxWidth: '30%' },
      { field: 'fecha_venta', header: 'Fecha de Venta', type: 'text', maxWidth: '30%' },
    ];
    this.globalFilterFields = this.generateGlobalFilterFields();
    this.cargarTicketsVendidos();
  }

  cargarTicketsVendidos(): void {
    this.spinner.show();
    this.rifaService.ticketVendidos(this.fechaFiltro).subscribe({
      next: (data) => {
        if (data['code'] == 200 && data['result'].length > 0) {
          this.listaTickets = data['result'];
        } else {
          this.listaTickets = [];
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No hay tickets vendidos', life: 3000 });
        }

        this.spinner.hide();
      },
      error: (error) => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message });
      }
    });
  }

  onDateSelect(event: Date) {
    this.fechaFiltro = this.fechaService.formatDate(event);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')  // Solo incluimos columnas de tipo 'text'
      .map(col => col.field);  // Extraemos el campo de cada columna
  }

}
