import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { LimiteService } from 'src/app/app-rifa/services/limite.service';

@Component({
  selector: 'app-limite',
  templateUrl: './limite.component.html',
  styleUrls: ['./limite.component.scss'],
  providers: [MessageService]
})
export class LimiteComponent implements OnInit {
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  listaLimites: any[] = [];
  cols: any[] = [];
  estado!: SelectItem[];
  globalFilterFields: any[] = [];
  dias: SelectItem[];
  diasFiltrados: SelectItem[];
  loading: boolean = false;
  crearLimite: boolean = false;
  limiteForm: FormGroup;
  limiteAtualizar: boolean = false;
  idLimite = '';

  constructor(private limiteService: LimiteService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.cols = [
      { field: 'desde', header: 'Desde', type: 'text', maxWidth: '30%' },
      { field: 'hasta', header: 'Hasta', type: 'text', maxWidth: '30%' },
      { field: 'limite', header: 'Límite', type: 'text', maxWidth: '30%' },
      { field: 'estado', header: 'Estado', type: 'badge' },
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];

    this.dias = [
      { label: 'Lunes', value: '1' },
      { label: 'Martes', value: '2' },
      { label: 'Miércoles', value: '3' },
      { label: 'Jueves', value: '4' },
      { label: 'Viernes', value: '5' },
      { label: 'Sábado', value: '6' },
      { label: 'Domingo', value: '7' }
    ];

    this.diasFiltrados = [...this.dias];

    this.limiteForm = this.fb.group({
      desde: ['', Validators.required],
      hasta: ['', Validators.required],
      limite: ['', Validators.required],
      estado: ['1', Validators.required]
    });

    this.globalFilterFields = this.generateGlobalFilterFields();

    this.cargarLimites();

    this.limiteForm.get('desde').valueChanges.subscribe(value => {
      this.filtrarDias(value);
    });
  }

  generateGlobalFilterFields(): string[] {
    return this.cols
      .filter(col => col.type === 'text')
      .map(col => col.field);
  }

  agregarFila() {
    this.crearLimite = true;
    this.limiteAtualizar = false;
  }

  cerrarDialog() {
    this.crearLimite = false;
    this.limiteAtualizar = false;
    this.limiteForm.reset({
      desde: '',
      hasta: '',
      limite: '',
      estado: '1' 
    });
  }

  ejecutarAccion(opcion: string) {
    if (this.limiteForm.valid) {
      this.crearLimite = false;
      if (opcion === 'guardar') {
        this.guardarLimite()
      } else if (opcion === 'actualizar') {
        this.actualizarLimite();
      }
    } else {
      this.limiteForm.markAllAsTouched();
    }
  }

  guardarLimite() {
    this.spinner.show();

    let data = {
      desde: this.limiteForm.get('desde').value.value,
      hasta: this.limiteForm.get('hasta').value.value,
      limite: this.limiteForm.get('limite').value,
      estado: '1'
    }
    this.limiteService.crearLimite(data).subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Límite creado exitosamente', life: 3000 });
          this.cerrarDialog();
          this.cargarLimites();
        } else if (data['code'] === "409") {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Ya existe un límite para estos días', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se pudo crear el límite', life: 3000 });
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    });
  }

  actualizarLimite() {
    this.spinner.show();
    let data = {
      id: this.idLimite,
      desde: this.limiteForm.get('desde').value.value,
      hasta: this.limiteForm.get('hasta').value.value,
      limite: this.limiteForm.get('limite').value,
      estado: this.limiteForm.get('estado').value.value
    }
    this.limiteService.actualizarLimite(data, this.idLimite).subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Límite actualizado exitosamente', life: 3000 });
          this.cerrarDialog();
          this.cargarLimites();
        } else if (data['code'] === "409") {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Ya existe un límite para estos días', life: 3000 });
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se pudo actualizar el límite', life: 3000 });
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    });
  }


  modificarLimite(limite: any) {
    this.limiteAtualizar = true;
    this.crearLimite = true;
    this.idLimite = limite.id;
    this.filtrarDias(this.obtenerDia(limite.desde));
    this.limiteForm.patchValue({
      limite: limite.limite,
      desde: this.obtenerDia(limite.desde),
      hasta: this.obtenerDia(limite.hasta),
      estado: limite.estado == '1' ? this.estado[0] : this.estado[1]
    });
  }

  cargarLimites() {
    this.spinner.show();
    this.limiteService.listarLimites().subscribe({
      next: (data) => {
        this.listaLimites = data['result'];
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filtrarDias(desde: any) {
    const valorDesde = parseInt(desde.value, 10);
    this.diasFiltrados = this.dias.filter(dia => parseInt(dia.value, 10) >= valorDesde);

    const hastaSeleccionado = this.limiteForm.get('hasta').value;
    if (hastaSeleccionado && parseInt(hastaSeleccionado, 10) < valorDesde) {
      this.limiteForm.get('hasta').reset();
    }
  }

  obtenerDia(valor) {
    return this.dias.find(dia => dia.value === valor);
  }
}