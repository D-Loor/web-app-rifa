import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { HighchartsChartModule } from 'highcharts-angular';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SharedPipesModule } from 'src/app/control-electoral/pipes/shared-pipes.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    PanelModule,
    ToolbarModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    ButtonModule,
    HighchartsChartModule,
    TableModule,
    InputTextModule,
    SharedPipesModule,
    InputSwitchModule,
    NgxSpinnerModule,
  ]
})
export class DashboardModule { }
