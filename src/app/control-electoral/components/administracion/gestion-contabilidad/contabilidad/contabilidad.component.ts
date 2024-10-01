import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { ContabilidadService } from 'src/app/control-electoral/services/contabilidad.service';
import { FechaService } from 'src/app/control-electoral/services/utils/fecha.service';
import { WindowRef } from 'src/app/control-electoral/services/utils/window.service';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss'],
  providers: [MessageService]
})
export class ContabilidadComponent implements OnInit {
  fechaFiltro: any
  datosContabilidad: any = [];
  contabVentasPagos: any = [];
  contabTicketsGanadores: any = [];
  colsContabVentasPagos: any[] = [];
  colsContabTicketsGanadores: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;

  suertes = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima"];
  cifras = ["Dos", "Tres"];

  constructor(private windowRef: WindowRef, private fechaService: FechaService, 
    private messageService:MessageService,private contabilidadService: ContabilidadService, private spinner: NgxSpinnerService) {
    this.fechaFiltro = this.fechaService.obtenerFechaHoy();
  }

  ngOnInit(): void {
    this.colsContabVentasPagos = [
      { field: 'descripcion', header: 'Descripción', type: 'text' },
      { field: 'valor', header: 'Valor', type: 'text' },
    ];

    this.colsContabTicketsGanadores = [
      { field: 'valor', header: 'Valor', type: 'text' },
      { field: 'cifras', header: 'Cifra', type: 'text' },
      { field: 'suerte', header: 'N.° Suerte', type: 'text' },
      { field: 'premio', header: 'Premio', type: 'text' }
    ]
    this.cargarContabilidad();
  }

  isMobile(): boolean {
    return this.windowRef.isMobile();
  }

  onDateSelect(event: Date) {
    this.fechaFiltro = this.fechaService.formatDate(event);
  }

  cargarContabilidad() {
    this.spinner.show();
    this.contabilidadService.cargarContabilidad(this.fechaFiltro).subscribe({
      next: (data) => {
        let datos = data
        if (data['code'] == 200) {
          datos = data['result'];
          this.contabVentasPagos = [
            { 'descripcion': 'Ventas', 'valor': datos.ventas },
            { 'descripcion': 'Pagos', 'valor': datos.pagos }
          ]
          this.contabTicketsGanadores = datos.ticketsGanadores.map((item) => {
            item.suerte = this.suertes[item.suerte - 1];
            item.cifras = this.cifras[item.cifras - 2];
            return item;
          })
          if(this.contabTicketsGanadores.length == 0){
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No existen datos para esta fecha!',life: 3000 });
          }
        }else{ 
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Algo salió mal!',life: 3000 });
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();  
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message,life: 3000 });
        console.error(error);
      }
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


}
