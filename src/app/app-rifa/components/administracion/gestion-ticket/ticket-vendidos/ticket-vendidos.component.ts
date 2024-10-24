import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { RifaService } from 'src/app/app-rifa/services/rifa.service';
import { FechaService } from 'src/app/app-rifa/services/utils/fecha.service';

@Component({
  selector: 'app-ticket-vendidos',
  templateUrl: './ticket-vendidos.component.html',
  styleUrls: ['./ticket-vendidos.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TicketVendidosComponent implements OnInit {
  fechaFiltro: any;
  listaTickets: any[] = [];
  listaTicketsConteo: any[] = [];
  cols: any[] = [];
  colsConteo: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  globalFilterFields2: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  fechaHoy: any;
  totalTicketsVendidos: number = 0;
  @ViewChild('dt') dt: any;
  constructor(private rifaService: RifaService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fechaService: FechaService, private confirmationService: ConfirmationService) {
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
        this.totalTicketsVendidos = 0;
        if (data['code'] == 200 && data['result'].length > 0) {
          this.listaTickets = data['result'];
          this.listaTickets.forEach(ticket => {
            this.totalTicketsVendidos += ticket['rifa'].valor || 0;
          });

          this.cargarConteoTicketsVendidos();
        } else {
          this.listaTickets = [];
          this.listaTicketsConteo = [];
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No hay tickets vendidos', life: 3000 });
        }

        this.spinner.hide();
      },
      error: (error) => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message });
        this.spinner.hide();
      }
    });
  }

  cargarConteoTicketsVendidos(): void {
    this.spinner.show();
    this.rifaService.conteoTicketVendidos(this.fechaFiltro).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.listaTicketsConteo = data['result'].conteo;
          this.colsConteo = [];
          this.colsConteo.push({ field: 'numero', header: 'Número', type: 'text', maxWidth: '30%' });

          data['result'].tickets.forEach((ticket, index) => {
            this.colsConteo.push({ field: '' + (index + 1), header: '$' + ticket, type: 'text', maxWidth: '30%' });
          });

          this.colsConteo.push({ field: 'total', header: 'Total', type: 'text', maxWidth: '30%' });
          this.globalFilterFields2 = this.generateGlobalFilterFields2();
        } else {
          this.listaTicketsConteo = [];
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message });
        this.spinner.hide();
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
      .filter(col => col.type === 'text') 
      .map(col => col.field); 
  }

  generateGlobalFilterFields2(): string[] {
    return this.colsConteo
      .filter(col => col.type === 'text') 
      .map(col => col.field); 
  }

  calcularTotal(event?: any) {
    this.totalTicketsVendidos = 0;
    const filteredTickets = this.dt.filteredValue || this.listaTickets;
    filteredTickets.forEach((ticket) => {
      this.totalTicketsVendidos += ticket['rifa']?.valor || 0;
    });
  }

  eliminarTicket(ticket:string) {
    this.spinner.show();
    this.rifaService.eliminarTicket(ticket).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.messageService.add({ key: 'tst', severity:'success', summary: 'Éxito!', detail: 'Ticket eliminado exitosamente.', life: 3000 });
          this.cargarTicketsVendidos();

        } else {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No se ha encontrado el ticket.', life: 3000 });
        }

        this.spinner.hide();
      },
      error: (error) => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message });
        this.spinner.hide();
      }
    });
  }

  confirmarEliminacion(event: Event, ticket: any) {
    this.confirmationService.confirm({
        key: 'confirm2',
        target: event.target || new EventTarget,
        message: '¿Desea eliminar el ticket #' + ticket.numero + ' de $' + ticket.rifa.valor + '?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.eliminarTicket(ticket.id);
        }
    });
}
}
