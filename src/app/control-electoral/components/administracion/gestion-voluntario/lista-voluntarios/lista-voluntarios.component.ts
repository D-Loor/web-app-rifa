import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EleccionService } from 'src/app/control-electoral/services/eleccion.service';
import { VoluntarioService } from 'src/app/control-electoral/services/voluntario.service';
import { appConfig } from 'src/app/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/control-electoral/services/usuario.service';
import { RolService } from 'src/app/control-electoral/services/rol.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TerritorioService } from 'src/app/control-electoral/services/territorio.service';
import { FiltersService } from 'src/app/control-electoral/services/utils/filters.service';
import { ImagenPerfilService } from 'src/app/control-electoral/services/imagen-perfil.service';
import { WindowRef } from 'src/app/control-electoral/services/utils/window.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptedService } from 'src/app/control-electoral/services/utils/encrypted.service';
@Component({
  selector: 'app-lista-voluntarios',
  templateUrl: './lista-voluntarios.component.html',
  styleUrls: ['./lista-voluntarios.component.scss'],
  providers: [MessageService],
})
export class ListaVoluntariosComponent implements OnInit {
  usuarioValidador: string;
  localidadEntidadNuevo: string;
  localidadValorNuevo: string;
  localidadNombreNuevo: string;

  tieneDistrito = false;
  localidadValor: string;
  localidadEntidad: string;
  fotoVoluntario = '';
  presentarFoto = false;
  idRol: string;
  cols: any[] = [];
  accionesVoluntario: any[] = [];
  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  activeIndex: number = 0;
  listaElecciones: any = [];
  eleccionSeleccionada: any;
  listaRoles: any = [];
  listaVoluntarios: any = [];
  voluntarioSeleccionado: any;
  localidadesVoluntario: any = null;
  datosDialog: boolean = false;
  gestionarDialog: boolean = false;
  deleteProductsDialog: boolean = false;
  tipoRegisto: string = '';
  form: FormGroup;
  desabilitarDitritos = true;
  filtradoPais: any[] | undefined;
  filtradoProvincia: any[] | undefined;
  filtradoDistrito: any[] | undefined;
  filtradoParroquia: any[] | undefined;
  filtradoCanton: any[] | undefined;
  filtradoZona: any[] | undefined;
  filtradoRecinto: any[] | undefined;
  filtradoMesa: any[] | undefined;
  territoriosOcupados = [];

  actualizar = false;
  paises = [];
  provincias = [];
  distritos = [];
  cantones = [];
  parroquias = [];
  zonas = [];
  recintos = [];
  mesas = [];
  encryptedUserData = ''
  constructor(
    private voluntarioService: VoluntarioService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private messageService: MessageService,
    private eleccionService: EleccionService,
    private fb: FormBuilder,
    private imagenService: ImagenPerfilService,
    private territorioService: TerritorioService,
    private filterService: FiltersService,
    private windowRef: WindowRef,
    private spinner: NgxSpinnerService,
    private encryptedService: EncryptedService
  ) {
    this.encryptedUserData = localStorage.getItem('userData');
  }

  ngOnInit() {
    if (this.encryptedUserData) {
      const userData = this.encryptedService.decryptData(this.encryptedUserData);
      this.localidadValor = userData.localidadValor;
      this.localidadEntidad = userData.localidadEntidad;
      this.idRol = userData.idRol;
      this.usuarioValidador = userData.nombres;
    }
    this.form = this.fb.group({
      tipoVoluntario: [
        { value: '', disabled: true },
        Validators.required,
      ],
      accionSeleccionada: ['', Validators.required],
      rolSeleccionado: [''],
      textDescripcion: ['', Validators.required],
      paisSeleccionado: [{ value: '', disabled: true }],
      provinciaSeleccionado: [{ value: '', disabled: true }],
      distritoSeleccionado: [{ value: '', disabled: true }],
      cantonSeleccionado: [{ value: '', disabled: true }],
      parroquiaSeleccionado: [{ value: '', disabled: false }],
      zonaSeleccionado: [{ value: '', disabled: false }],
      recintoSeleccionado: [{ value: '', disabled: false }],
      mesaSeleccionado: [{ value: '', disabled: false }],
    });

    this.cols = [
      {
        field: 'padron_electoral.nom_padron',
        header: 'Nombres',
        type: 'text',
      },
      {
        field: 'padron_electoral.cedula',
        header: 'Cédula',
        type: 'text',
      },
      { field: 'correo', header: 'Correo', type: 'text' },
      { field: 'telefono', header: 'Teléfono', type: 'text' },
      { field: 'estado', header: 'Estado', type: 'badge' },
      { field: 'territorio', header: 'Rol', type: 'text' },
    ];

    this.accionesVoluntario = [
      { name: 'Rechazar', id: '0' },
      { name: 'Aceptar', id: '2' },
    ];

    this.obtenerElecciones();
    this.obtenerRoles();
  }

