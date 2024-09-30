import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { ContabilidadService } from 'src/app/control-electoral/services/contabilidad.service';

export function threeDigitNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isValid = /^\d{3}$/.test(value); // Verifica si el valor tiene exactamente 3 dígitos numéricos
    return isValid ? null : { invalidThreeDigitNumber: true }; // Retorna un error si no es válido
  };
}
@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
  providers: [MessageService]
})
export class ResultadosComponent implements OnInit {
  listaResultados: any[] = [];
  cols: any[] = [];
  rowsInit = appConfig.rowsInit;
  globalFilterFields: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  resultadoForm: FormGroup;
  crearResultado: boolean = false;
  verResultado: boolean = false;
  resultadoActualizar: boolean = false;
  idResultado: any = null;
  constructor(private messageService: MessageService,
    private spinner: NgxSpinnerService, private fb: FormBuilder, private contabilidadService: ContabilidadService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'primera_suerte', header: '1.° Suerte', type: 'text', maxWidth: '40%' },
      { field: 'segunda_suerte', header: '2.° Suerte', type: 'text', maxWidth: '40%' },
      { field: 'tercera_suerte', header: '3.° Suerte', type: 'text', maxWidth: '40%' },
      { field: 'cuarta_suerte', header: '4.° Suerte', type: 'textDialog', maxWidth: '40%' },
      { field: 'quinta_suerte', header: '5.° Suerte', type: 'textDialog', maxWidth: '40%' },
      { field: 'sexta_suerte', header: '6.° Suerte', type: 'textDialog', maxWidth: '40%' },
      { field: 'septima_suerte', header: '7.° Suerte', type: 'textDialog', maxWidth: '40%' },
      { field: 'fecha', header: 'Fecha de resultados', type: 'text', maxWidth: '40%' },
    ];
    this.globalFilterFields = this.generateGlobalFilterFields();
    this.resultadoForm = this.fb.group({
      fecha: ['', Validators.required],
      primera_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      segunda_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      tercera_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      cuarta_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      quinta_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      sexta_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
      septima_suerte: ['', [Validators.required, threeDigitNumberValidator()]],
    });
    this.cargarResultados();
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  cargarResultados() {
    this.spinner.show();
    this.contabilidadService.listaResultados().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.listaResultados = res['result'];
      },
      error: (err) => {
        this.spinner.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
      }
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getTextColumns() {
    return this.cols.filter(col => col.type === 'text');
  }

  agregarFila() {
    this.crearResultado = true;
  }

  cerrarDialog() {
    this.crearResultado = false;
    this.resultadoForm.reset();
    this.resultadoForm.enable();
  }

  onDateSelect(event: Date) {
    const formattedDate = this.formatDate(event);
    this.resultadoForm.patchValue({ fecha: formattedDate });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  guardar(opcion) {

    if (this.resultadoForm.valid) {
      if (opcion === 'guardar') {
        this.guardarResultados();
      } else if (opcion === 'actualizar') {
        this.actualizarResultados();
      }
    } else {
      this.resultadoForm.markAllAsTouched();
    }
  }

  actualizarResultados() {
    this.spinner.show();
    this.contabilidadService.actualizarResultado(this.resultadoForm.value, this.idResultado).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Suerte actualizada exitosamente', life: 3000 })
          this.cargarResultados();
          this.cerrarDialog();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error:', error);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    })
  }

  guardarResultados() {
    this.spinner.show();
    this.contabilidadService.crearResultado(this.resultadoForm.value).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Resultado cargado exitosamente', life: 3000 });
          this.cargarResultados();
          this.cerrarDialog();
        } else if (data['code'] == 401) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'Ya existe un resultado con esta fecha', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error:', error);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    })
  }

  verMas(resultado: any) {
    this.verResultado = true;
    this.crearResultado = true;
    this.cargarSuertesForm(resultado);
  }

  cargarSuertesForm(suertes) {
    this.resultadoForm.patchValue({
      fecha: suertes.fecha,
      primera_suerte: suertes.primera_suerte,
      segunda_suerte: suertes.segunda_suerte,
      tercera_suerte: suertes.tercera_suerte,
      cuarta_suerte: suertes.cuarta_suerte,
      quinta_suerte: suertes.quinta_suerte,
      sexta_suerte: suertes.sexta_suerte,
      septima_suerte: suertes.septima_suerte
    });

    if (this.verResultado == true) {
      this.resultadoForm.disable();
    }
  }

  resultadoModificar(suertes: any) {
    this.resultadoActualizar = true;
    this.crearResultado = true;
    this.verResultado = false;
    this.idResultado = suertes.id;
    this.cargarSuertesForm(suertes)
  }
}
