import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiketComponent } from './tiket/tiket.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([{ path: 'tickets', component: TiketComponent },
    { path: '**', redirectTo: '/notfound' }
    ])],
  exports: [RouterModule]
})
export class GestionTicketRoutingModule { }