  ngAfterViewInit() {
    if (this.localidadEntidad == '*') {
      this.paisSeleccionado.setValidators(Validators.required);
      return;
    }
    this.validarLocalidad();
  }

  validarLocalidad() {
    switch (this.localidadEntidad) {
      case 'provincia':
        this.distritoSeleccionado.setValidators(Validators.required);
        this.obtenerDistritos(null, this.localidadValor);
        break;
      case 'canton':
        this.parroquiaSeleccionado.setValidators(Validators.required);
        this.obtenerParroquias(null, this.localidadValor);
        break;
      case 'parroquia':
        break;
      case 'pais':
        this.provinciaSeleccionado.setValidators(Validators.required);
        this.obtenerProvincias(null, this.localidadValor);
        break;
      case 'distrito':
        this.cantonSeleccionado.setValidators(Validators.required);
        this.obtenerCantones(
          null,
          this.localidadEntidad,
          this.localidadValor
        );
        break;
      case '*':
        this.paisSeleccionado.setValidators(Validators.required);
        break;
    }

    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.form.reset({
      tipoVoluntario: { value: '', disabled: true },
      accionSeleccionada: '',
      rolSeleccionado: '',
      textDescripcion: '',
      territorioSeleccionado: '',
    });

    this.form.get('rolSeleccionado')?.setValidators([]);
    this.form.get('rolSeleccionado')?.updateValueAndValidity();
    this.localidadesVoluntario = null;
    this.actualizar = false;
    this.activeIndex = 0;
  }

  actualizarDatos() {
    this.hideDialog();
    this.obtenerVoluntarios();
    this.limpiarFormulario();
  }

  get textDescripcion() {
    return this.form.get('textDescripcion');
  }

  get accionSeleccionada() {
    return this.form.get('accionSeleccionada');
  }

  get rolSeleccionado() {
    return this.form.get('rolSeleccionado');
  }

  get paisSeleccionado() {
    return this.form.get('paisSeleccionado');
  }

  get provinciaSeleccionado() {
    return this.form.get('provinciaSeleccionado');
  }

  get distritoSeleccionado() {
    return this.form.get('distritoSeleccionado');
  }

  get cantonSeleccionado() {
    return this.form.get('cantonSeleccionado');
  }

  get parroquiaSeleccionado() {
    return this.form.get('parroquiaSeleccionado');
  }

  get zonaSeleccionado() {
    return this.form.get('zonaSeleccionado');
  }

  get recintoSeleccionado() {
    return this.form.get('recintoSeleccionado');
  }

  get mesaSeleccionado() {
    return this.form.get('mesaSeleccionado');
  }

