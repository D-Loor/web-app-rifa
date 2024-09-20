import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { Permiso } from 'src/app/control-electoral/api/interface';
import { RolPermisosService } from 'src/app/control-electoral/services/rol-permisos.service';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PermisoComponent implements OnInit {

  listaPermisoClonado: { [s: string]: Permiso } = {};
  listaPermisos: Permiso[] = [];
  cols: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  @ViewChild('dt') table: Table;
  estado!: SelectItem[];
  loading: boolean = false;
  editadoRowKeys: { [s: string]: boolean } = {};
  formGroups: { [key: string]: FormGroup } = {};

  constructor(private rolPermisoService: RolPermisosService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private fb: FormBuilder
  ) {
    this.cargarPermisos();
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'permiso', header: 'Permiso', type: 'text' },
      { field: 'estado', header: 'Estado', type: 'badge' },
      { field: 'descripcion', header: 'Descripción', type: 'text', maxWidth: '30%' }
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];
  }

  cargarFormGroup() {
    this.listaPermisos.forEach((permiso) => {
      this.formGroups[permiso.id] = this.crearFormGroup(permiso);
    })
  }

  crearFormGroup(permiso: Permiso): FormGroup {
    return this.fb.group({
      id: [permiso.id],
      permiso: [permiso.permiso, [Validators.required]],
      descripcion: [permiso.descripcion, [Validators.required]],
      estado: [permiso.estado, [Validators.required]]
    });
  }

  cargarPermisos(): void {
    let filaEdicion = this.hayFilaEnEdicion();

    if (!filaEdicion) {
      this.loading = true;
      this.rolPermisoService.listPermisos().subscribe({
        next: res => {
          if (res.code == "200") {
            this.listaPermisos = res.result;
            this.cargarFormGroup();
            this.loading = false;
          }
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  agregarFila(): void {
    let indexPosicion: number = this.listaPermisos.length + 1;
    const nuevoPermiso: Permiso = {
      id: indexPosicion.toString(),
      permiso: '',
      estado: '1',
      descripcion: '',
      proceso: 'nuevo'
    };
    this.formGroups[indexPosicion.toString()] = this.crearFormGroup(nuevoPermiso);
    this.listaPermisos.unshift(nuevoPermiso);
    this.listaPermisos[indexPosicion - 1].id = indexPosicion.toString();
    this.activarEdicion(nuevoPermiso);
  }

  activarEdicion(permiso: Permiso) {
    this.listaPermisoClonado[permiso.id as string] = { ...permiso };
    this.table.initRowEdit(permiso);
  }

  guardarEdicion(permiso: Permiso) {
    this.loading = true;
    if (this.formGroups[permiso.id].valid) {
      if (permiso.proceso == 'nuevo') {
        this.rolPermisoService.postPermisos(this.formGroups[permiso.id].value).subscribe({
          next: res => {
            if (res.code == "200") {
              this.cargarPermisos();
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Permiso Actualizado' });
              const index = this.listaPermisos.findIndex(item => item.id === permiso.id);
                if (index !== -1) {
                  this.listaPermisos.splice(index, 1);
                }
            } else if (res.code == "500") {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erro al guardar la información' });
            } else {
              if (res['error'].permiso) {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'El nombre del permiso ya existe' });
                this.table.initRowEdit(permiso);
              }
            }
            this.loading = false;
          },
          error: err => {
            console.error(err);
            this.loading = false
          }
        })
      } else {
        this.rolPermisoService.putPermiso(this.formGroups[permiso.id].value).subscribe({
          next: res => {
            if (res.code == "200") {
              this.cargarPermisos();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permiso Actualizado' });

            } else if (res.code == "500") {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Erro al guardar la información' });
              this.table.initRowEdit(permiso);
            } else {
              if (res['error'].permiso) {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'El nombre del permiso ya existe' });
                this.table.initRowEdit(permiso);
              }
            }
            this.loading = false;
          },
          error: err => {
            console.error(err);
            this.loading = false;
          }
        })
      }
    } else {
      this.table.initRowEdit(permiso);
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Existen campos vacios' });
      this.loading = false;
    }
  }

  eliminarPermiso(permiso) {

    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar ' + permiso.permiso + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.rolPermisoService.deletePermiso(permiso.id).subscribe({
          next: res => {
            if (res.code == "200") {
              this.listaPermisos = this.listaPermisos.filter((val) => val.id !== permiso.id);
              this.cargarPermisos();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permiso Eliminado' });
            }
            this.loading = false;
          },
          error: err => {
            console.error(err);
            this.loading = false;
          }
        })
      }
    });
  }

  cancelarEdicion(listaPermiso: Permiso, index: number) {
    this.listaPermisos[index] = this.listaPermisoClonado[listaPermiso.id as string];
    delete this.listaPermisoClonado[listaPermiso.id as string];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  hayFilaEnEdicion(): boolean {
    return Object.keys(this.editadoRowKeys).length > 0;
  }

}
