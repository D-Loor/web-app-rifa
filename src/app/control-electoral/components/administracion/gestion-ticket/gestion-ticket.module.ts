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


@NgModule({
  declarations: [
    TiketComponent
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
    InputNumberModule
  ]
})
export class GestionTicketModule { }