  obtenerElecciones() {
    this.spinner.show();
    this.eleccionService.listEleccion().subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.listaElecciones = data['result'];
          this.eleccionSeleccionada = this.listaElecciones.length
            ? this.listaElecciones[0]
            : null;
          this.obtenerVoluntarios();
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No existen Elecciones activas',
            life: 10000,
          });
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  obtenerVoluntarios() {
    this.spinner.show();
    let data = {
      rol_id: this.idRol,
      eleccion_id: this.eleccionSeleccionada.id,
      localidad_entidad: this.localidadEntidad,
      localidad_valor: this.localidadValor,
    };
    this.voluntarioService.listarVoluntariosEleccion(data).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.listaVoluntarios = data['result'];
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No existen Voluntarios',
            life: 10000,
          });
        }
        this.spinner.hide();
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  obtenerRoles() {
    this.spinner.show();
    this.rolService.obtenerRolPorId(this.idRol).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.listaRoles = data['result'];
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No se pudo cargar los roles',
            life: 10000,
          });
        }
        this.spinner.hide();
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  obtenerRolesAsignados(proceso: string) {
    this.spinner.show();
    this.rolService
      .obtenerRolesAsignados(this.localidadesVoluntario)
      .subscribe({
        next: (data) => {
          if (data['code'] === '200') {
            this.listaRoles = this.listaRoles.filter(
              (item) =>
                !data['result'].some(
                  (rol) => rol.territorio == item.territorio
                )
            );
            if (proceso == 'editar') {
              this.listaRoles.push(this.rolSeleccionado.value);
            }
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Error!',
              detail: 'No se pudo cargar los roles',
              life: 10000,
            });
          }
          this.spinner.hide();
        },
        error: (e) => {
          this.spinner.hide();
          console.log(e);
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'Se produjo un error!',
            life: 10000,
          });
        },
      });
  }

  cargarDatosPardron() {
    this.spinner.show();
    this.voluntarioService
      .obtenerUbicacionPadron(
        this.voluntarioSeleccionado.padron_electoral.cedula,
        this.eleccionSeleccionada.id
      )
      .subscribe({
        next: (rest) => {
          if (rest['code'] == '200') {
            this.voluntarioSeleccionado.nom_pais =
              rest['result'].nom_pais;
            this.voluntarioSeleccionado.nom_provincia =
              rest['result'].nom_provincia;
            this.voluntarioSeleccionado.nom_canton =
              rest['result'].nom_canton;
            this.voluntarioSeleccionado.nom_parroquia =
              rest['result'].nom_parroquia;
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'info',
              summary: 'Información',
              detail: rest['result'],
              life: 10000,
            });
          }
          this.spinner.hide();
        },
        error: (e) => {
          this.spinner.hide();
          console.log(e);
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'Se produjo un error!',
            life: 10000,
          });
        },
      });
  }

  obtenerLocalidades(proceso: string): any {
    this.spinner.show();
    this.territorioService
      .obtenerLocalidades(
        this.voluntarioSeleccionado.padron_electoral.parroquia_id
      )
      .subscribe({
        next: (rest) => {
          if (rest['code'] == '200') {
            this.localidadesVoluntario = rest['result'];
            this.obtenerRolesAsignados(proceso);
            this.obtenerPaises();
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'info',
              summary: 'Información',
              detail: rest['result'],
              life: 10000,
            });
          }
          this.spinner.hide();
        },
        error: (e) => {
          this.spinner.hide();
          console.log(e);
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'Se produjo un error!',
            life: 10000,
          });
        },
      });
  }

  cargarVoluntario(datos: any, dialog: string) {
    this.localidadesVoluntario = null;
    this.presentarFoto = false;
    this.fotoVoluntario = '';
    this.voluntarioSeleccionado = datos;
    this.cargarDatosPardron();
    if (dialog === 'datos') {
      this.cargarDatosPardron();
      this.datosDialog = true;
    } else if (dialog === 'gestion') {
      const tipoVoluntario =
        this.voluntarioSeleccionado.tipo === '1'
          ? 'Registro Voluntario'
          : 'Importación Adherente';
      this.form.patchValue({
        tipoVoluntario: tipoVoluntario,
      });
      this.gestionarDialog = true;
    } else if (dialog === 'editar') {
      this.actualizar = true;
      const tipoVoluntario =
        this.voluntarioSeleccionado.tipo === '1'
          ? 'Registro Voluntario'
          : 'Importación Adherente';
      this.form.patchValue({
        tipoVoluntario: tipoVoluntario,
        accionSeleccionada: {
          id: datos.estado,
          name: datos.estado == '2' ? 'Aceptar' : 'Rechazar',
        },
        rolSeleccionado: datos.usuario[0].rol,
      });
      this.gestionarDialog = true;
    }
    this.obtenerLocalidades(dialog);
  }

  hideDialog() {
    this.datosDialog = false;
    this.gestionarDialog = false;
  }

  redirigir(url: string) {
    window.open(url, '_blank');
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }

  guardar() {
    this.spinner.show();
    this.form.markAllAsTouched();

    if (this.accionSeleccionada.value?.id === '2') {
      this.form
        .get('rolSeleccionado')
        ?.setValidators(Validators.required);
      this.form.get('rolSeleccionado')?.updateValueAndValidity();
    }

    let datos = {
      descripcion: this.textDescripcion.value,
      usuario_valida: this.usuarioValidador,
      estado: this.accionSeleccionada.value.id,
      nombres: this.voluntarioSeleccionado.padron_electoral.nom_padron,
      eleccion: this.eleccionSeleccionada.eleccion,
    };

    this.localidadEntidadNuevo =
      this.form.value['rolSeleccionado'].territorio;
    switch (this.localidadEntidadNuevo) {
      case 'provincia':
        this.localidadValorNuevo = this.provinciaSeleccionado.value?.id;
        this.localidadNombreNuevo =
          this.provinciaSeleccionado.value?.provincia;
        if (this.localidadEntidad == '*') {
          this.paisSeleccionado.setValidators(Validators.required);
        }
        this.provinciaSeleccionado.setValidators(Validators.required);
        break;
      case 'canton':
        this.localidadValorNuevo = this.cantonSeleccionado.value?.id;
        this.localidadNombreNuevo =
          this.cantonSeleccionado.value?.canton;
        if (this.localidadEntidad == '*') {
          if (this.tieneDistrito) {
            this.distritoSeleccionado.setValidators(
              Validators.required
            );
          }
          this.provinciaSeleccionado.setValidators(
            Validators.required
          );
          this.paisSeleccionado.setValidators(Validators.required);
        }
        this.cantonSeleccionado.setValidators(Validators.required);
        break;
      case 'parroquia':
        this.localidadValorNuevo = this.parroquiaSeleccionado.value?.id;
        this.localidadNombreNuevo =
          this.parroquiaSeleccionado.value?.parroquia;
        if (this.localidadEntidad == '*') {
          if (this.tieneDistrito) {
            this.distritoSeleccionado.setValidators(
              Validators.required
            );
          }
          this.provinciaSeleccionado.setValidators(
            Validators.required
          );
          this.cantonSeleccionado.setValidators(Validators.required);
          this.paisSeleccionado.setValidators(Validators.required);
        }
        this.parroquiaSeleccionado.setValidators(Validators.required);
        break;
      case 'pais':
        this.localidadValorNuevo = this.paisSeleccionado.value?.id;
        this.localidadNombreNuevo = this.paisSeleccionado.value?.pais;
        this.paisSeleccionado.setValidators(Validators.required);
        break;
      case 'distrito':
        this.localidadValorNuevo = this.distritoSeleccionado.value?.id;
        this.localidadNombreNuevo =
          this.distritoSeleccionado.value?.distritos;
        if (this.localidadEntidad == '*') {
          this.provinciaSeleccionado.setValidators(
            Validators.required
          );
          this.paisSeleccionado.setValidators(Validators.required);
        }
        this.distritoSeleccionado.setValidators(Validators.required);
        break;
    }
    this.distritoSeleccionado.updateValueAndValidity();

    if (this.form.valid) {
      this.voluntarioService
        .voluntarioUpdate(this.voluntarioSeleccionado, datos)
        .subscribe({
          next: (data) => {
            if (data['code'] === '200') {
              this.messageService.add({
                key: 'tst',
                severity: 'success',
                summary: 'Éxito!',
                detail: 'Voluntario actualizado correctamente',
                life: 10000,
              });

              if (this.accionSeleccionada.value.id === '2') {
                if (this.localidadEntidadNuevo == 'parroquia') {
                  let dataTerritorio = {
                    padron_id:
                      this.voluntarioSeleccionado
                        .padron_electoral.id,
                    parroquia_id:
                      this.parroquiaSeleccionado.value.id,
                  };
                  this.territorioService
                    .modificarPadronTerritorio(
                      dataTerritorio
                    )
                    .subscribe({
                      next: (data) => { },
                      error: (e) => {
                        console.log(e);
                        this.messageService.add({
                          key: 'tst',
                          severity: 'error',
                          summary: 'Error!',
                          detail: 'Se produjo un error!',
                          life: 10000,
                        });
                      },
                    });
                }
                let datos = {
                  rol_id: this.rolSeleccionado.value.id,
                  voluntario_id:
                    this.voluntarioSeleccionado.id,
                  correo: this.voluntarioSeleccionado.correo,
                  estado: '1',
                  nombres:
                    this.voluntarioSeleccionado
                      .padron_electoral.nom_padron,
                  eleccion:
                    this.eleccionSeleccionada.eleccion,
                  rol: this.rolSeleccionado.value.rol,
                  territorio: this.localidadNombreNuevo,
                };
                if (this.actualizar) {
                  datos['id'] =
                    this.voluntarioSeleccionado.usuario[0].id;
                  this.actualizarUsuario(
                    datos,
                    this.voluntarioSeleccionado.usuario[0]
                      .id
                  );
                } else {
                  this.crearUsuario(datos);
                }
              } else if (this.actualizar) {
                this.eliminarTerritorio(
                  this.voluntarioSeleccionado.usuario[0]
                    .territorio[0].id,
                  this.voluntarioSeleccionado.usuario[0].id
                );
              } else {
                this.actualizarDatos();
              }
            } else {
              this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error!',
                detail: 'No se pudo actualizar el Voluntario',
                life: 10000,
              });
              this.spinner.hide();
            }
          },
          error: (e) => {
            this.spinner.hide();
            console.log(e);
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Error!',
              detail: 'Se produjo un error!',
              life: 10000,
            });
          },
        });
    }
  }

  eliminarTerritorio(territorio_id, usuario_id) {
    this.spinner.show();
    this.territorioService.elimanarTerritorio(territorio_id).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.eliminarUsuario(usuario_id);
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No se pudo actualizar el Voluntario',
            life: 10000,
          });
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  eliminarUsuario(usuario_id) {
    this.spinner.show();
    this.usuarioService.eliminarUsuario(usuario_id).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Éxito!',
            detail: 'Voluntario actualizado correctamente',
            life: 10000,
          });
          this.actualizarDatos();
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No se pudo actualizar el Voluntario',
            life: 10000,
          });
        }
        this.spinner.hide();
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  actualizarTerritorio() {
    this.spinner.show();
    let datos = {
      id: this.voluntarioSeleccionado.usuario[0].territorio[0].id,
      usuario_id:
        this.voluntarioSeleccionado.usuario[0].territorio[0].usuario_id,
      localidad_entidad: this.localidadEntidadNuevo,
      localidad_valor: this.localidadValorNuevo.toString(),
    };
    this.territorioService
      .actualizarTerritorio(
        datos,
        this.voluntarioSeleccionado.usuario[0].territorio[0].id
      )
      .subscribe({
        next: (data) => {
          if (data['code'] === '200') {
            this.messageService.add({
              key: 'tst',
              severity: 'success',
              summary: 'Éxito!',
              detail: 'Voluntario actualizado correctamente',
              life: 10000,
            });
            this.actualizarDatos();
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Error!',
              detail: 'No se pudo actualizar el Voluntario',
              life: 10000,
            });
            this.spinner.hide();
          }
        },
        error: (e) => {
          this.spinner.hide();
          console.log(e);
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'Se produjo un error!',
            life: 10000,
          });
        },
      });
  }

  registrarTerritorio(usuario_id: any) {
    this.spinner.show();
    let datos = {
      usuario_id: usuario_id,
      localidad_entidad: this.localidadEntidadNuevo,
      localidad_valor: this.localidadValorNuevo.toString(),
    };
    this.usuarioService.terriroio(datos).subscribe({
      next: (rest) => {
        this.actualizarDatos();
        this.spinner.hide();
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  actualizarUsuario(datos: any, id: string) {
    this.spinner.show();
    this.usuarioService.actualizarUsuario(datos, id).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.actualizarTerritorio();
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No se pudo actualizar el Voluntario',
            life: 10000,
          });
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  crearUsuario(datos: any) {
    this.spinner.show();
    this.usuarioService.crearUsuario(datos).subscribe({
      next: (data) => {
        if (data['code'] === '200') {
          this.registrarTerritorio(data.usuario_id);
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Éxito!',
            detail: 'Usuario creado correctamente',
            life: 10000,
          });
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'No se pudo crear la Usuario',
            life: 10000,
          });
          this.spinner.hide();
        }
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  filtroPais(event?: AutoCompleteCompleteEvent) {
    this.filtradoPais = this.filterService.filterTextContains(
      event.query,
      'pais',
      this.paises
    );
  }

  filtroProvincia(event: AutoCompleteCompleteEvent) {
    this.filtradoProvincia = this.filterService.filterTextContains(
      event.query,
      'provincia',
      this.provincias
    );
  }

  filtroDistrito(event: AutoCompleteCompleteEvent): void {
    this.filtradoDistrito = this.filterService.filterTextContains(
      event.query,
      'distritos',
      this.distritos
    );
  }

  filtroCanton(event: AutoCompleteCompleteEvent): void {
    this.filtradoCanton = this.filterService.filterTextContains(
      event.query,
      'canton',
      this.cantones
    );
  }

  filtroParroquia(event: AutoCompleteCompleteEvent): void {
    this.filtradoParroquia = this.filterService.filterTextContains(
      event.query,
      'parroquia',
      this.parroquias
    );
  }

  filtroZona(event: AutoCompleteCompleteEvent): void {
    this.filtradoZona = this.filterService.filterTextContains(
      event.query,
      'zona',
      this.zonas
    );
  }

  filtroRecinto(event: AutoCompleteCompleteEvent): void {
    this.filtradoRecinto = this.filterService.filterTextContains(
      event.query,
      'recinto',
      this.recintos
    );
  }

  filtroMesa(event: AutoCompleteCompleteEvent): void {
    this.filtradoMesa = this.filterService.filterTextContains(
      event.query,
      'numeroGenero',
      this.mesas
    );
  }

  resetearTerritorioEspecificos(territorios: any) {
    territorios.forEach((control) => {
      this.form.get(control).reset('');
    });
  }

  deshabilitarTerritoriosEspecificos(territorios: any) {
    territorios.forEach((control) => {
      this.form.get(control).disable();
    });
  }

  obtenerPaises() {
    this.spinner.show();
    this.territorioService.paises().subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          rest.result = rest.result.map((item) => ({
            ...item,
            pais: item.pais.trim(),
          }));

          if (this.rolSeleccionado.value.territorio == 'pais') {
            this.paises = this.validarTerritorios(rest.result);
          } else {
            this.paises = rest.result;
          }

          if (this.localidadesVoluntario) {
            this.paisSeleccionado.setValue(
              this.paises.find(
                (item) =>
                  item.id == this.localidadesVoluntario.pais
              )
            );
            this.territorioProvincia(
              this.localidadesVoluntario.pais
            );
          }
          // else {
          //   this.paisSeleccionado?.enable();
          // }
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerProvincias(
    event?: AutoCompleteCompleteEvent,
    idTerritorio?: string
  ): void {
    let id = event ? event['id'] : idTerritorio;
    this.territorioProvincia(id);
  }

  territorioProvincia(id?: any): void {
    this.spinner.show();
    this.territorioService.provincias(id).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'provincia') {
            this.provincias = this.validarTerritorios(rest.result);
          } else {
            this.provincias = rest.result;
          }

          if (this.localidadesVoluntario) {
            this.provinciaSeleccionado.setValue(
              this.provincias.find(
                (item) =>
                  item.id ==
                  this.localidadesVoluntario.provincia
              )
            );
            this.obtenerDistritos(
              null,
              this.localidadesVoluntario.provincia
            );
          }
          // else {
          //   this.provinciaSeleccionado?.enable();
          //   const nombresControles = [
          //     'provinciaSeleccionado',
          //     'distritoSeleccionado',
          //     'cantonSeleccionado',
          //     'parroquiaSeleccionado'
          //   ];
          //   this.resetearTerritorioEspecificos(nombresControles);
          // }

          if (this.rolSeleccionado.value.terriroio == 'distrito') {
            this.provincias = this.provincias.filter(
              (distrito) => distrito.distritos === 1
            );
          } else {
            this.provincias = this.provincias;
          }
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerDistritos(
    event?: AutoCompleteCompleteEvent,
    idTerritorio?: string
  ): void {
    let id = event ? event['id'] : idTerritorio;
    if (
      this.provinciaSeleccionado.value == '' ||
      this.provinciaSeleccionado.value.distritos == 0
    ) {
      this.distritoSeleccionado.setValidators([]);
      this.tieneDistrito = false;
    } else {
      this.distritoSeleccionado.setValidators([Validators.required]);
      this.tieneDistrito = true;
    }
    this.territorioDistritos(id);
  }

  territorioDistritos(id) {
    this.spinner.show();
    this.territorioService.distritos(id).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (rest.result.length > 0) {
            if (
              this.rolSeleccionado.value.territorio == 'distrito'
            ) {
              this.distritos = this.validarTerritorios(
                rest.result
              );
            } else {
              this.distritos = rest.result;
            }

            if (this.localidadesVoluntario) {
              this.distritoSeleccionado.setValue(
                this.distritos.find(
                  (item) =>
                    item.id ==
                    this.localidadesVoluntario.distrito
                )
              );
              this.cantonesService(
                'distrito',
                this.localidadesVoluntario.distrito
              );
            }
            // else {
            //   this.distritoSeleccionado?.enable();
            //   const nombresControles = [
            //     'distritoSeleccionado',
            //     'cantonSeleccionado',
            //     'parroquiaSeleccionado'
            //   ];
            //   this.resetearTerritorioEspecificos(nombresControles);
            // }
            this.distritoSeleccionado.setValidators([
              Validators.required,
            ]);
            this.tieneDistrito = true;
          } else {
            if (this.provinciaSeleccionado.value.id == undefined) {
              this.form.get['distritoSeleccionado']?.disable();
            }
            this.cantonesService('provincia', id);
            this.tieneDistrito = false;
          }
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerCantones(
    event?: AutoCompleteCompleteEvent,
    territorio?: string,
    idTerritorio?: string
  ) {
    let id = event ? event['id'] : idTerritorio;
    this.cantonesService(territorio, id);
  }

  cantonesService(territorio: string, id: string) {
    this.spinner.show();
    this.territorioService.cantones(territorio, id).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'canton') {
            this.cantones = this.validarTerritorios(rest.result);
          } else {
            this.cantones = rest.result;
          }

          if (this.localidadesVoluntario) {
            this.cantonSeleccionado.setValue(
              this.cantones.find(
                (item) =>
                  item.id == this.localidadesVoluntario.canton
              )
            );
            this.obtenerParroquias(
              null,
              this.localidadesVoluntario.canton
            );
          }
          // else {
          //   this.cantonSeleccionado?.enable();
          //   const nombresControles = [
          //     'cantonSeleccionado',
          //     'parroquiaSeleccionado'
          //   ];
          //   this.resetearTerritorioEspecificos(nombresControles);
          // }
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerParroquias(
    event?: AutoCompleteCompleteEvent,
    idTerritorio?: string
  ): void {
    let id = event ? event['id'] : idTerritorio;
    this.spinner.show();
    this.territorioService.parroquias(id).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'parroquia') {
            this.parroquias = this.validarTerritorios(rest.result);
          } else {
            this.parroquias = rest.result;
          }
          if (this.localidadesVoluntario) {
            this.parroquiaSeleccionado.setValue(
              this.parroquias.find(
                (item) =>
                  item.id ==
                  this.localidadesVoluntario.parroquia
              )
            );
            this.obtenerZonas(null, this.localidadesVoluntario.parroquia);
          }
          // else {
          //   this.parroquiaSeleccionado?.enable();
          //   const nombresControles = [
          //     'parroquiaSeleccionado'
          //   ];
          //   this.resetearTerritorioEspecificos(nombresControles);
          // }
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerZonas(event?: AutoCompleteCompleteEvent, idTerritorio?: string) {
    let id = event ? event['id'] : idTerritorio;
    this.spinner.show();
    this.territorioService.zonas(id).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'zona') {
            this.zonas = this.validarTerritorios(rest.result);
          } else {
            this.zonas = rest.result
          }
        }
        if (this.localidadesVoluntario) {
          this.zonaSeleccionado.setValue(
            this.zonas.find(
              (item) =>
                item.id ==
                this.localidadesVoluntario.zona
            )
          );
          // this.obtenerRecinto(null, this.localidadesVoluntario.zonas);
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    })
  }

  obtenerRecinto(event?: AutoCompleteCompleteEvent, idTerritorio?: string) {
    let id = event ? event['id'] : idTerritorio;
    let territorio = 'zona';
    this.spinner.show();
    this.territorioService.recinto(id, territorio).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'recinto') {
            this.recintos = this.validarTerritorios(rest.result);
          } else {
            this.recintos = rest.result
          }
        }
        if (this.localidadesVoluntario) {
          this.recintoSeleccionado.setValue(
            this.recintos.find(
              (item) =>
                item.id ==
                this.localidadesVoluntario.recinto
            )
          );
          // this.obtenerMesa(null, this.localidadesVoluntario.recinto);
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  obtenerMesa(event?: AutoCompleteCompleteEvent, idTerritorio?: string) {
    let id = event ? event['id'] : idTerritorio;
    let territorio = 'recinto';
    this.spinner.show();
    this.territorioService.mesa(id, territorio).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          if (this.rolSeleccionado.value.territorio == 'mesa') {
            this.mesas = this.validarTerritorios(rest.result);
          } else {
            this.mesas = rest.result
          }
        }
        this.mesas = this.mesas.map(item => ({
          ...item,
          numeroGenero: `${item.numero} - ${item.genero}`
        }));
        
        if (this.localidadesVoluntario) {
          this.mesaSeleccionado.setValue(
            this.mesas.find(
              (item) =>
                item.id ==
                this.localidadesVoluntario.mesa
            )
          );
        }
        this.spinner.hide();
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  devinirTerritorios(event: any): void {
    this.obtenerTerritoriosOcupados();
  }

  obtenerTerritoriosOcupados() {
    this.spinner.show();
    let request = {
      eleccion_id: this.eleccionSeleccionada.id,
      rol_id: this.rolSeleccionado.value.id,
      localidad_entidad: this.rolSeleccionado.value.territorio,
    };

    this.usuarioService.rolesAsignadosTerriroio(request).subscribe({
      next: (rest) => {
        if (rest.code === '200') {
          this.territoriosOcupados = rest.result;
          switch (this.rolSeleccionado.value.territorio) {
            case 'pais':
              this.paises = this.validarTerritorios(rest.result);
              break;
            case 'provincia':
              this.provincias = this.validarTerritorios(
                rest.result
              );
              break;
            case 'distrito':
              this.distritos = this.validarTerritorios(
                rest.result
              );
              break;
            case 'canton':
              this.cantones = this.validarTerritorios(
                rest.result
              );
              break;
            case 'parroquia':
              this.parroquias = this.validarTerritorios(
                rest.result
              );
              break;
            default:
              break;
          }
        }
        this.spinner.hide();
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se produjo un error.',
          life: 10000,
        });
      },
    });
  }

  validarTerritorios(data: any[]): any[] {
    return data.filter(
      (item) =>
        !this.territoriosOcupados.some(
          (territorio) => territorio.localidad_valor == item.id
        )
    );
  }

  obtenerImagen(ci: string) {
    this.spinner.show();
    this.imagenService.obtenerToken().subscribe({
      next: (data) => {
        if (data) {
          let request = {
            token: data,
            ci: this.voluntarioSeleccionado.padron_electoral.cedula,
          };
          this.imagenService.obtenerImagen(request).subscribe({
            next: (data) => {
              if (data.fotografia) {
                this.fotoVoluntario =
                  'data:image/jpeg;base64,' + data.fotografia;
                this.presentarFoto = true;
              }
              this.spinner.hide();
            },
            error: (e) => {
              this.spinner.hide();
              console.log(e);
              this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error!',
                detail: 'Se produjo un error!',
                life: 10000,
              });
            },
          });
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Se produjo un error!',
          life: 10000,
        });
      },
    });
  }

  isMobile(): boolean {
    return this.windowRef.isMobile();
  }
}
