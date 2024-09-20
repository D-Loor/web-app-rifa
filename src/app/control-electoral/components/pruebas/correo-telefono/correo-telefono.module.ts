import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorreoTelefonoRoutingModule } from './correo-telefono-routing.module';
import { CorreoTelefonoComponent } from './correo-telefono.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


@NgModule({
  declarations: [
    CorreoTelefonoComponent
  ],
  imports: [
    CommonModule,
    CorreoTelefonoRoutingModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule
    
  ], schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CorreoTelefonoModule { }
