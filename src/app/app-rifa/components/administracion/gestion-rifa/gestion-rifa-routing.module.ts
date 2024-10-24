import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RifaComponent } from './rifa/rifa.component';
import { LimiteComponent } from './limite/limite.component';

@NgModule({
  imports: [
    RouterModule.forChild(
      [
        { path: 'rifas', component: RifaComponent },
        { path: 'limites', component: LimiteComponent },
        { path: '**', redirectTo: '/notfound' }
  ])],
  exports: [RouterModule]
})
export class GestionRifaRoutingModule { }
