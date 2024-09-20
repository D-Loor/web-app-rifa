import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPadronRoutingModule } from './gestion-padron-routing.module';
import { EleccionesComponent } from './elecciones/elecciones.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
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


@NgModule({
  declarations: [
    EleccionesComponent
  ],
  imports: [
    CommonModule,
    GestionPadronRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
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
    ReactiveFormsModule,
  ]
})
export class GestionPadronModule { }
