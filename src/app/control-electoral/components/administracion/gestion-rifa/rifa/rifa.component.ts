import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { RifaService } from 'src/app/control-electoral/services/rifa.service';
import { UsuarioService } from 'src/app/control-electoral/services/usuario.service';

@Component({
  selector: 'app-rifa',
  templateUrl: './rifa.component.html',
  styleUrls: ['./rifa.component.scss'],
  providers: [MessageService]
})
export class RifaComponent implements OnInit {
  listaRifas: any[] = [];
  cols: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  estado!: SelectItem[];
  crearRifa: boolean = false;
  verRifa: boolean = false;
  rifaAtualizar: boolean = false;
  rifaForm: FormGroup;
  idRifa: any;
  cifras: any[] = [];
  rifas = [
    { label: '1.° Suerte', placeholder: 'Precio', field: 'primera_suerte' },
    { label: '2.° Suerte', placeholder: 'Precio', field: 'segunda_suerte' },
    { label: '3.° Suerte', placeholder: 'Precio', field: 'tercera_suerte' },
    { label: '4.° Suerte', placeholder: 'Precio', field: 'cuarta_suerte' },
    { label: '5.° Suerte', placeholder: 'Precio', field: 'quinta_suerte' },
    { label: '6.° Suerte', placeholder: 'Precio', field: 'sexta_suerte' },
    { label: '7.° Suerte', placeholder: 'Precio', field: 'septima_suerte' }
  ];

  globalFilterFields: any[] = []
  constructor(private rifaService: RifaService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'valor', header: 'Valor', type: 'text', maxWidth: '30%' },
      { field: 'cifras', header: 'Cifras', type: 'text', maxWidth: '30%' },
      { field: 'limite', header: 'Limite', type: 'text', maxWidth: '30%' },
      { field: 'estado', header: 'Estado', type: 'badge' },
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];

    this.cifras = [
      { name: 'Dos cifras', code: 2 },
      { name: 'Tres cifras', code: 3 },
    ];

    this.rifaForm = this.fb.group({
      valorRifa: ['', Validators.required], // Campo para el valor de la rifa
      rifasControl: this.fb.array(this.createRifaControls()), // Campo para el array de suertes
      selectedEstado: [''], // Campo para el estado
      selectedCifra: ['', Validators.required], // Campo para el valor de dos cifras
      limite: ['', Validators.required] // Campo para el valor de tres cifras
    });

    this.globalFilterFields = this.generateGlobalFilterFields();

    this.cargarRifas();
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')  // Solo incluimos columnas de tipo 'text'
      .map(col => col.field);  // Extraemos el campo de cada columna
  }

  createRifaControls(): FormControl[] {
    return this.rifas.map(() => this.fb.control('', Validators.required));
  }

  get rifasControl(): FormArray {
    return this.rifaForm.get('rifasControl') as FormArray;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  cargarRifas() {
    this.spinner.show();
    this.rifaService.listaRifas().subscribe({
      next: (data) => {
        this.listaRifas = data['result'];
        if (!data['result'] || data['result'].length === 0) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No hay rifas agregadas', life: 3000 });
          this.listaRifas = [];
        }
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error:', error);
        this.spinner.hide();
      }
    })
  }

  guardarRifas() {
    this.spinner.show();
    this.rifaService.crearRifa(this.rifaForm.value).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Rifa creada exitosamente', life: 3000 });
          this.cargarRifas();
          this.crearRifa = false;
        } else if (data['code'] == 400) {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'Ya existe una rifa con este valor y cifra', life: 3000 });
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

  actualizarRifas() {
    this.spinner.show();
    this.rifaService.actualizarRifa(this.rifaForm.value, this.idRifa).subscribe({
      next: (data) => {
        if (data['code'] == 200) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Rifa actualizado exitosamente', life: 3000 })
          this.cargarRifas();
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

  cerrarDialog() {
    this.crearRifa = false;
    this.rifaAtualizar = false;
    this.rifaForm.reset();
    this.verRifa = false;
    this.rifaForm.enable();
  }

  agregarFila() {
    this.crearRifa = true;
  }

  rifaModificar(rifa: any) {
    this.rifaAtualizar = true;
    this.crearRifa = true;
    this.idRifa = rifa.id;
    this.cargarSuertesForm(rifa)
  }

  verMas(rifa: any) {
    this.rifaAtualizar = true;
    this.verRifa = true;
    this.crearRifa = true;
    this.cargarSuertesForm(rifa);

  }

  cargarSuertesForm(rifa) {
    this.rifaForm.patchValue({
      valorRifa: rifa.valor,
      selectedEstado: rifa.estado == '1' ? this.estado[0] : this.estado[1],
      selectedCifra: rifa.cifras == '2' ? this.cifras[0] : this.cifras[1],
      limite: rifa.limite
    });

    const suerteFields = this.rifas
      .map(col => col.field);

    suerteFields.forEach((field, index) => {
      this.rifasControl.at(index).patchValue(rifa[field]);
    });

    if (this.verRifa == true) {
      this.rifaForm.disable();
    }
  }

  guardar(opcion) {
    if (this.rifaForm.valid) {
      if (opcion === 'guardar') {
        this.guardarRifas();
      } else if (opcion === 'actualizar') {
        this.actualizarRifas();
      }
    } else {
      this.rifaForm.markAllAsTouched();
    }
  }
}
