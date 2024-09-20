import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroVoluntarioComponent } from './registro-voluntario/registro-voluntario.component';
import { ConfirmacionRegistroComponent } from './confirmacion-registro/confirmacion-registro.component';

const routes: Routes = [
  { path: '', component: RegistroVoluntarioComponent },
  { path: 'confirmacion', component: ConfirmacionRegistroComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoluntarioRoutingModule { }
