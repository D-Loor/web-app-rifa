import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';

import { VoluntarioRoutingModule } from './voluntario-routing.module';
import { ConfirmacionRegistroComponent } from './confirmacion-registro/confirmacion-registro.component';
import { RegistroVoluntarioComponent } from './registro-voluntario/registro-voluntario.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    RegistroVoluntarioComponent,
    ConfirmacionRegistroComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    StepsModule,
    ToastModule,
    CardModule,
    ReactiveFormsModule,
    KeyFilterModule,
    DialogModule,
    InputMaskModule,
    DropdownModule,
    VoluntarioRoutingModule,
    AutoCompleteModule,
    TableModule,
    FileUploadModule,
    RippleModule,
    ToolbarModule,
    RatingModule,
    InputTextareaModule,
    RadioButtonModule,
    InputNumberModule,
		ChipModule,
    TooltipModule,
    SelectButtonModule,
    SharedPipesModule,
    NgxSpinnerModule,
  ]
})
export class VoluntarioModule { }
