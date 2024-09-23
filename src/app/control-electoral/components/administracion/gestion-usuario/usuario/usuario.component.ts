import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  cols: any[] = [];
  estado!: SelectItem[];
  modificarContrasena = false;
  password = '';
  ingresarContrasena = false;
  idUsuario = '';
  crearUsuario: boolean = false;
  roles: any[] = []; // Lista de roles a cargar en el dropdown
  usuarioForm: FormGroup;
  usuarioAtualizar: boolean = false;
  modificarContrasenaUsuario: any;
  email = '';
  constructor(private usuarioService: UsuarioService, private messageService: MessageService,
    private spinner: NgxSpinnerService, private fb: FormBuilder) {
      this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
    this.loading = true;
    this.cols = [
      { field: 'usuario', header: 'Usuario', type: 'text', maxWidth: '30%' },
      { field: 'correo', header: 'Correo', type: 'text', maxWidth: '30%' },
      { field: 'rol.descripcion', header: 'Descripcion', type: 'text' },
      { field: 'estado', header: 'Estado', type: 'badge' },
    ];

    this.estado = [
      { label: 'Activado', value: '1', styleClass: 'customer-badge status-qualified' },
      { label: 'Desactivado', value: '2', styleClass: 'customer-badge status-unqualified' },
    ];

    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      selectedRol: ['', Validators.required],
      selectedEstado: ['']
    });

    this.roles = [
      // { rol: 'Administrador', id: 1 },
      { rol: 'Vendedor', id: 2 }
    ];

    this.cargarUsuarios();

  }

  agregarFila() {
    this.crearUsuario = true;
  }

  cerrarDialog() {
    this.crearUsuario = false;
    this.usuarioAtualizar = false;
    this.usuarioForm.reset();
  }

  guardar(opcion: string) {
    if (this.usuarioForm.valid) {
      this.crearUsuario = false;
      if (opcion === 'guardar') {
        this.guardarUsuario()
      } else if (opcion === 'actualizar') {
        this.actualizarUsuario();
      }
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  actualizarUsuario() {
    this.spinner.show();
    this.usuarioService.actualizarUsuario(this.usuarioForm.value, this.idUsuario).subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Usuario actualizado exitosamente', life: 3000 });
          this.cargarUsuarios();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se pudo crear el usuario', life: 3000 });
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    });
  }

  guardarUsuario() {
    this.spinner.show();
    this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Usuario creado exitosamente', life: 3000 });
          this.cargarUsuarios();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se pudo crear el usuario', life: 3000 });
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 3000 });
      }
    });
  }

  usuarioModificar(usuario: any) {
    this.usuarioAtualizar = true;
    this.crearUsuario = true;
    this.idUsuario = usuario.id;
    this.usuarioForm.patchValue({
      nombres: usuario.usuario,
      correo: usuario.correo,
      selectedRol: { rol: usuario.rol.rol, id: usuario.rol.id },
      selectedEstado: usuario.estado == '1' ? this.estado[0] : this.estado[1]
    });
  }

  cargarUsuarios() {
    this.spinner.show();
    this.usuarioService.listUsuarios().subscribe({
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

  contrasenaModicar(datos: any) {
    this.modificarContrasena = true;
    this.modificarContrasenaUsuario = datos;
  }

  validarContrasena() {
    this.spinner.show();
    let dato = {
      "usuario_id": this.modificarContrasenaUsuario.id,
      "correo": this.modificarContrasenaUsuario.correo,
      "usuario": this.modificarContrasenaUsuario.usuario,
      "email": this.email,
      "password": this.password 
    }
    this.usuarioService.restablecerPassword(dato).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.code === '200') {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito!', detail: 'Contraseña restablecida correctamente!', life: 10000 });
          this.ingresarContrasena = false;
          this.password = '';
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
