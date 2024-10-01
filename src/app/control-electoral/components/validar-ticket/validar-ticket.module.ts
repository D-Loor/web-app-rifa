import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidarTicketComponent } from './validar-ticket.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ValidarTicketComponent }];

@NgModule({
  declarations: [ValidarTicketComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ValidarTicketModule { }
