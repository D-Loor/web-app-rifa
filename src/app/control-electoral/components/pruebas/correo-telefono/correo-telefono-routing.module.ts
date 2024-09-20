import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorreoTelefonoComponent } from './correo-telefono.component';

const routes: Routes = [{ path: '', component: CorreoTelefonoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorreoTelefonoRoutingModule { }
