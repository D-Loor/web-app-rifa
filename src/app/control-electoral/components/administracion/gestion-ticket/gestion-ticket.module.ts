import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionTicketRoutingModule } from './gestion-ticket-routing.module';
import { TiketComponent } from './tiket/tiket.component';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TicketVendidosComponent } from './ticket-vendidos/ticket-vendidos.component';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { SharedPipesModule } from 'src/app/control-electoral/pipes/shared-pipes.module';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
  declarations: [
    TiketComponent,
    TicketVendidosComponent
  ],
  imports: [
    CommonModule,
    GestionTicketRoutingModule,
    FormsModule,
		DataViewModule,
		PickListModule,
		OrderListModule,
		InputTextModule,
		DropdownModule,
		RatingModule,
		ButtonModule,
    NgxSpinnerModule,
    ToastModule,
    DialogModule,
    InputNumberModule,
    ToolbarModule,
    CalendarModule,
    TableModule,
    SharedPipesModule,
    ProgressBarModule
  ]
})
export class GestionTicketModule { }
