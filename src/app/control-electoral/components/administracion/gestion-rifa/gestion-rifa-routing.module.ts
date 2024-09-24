import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RifaComponent } from './rifa/rifa.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild([{ path: 'rifas', component: RifaComponent },
  { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})
export class GestionRifaRoutingModule { }
