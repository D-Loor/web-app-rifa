import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiketComponent } from './tiket/tiket.component';
import { TicketVendidosComponent } from './ticket-vendidos/ticket-vendidos.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([{ path: 'tickets', component: TiketComponent },
    { path: 'tickets-vendidos', component: TicketVendidosComponent },
    { path: '**', redirectTo: '/notfound' }
    ])],
  exports: [RouterModule]
})
export class GestionTicketRoutingModule { }
