import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionContabilidadRoutingModule } from './gestion-contabilidad-routing.module';
import { ResultadosComponent } from './resultados/resultados.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SharedPipesModule } from 'src/app/control-electoral/pipes/shared-pipes.module';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ContabilidadComponent } from './contabilidad/contabilidad.component';


@NgModule({
  declarations: [
    ResultadosComponent,
    ContabilidadComponent
  ],
  imports: [
    CommonModule,
    GestionContabilidadRoutingModule,
    ToolbarModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SharedPipesModule,
    ToastModule,
    NgxSpinnerModule,
    DialogModule,
    ReactiveFormsModule,
    CalendarModule
  ]
})
export class GestionContabilidadModule { }
