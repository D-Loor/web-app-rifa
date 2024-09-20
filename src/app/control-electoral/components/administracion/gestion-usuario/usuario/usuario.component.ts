import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { appConfig } from 'src/app/config';
import { EleccionService } from 'src/app/control-electoral/services/eleccion.service';
import { UsuarioService } from 'src/app/control-electoral/services/usuario.service';
import { EncryptedService } from 'src/app/control-electoral/services/utils/encrypted.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [MessageService]
})
export class UsuarioComponent implements OnInit {

  listaUsuarios: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  loading: boolean = false;
  editadoRowKeys: { [s: string]: boolean } = {};
  cols: any[] = [];
  estado!: SelectItem[];
  modificarEstado = false;
  modificarContrasena = false;
  formGroups: { [key: string]: FormGroup } = {};
  correoLogin = '';
  password = '';
  usuario: any;
  ingresarContrasena = false;
  encryptedUserData = ''

  listaElecciones: any = [];
  eleccionSeleccionada: any;

  localidadValor: string;
  localidadEntidad: string;
  idRol: string;

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private eleccionService: EleccionService, 
    private spinner: NgxSpinnerService, private encryptedService: EncryptedService) { 
    this.encryptedUserData = localStorage.getItem('userData');
  }

  ngOnInit(): void {
    if (this.encryptedUserData) {
      const userData = this.encryptedService.decryptData(this.encryptedUserData);
      this.correoLogin = userData.correo;
      this.localidadValor = userData.localidadValor;
      this.localidadEntidad = userData.localidadEntidad;
      this.idRol = userData.idRol;
    }
    this.loading = true;
    this.cols = [
      { field: 'voluntario.padron_electoral.nom_padron', header: 'Usuario', type: 'text', maxWidth: '30%' },
      { field: 'correo', header: 'Correo', type: 'text', maxWidth: '30%' },
      { field: 'estado', header: 'Estado', type: 'badge' },
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];

    this.obtenerElecciones();

  }

  obtenerElecciones() {
    this.spinner.show();
    this.eleccionService.listEleccion().subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.listaElecciones = data['result'];
          this.eleccionSeleccionada = this.listaElecciones.length ? this.listaElecciones[0] : null;
          this.cargarUsuarios();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen Elecciones activas', life: 10000 });
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      }
    });
  }

  cargarUsuarios() {
    this.spinner.show();
    let data = {
      "rol_id": this.idRol,
      "eleccion_id": this.eleccionSeleccionada.id,
      "localidad_entidad": this.localidadEntidad,
      "localidad_valor": this.localidadValor
    }
    this.usuarioService.listUsuarios(data).subscribe({
      next: (data) => {
        this.listaUsuarios = data['result'];
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

  estadoModificar(datos: any) {
    this.modificarEstado = true;
    this.usuario = { ...datos }
  }

  contrasenaModicar(datos: any) {
    this.modificarContrasena = true;
    this.usuario = { ...datos }
  }
  confirmarModificacionEstado() {
    this.spinner.show();
    if (this.usuario.estado == '1') {
      this.usuario.estado = '2'
    } else {
      this.usuario.estado = '1'
    }
    this.usuarioService.usuarioUpdate(this.usuario).subscribe({
      next: (data) => {
        this.modificarContrasena = false;
        this.modificarEstado = false;
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Actualización correcta!', life: 10000 });
        this.cargarUsuarios();
      },
      error: (error) => {
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.message });
        console.error('Error:', error);
      }
    })
  }

  validarContrasena() {
    this.spinner.show();
    let userData:any;
    if (this.encryptedUserData) {
      userData = this.encryptedService.decryptData(this.encryptedUserData);
    }
    let dato = {
      usuario: this.usuario.id,
      correo: this.usuario.correo,
      nombres: this.usuario.voluntario.padron_electoral.nom_padron,
      email: userData.correo,
      password: this.password
    }
    this.usuarioService.restablecerPassword(dato).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.code === '200') {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Contraseña restablecida correctamente!', life: 10000 });
          this.ingresarContrasena = false;
        }

        if (data.code === '409') {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Contraseña incorrecta!' });
        }

        if (data.code === '404') {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Registro no encontrado!' });
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.message });
        console.error('Error:', error);
      }
    })
  }
}
