import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, SelectItem } from 'primeng/api';
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
  loading = false;
  estado!: SelectItem[];
  crearRifa: boolean = false;
  rifaAtualizar: boolean = false;
  rifaForm: FormGroup;
  idRifa: any;
  rifas = [
    { label: '1.° Suerte', placeholder: 'Precio' },
    { label: '2.° Suerte', placeholder: 'Precio' },
    { label: '3.° Suerte', placeholder: 'Precio' },
    { label: '4.° Suerte', placeholder: 'Precio' },
    { label: '5.° Suerte', placeholder: 'Precio' },
    { label: '6.° Suerte', placeholder: 'Precio' },
    { label: '7.° Suerte', placeholder: 'Precio' }
  ];
  constructor(private rifaService: RifaService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loading = true;
    this.cols = [
      { field: 'valor', header: 'Valor', type: 'text', maxWidth: '30%' },
      { field: 'primera_suerte', header: '1.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'segunda_suerte', header: '2.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'tercera_suerte', header: '3.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'cuarta_suerte', header: '4.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'quinta_suerte', header: '5.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'sexta_suerte', header: '6.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'septima_suerte', header: '7.° Suerte', type: 'text', maxWidth: '30%' },
      { field: 'estado', header: 'Estado', type: 'badge' },
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];

    this.rifaForm = this.fb.group({
      valorRifa: ['', Validators.required], // Campo para el valor de la rifa
      rifasControl: this.fb.array(this.createRifaControls()), // Campo para el array de suertes
      selectedEstado: [''] // Campo para el estado
    });

    this.cargarRifas();
  }


  createRifaControls(): FormControl[] {
    return this.rifas.map(() => this.fb.control('', Validators.required));
  }

  get rifasControl(): FormArray {
    return this.rifaForm.get('rifasControl') as FormArray;
  }


  cargarRifas() {
    this.spinner.show();
    this.rifaService.listaRifas().subscribe({
      next: (data) => {
        this.listaRifas = data['result'];
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error:', error);
        this.spinner.hide();
        this.loading = false;
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
          this.spinner.hide();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
        }
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
        if(data['code'] == 200){
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Rifa actualizado exitosamente', life: 3000 })
          this.cargarRifas();
          this.cerrarDialog();
          this.spinner.hide();
        }else{
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
        }
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
  }

  agregarFila() {
    this.crearRifa = true;
  }

  rifaModificar(rifa: any) {
    this.rifaAtualizar = true;
    this.crearRifa = true;
    this.idRifa = rifa.id;
    this.rifaForm.patchValue({
      valorRifa: rifa.valor,
      selectedEstado: rifa.estado == '1' ? this.estado[0] : this.estado[1]
    });

    const suerteFields = this.cols
      .filter(col => col.field !== 'estado' && col.field !== 'valor')
      .map(col => col.field);

    suerteFields.forEach((field, index) => {
      this.rifasControl.at(index).patchValue(rifa[field]);
    });
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
