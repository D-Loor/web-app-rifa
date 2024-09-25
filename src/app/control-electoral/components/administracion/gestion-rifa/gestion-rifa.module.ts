import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRifaRoutingModule } from './gestion-rifa-routing.module';
import { RifaComponent } from './rifa/rifa.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedPipesModule } from 'src/app/control-electoral/pipes/shared-pipes.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PasswordModule } from 'primeng/password';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    RifaComponent
  ],
  imports: [
    CommonModule,
    GestionRifaRoutingModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    AutoCompleteModule,
		ChipModule,
    TooltipModule,
    SelectButtonModule,
    SharedPipesModule,
    ConfirmDialogModule,
    ReactiveFormsModule, 
    PasswordModule,
    NgxSpinnerModule,
    DividerModule
  ]
})
export class GestionRifaModule { }
