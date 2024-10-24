import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioSesionRoutingModule } from './inicio-sesion-routing.module';
import { InicioSesionComponent } from './inicio-sesion.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { KeyFilterModule } from 'primeng/keyfilter';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    InicioSesionComponent
  ],
  imports: [
    CommonModule,
    InicioSesionRoutingModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ToastModule,
    CardModule,
    ReactiveFormsModule,
    KeyFilterModule,
    NgxSpinnerModule,
  ]
})
export class InicioSesionModule { }
