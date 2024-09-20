import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { EleccionService } from 'src/app/control-electoral/services/eleccion.service';
import { EstadisticaService } from 'src/app/control-electoral/services/estadistica.service';
import { TerritorioService } from 'src/app/control-electoral/services/territorio.service';
import * as Highcharts from 'highcharts';

// import * as worldMap from '@highcharts/map-collection/countries/ec/ec-all.geo.json';
import * as paisMap from 'src/assets/geoJSON/gadm41_ECU_0.json';
import * as provinciaMap from 'src/assets/geoJSON/gadm41_ECU_1.json';
import * as cantonMap from 'src/assets/geoJSON/gadm41_ECU_2.json';
import * as parroquiaMap from 'src/assets/geoJSON/gadm41_ECU_3.json';
import * as distritoMap from 'src/assets/geoJSON/distrito.json';

import MapModule from 'highcharts/modules/map';
import ExportingModule from 'highcharts/modules/exporting';
import { appConfig } from 'src/app/config';
import { Table } from 'primeng/table';
import { RolService } from 'src/app/control-electoral/services/rol.service';
import { FiltersService } from 'src/app/control-electoral/services/utils/filters.service';
import { WindowRef } from 'src/app/control-electoral/services/utils/window.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptedService } from 'src/app/control-electoral/services/utils/encrypted.service';

MapModule(Highcharts);
ExportingModule(Highcharts);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartMap: Highcharts.Options = {};
  chartInstance: Highcharts.Chart | undefined;


  form: FormGroup;
  listaElecciones: any = [];
  listaRoles: any = [];
  eleccionSeleccionada: any;
  localidadValor: string;
  localidadEntidad: string;
  idRol: string;
  tieneDistrito = false;

  filtradoRol: any[] | undefined;
  filtradoPais: any[] | undefined;
  filtradoProvincia: any[] | undefined;
  filtradoDistrito: any[] | undefined;
  filtradoParroquia: any[] | undefined;
  filtradoCanton: any[] | undefined;

  paises = []
  provincias = [];
  distritos = [];
  cantones = []
  parroquias = []

  rowsPerPageOptions = appConfig.rowsPerPageOptions;
  rowsInit = appConfig.rowsInit;
  listaAsignados: any = [];
  colsAsignados: any[] = [];
  listaNoAsignados: any = [];
  colsNoAsignados: any[] = [];
  listaTotales: any = [];
  colsTotales: any[] = [];

  paisVisible = true;
  provinciaVisible = true;
  distritoVisible = true;
  cantonVisible = true;
  parroquiaVisible = true;
  encryptedUserData = ''
  filtroAvanzado: boolean = false;
  constructor(private messageService: MessageService, private eleccionService: EleccionService, private estadisticasService: EstadisticaService, private spinner: NgxSpinnerService,
    private territorioService: TerritorioService, private rolService: RolService, private filterService: FiltersService,
    private fb: FormBuilder, private windowRef: WindowRef, private encryptedService: EncryptedService) {
    this.encryptedUserData = localStorage.getItem('userData');
  }

  ngOnInit() {
    this.form = this.fb.group({
      rol: [''],
      pais: [''],
      provincia: [{ value: '', disabled: true }],
      distrito: [{ value: '', disabled: true }],
      canton: [{ value: '', disabled: true }],
      parroquia: [{ value: '', disabled: true }],
    });

    this.colsAsignados = [
      { field: 'territorio', header: 'Localidad', type: 'text' },
      { field: 'usuario', header: 'Usuario asignado', type: 'text' },
      { field: 'telefono', header: 'Teléfono', type: 'text' }
    ];

    this.colsNoAsignados = [
      { field: 'territorio', header: 'Localidad', type: 'text' }
    ];

    this.colsTotales = [
      { field: 'estado', header: 'Estado', type: 'text' },
      { field: 'cantidad', header: 'Cantidad', type: 'text' }
    ];

    if (this.encryptedUserData) {
      const userData = this.encryptedService.decryptData(this.encryptedUserData);
      this.localidadEntidad = userData.localidadEntidad;
      this.localidadValor = this.localidadEntidad != '*' ? userData.localidadValor : '';
      this.idRol = userData.idRol;
    }
    this.obtenerElecciones();
    this.obtenerRoles();
    this.inicializarMapa();
  }

  inicializarMapa() {
    const data = [
      ['ECU', 2]
    ];

    this.chartMap = {
      chart: {
        type: 'map',
        map: paisMap
      },

      title: {
        text: ''
      },

      subtitle: {
        text: 'Visualización de localidades con el estado de registro en tiempo real.'
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },

      colorAxis: {
        dataClasses:
          [
            {
              from: 0,
              to: 0,
              color: '#ff4646',
              name: 'No asignadas'
            },
            {
              from: 1,
              to: 1,
              color: '#0f3967',
              name: 'Asignadas'
            }
          ]
      },

      legend: {
        align: 'right',
        verticalAlign: 'top',
        x: -100,
        y: 70,
        floating: true,
        layout: 'horizontal',
        enabled: true
      },

      series: [
        {
          name: 'Registros',
          // states: {
          //     hover: {
          //         color: 'rgb(166, 193, 255)'
          //     }
          // },
          dataLabels: {
            enabled: false,
            format: '{point.name}'
          },

          allAreas: false,
          data: data,
          color: 'rgb(166, 193, 255)'
        } as Highcharts.SeriesMapOptions
      ]
    };
  }

  onChartInstance(chart: Highcharts.Chart) {
    this.chartInstance = chart;
  }

  cargarEstadisticas() {
    switch (this.localidadEntidad) {
      case '*':
        this.obtenerPaises();
        break;
      case 'pais':
        this.obtenerProvincias(null, this.localidadValor);
        this.provincia?.enable();
        this.paisVisible = false;
        break;
      case 'provincia':
        this.obtenerDistritos(null, this.localidadValor);
        this.distrito?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        break;
      case 'distrito':
        this.cantonesService(null, this.localidadValor);
        this.canton?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        break;
      case 'canton':
        this.obtenerParroquias(null, this.localidadValor);
        this.parroquia?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        this.cantonVisible = false;
        break;
      case 'parroquia':
        // this.obtenerDistritos(null, this.localidadValor);
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        this.cantonVisible = false;
        this.parroquiaVisible = false;
        break;
      default:
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se ha  una Localidad', life: 10000 });
        break;
    }
  }

  cambioRol() {
    switch (this.rol.value.terriroio) {
      case 'pais':
        this.provincia?.enable();
        this.paisVisible = false;
        break;
      case 'provincia':
        this.obtenerDistritos(null, this.localidadValor);
        this.distrito?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        break;
      case 'distrito':
        this.cantonesService(null, this.localidadValor);
        this.canton?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        break;
      case 'canton':
        this.obtenerParroquias(null, this.localidadValor);
        this.parroquia?.enable();
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        this.cantonVisible = false;
        break;
      case 'parroquia':
        this.paisVisible = false;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        this.cantonVisible = false;
        this.parroquiaVisible = false;
        break;
      default:
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se ha  una Localidad', life: 10000 });
        break;
    }
  }

  obtenerElecciones() {
    this.spinner.show();
    this.eleccionService.listEleccion().subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.listaElecciones = data['result'];
          this.eleccionSeleccionada = this.listaElecciones.length ? this.listaElecciones[0] : null;
          this.cargarEstadisticas();
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen Elecciones activas', life: 10000 });
        }
        this.spinner.hide();
      }, error: e => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      }
    });
  }

  obtenerRoles() {
    this.spinner.show();
    let idRol
    if (this.encryptedUserData) {
      const userData = this.encryptedService.decryptData(this.encryptedUserData);
      idRol = userData.idRol;
    }
    this.rolService.obtenerRolPorId(idRol).subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.listaRoles = data['result'];
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se pudo cargar los roles', life: 10000 });
        }
        this.spinner.hide();
      }, error: e => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      }
    })
  }

  get rol() {
    return this.form.get('rol');
  }

  get pais() {
    return this.form.get('pais');
  }

  get provincia() {
    return this.form.get('provincia');
  }

  get distrito() {
    return this.form.get('distrito');
  }

  get canton() {
    return this.form.get('canton');
  }

  get parroquia() {
    return this.form.get('parroquia');
  }

  obtenerPaises() {
    this.spinner.show();
    this.territorioService.paises().subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.paises = rest.result.map(item => ({
            ...item,
            pais: item.pais.trim()
          }));
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  obtenerProvincias(event?: AutoCompleteCompleteEvent, idTerritorio?: string): void {
    this.spinner.show();
    let id = event ? event['id'] : idTerritorio;
    this.territorioService.provincias(id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.provincias = rest.result;
          this.provincia?.enable();
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  obtenerDistritos(event?: AutoCompleteCompleteEvent, idTerritorio?: string): void {
    this.spinner.show();
    let id = event ? event['id'] : idTerritorio;

    if (this.provincia.value == "" || this.provincia.value.distritos == 0) {
      this.distrito.setValidators([]);
      this.tieneDistrito = false;
    } else {
      this.distrito.setValidators([Validators.required]);
      this.tieneDistrito = true;
    }
    this.territorioService.distritos(id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.distritos = rest.result
          if (this.distritos.length > 0) {
            this.distrito.setValidators([Validators.required]);
            this.tieneDistrito = true;
            this.distrito?.enable();
          } else {
            if (this.provincia.value.id == undefined) {
              this.form.get['distrito']?.disable();
            }
            this.cantonesService('provincia', id)
            this.tieneDistrito = false;
          }
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  obtenerCantones(event?: AutoCompleteCompleteEvent, territorio?: string, idTerritorio?: string) {
    let id = event ? event['id'] : idTerritorio;
    this.cantonesService(territorio, id);
  }

  obtenerParroquias(event?: AutoCompleteCompleteEvent, idTerritorio?: string): void {
    this.spinner.show();
    let id = event ? event['id'] : idTerritorio;
    this.parroquia?.enable();
    this.territorioService.parroquias(id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.parroquia?.enable();
          this.parroquias = rest.result;
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  cantonesService(territorio: string, id: string) {
    this.spinner.show();
    this.canton?.enable();
    this.territorioService.cantones(territorio, id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.canton?.enable();
          this.cantones = rest.result;
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  obtenerEstadisticas(rol: string, localidadPadre: string, localidadValor: string, mapa?: string) {
    this.spinner.show();
    this.listaAsignados = [];
    this.listaNoAsignados = [];
    this.listaTotales = [];

    let request = {};

    if (this.rol.value == '') {
      request = {
        tipo: "1",
        eleccion_id: this.eleccionSeleccionada.id,
        rol: rol,
        localidad_padre: localidadPadre,
        localidad_valor: localidadValor
      }
    } else {
      request = {
        tipo: "2",
        eleccion_id: this.eleccionSeleccionada.id,
        rol: rol,
        localidad_rol: this.rol.value.territorio,
        filtro_localidad: localidadPadre,
        filtro_valor: localidadValor
      }
    }

    this.estadisticasService.obtenerConteoRegistros(request).subscribe({
      next: data => {
        if (data['code'] === "200") {
          let tituloActual = this.chartInstance?.options.title?.text;
          if (this.chartInstance) {

            if (!tituloActual.includes(rol)) {
              switch (mapa ? mapa : localidadPadre) {
                case '*':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: paisMap
                    }
                  });
                  break;

                case 'pais':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: provinciaMap
                    }
                  });
                  break;

                case 'provincia':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: cantonMap
                    }
                  });
                  break;

                case 'canton-distrito':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: cantonMap
                    }
                  });
                  break;

                case 'canton':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: parroquiaMap
                    }
                  });
                  break;

                case 'distrito':
                  this.chartInstance.update({
                    title: {
                      text: 'MAPA DE ASIGNACIÓN DE ROL: ' + rol
                    },
                    chart: {
                      map: distritoMap
                    }
                  });
                  break;
              }
            }

            this.listaAsignados = data.result.asignados;
            this.listaNoAsignados = data.result.noAsignados;
            this.listaTotales = [
              { estado: "Asignados", cantidad: this.listaAsignados.length.toString() },
              { estado: "No asignados", cantidad: this.listaNoAsignados.length.toString() }
            ];

            this.chartInstance.series[0].setData(data.result.grafico, true);
          }

        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen Cordinadores Nacionales', life: 10000 });
        }
        this.spinner.hide();
      }, error: e => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      }
    });

  }

  consultarRegistros() {
    if (this.filtroAvanzado) {
      let map = '';

      switch (this.rol.value.territorio) {
        case 'pais':
          map = '*';
          break;
        case 'provincia':
          map = 'pais';
          break;
        case 'distrito':
          map = 'distrito';
          break;
        case 'canton':
          map = 'provincia';
          break;
        case 'parroquia':
          map = 'canton';
          break;
      }

      if (this.parroquia.value != '') {
        this.obtenerEstadisticas(this.rol.value.rol, 'parroquia', this.parroquia.value.id.toString(), map);
      } else if (this.canton.value != '') {
        this.obtenerEstadisticas(this.rol.value.rol, 'canton', this.canton.value.id.toString(), map);
      } else if (this.distrito.value != '') {
        this.obtenerEstadisticas(this.rol.value.rol, 'distrito', this.distrito.value.id.toString(), map);
      } else if (this.provincia.value != '') {
        this.obtenerEstadisticas(this.rol.value.rol, 'provincia', this.provincia.value.id.toString(), map);
      } else if (this.pais.value != '') {
        this.obtenerEstadisticas(this.rol.value.rol, 'pais', this.pais.value.id.toString(), map);
      } else {
        if (this.localidadEntidad == '*') {
          this.obtenerEstadisticas(this.rol.value.rol, '*', '*', map);
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se ha seleccionado una localidad', life: 10000 });
        }
      }
    } else {
      if (this.parroquia.value != '') {
        //
      } else if (this.canton.value != '') {
        if (this.localidadEntidad != 'canton') {
          this.obtenerEstadisticas("Coordinador Parroquial", "canton", this.canton.value.id.toString());
        }

      } else if (this.distrito.value != '') {
        if (this.localidadEntidad != 'distrito' && this.localidadEntidad != 'provincia') {
          this.obtenerEstadisticas("Coordinador Cantonal", "canton-distrito", this.distrito.value.id.toString());
        }

      } else if (this.provincia.value != '') {
        if (this.localidadEntidad != 'provincia') {
          if (this.tieneDistrito) {
            this.obtenerEstadisticas("Coordinador Distrital", "distrito", this.provincia.value.id.toString());
          } else {
            this.obtenerEstadisticas("Coordinador Cantonal", "provincia", this.provincia.value.id.toString());
          }
        }

      } else if (this.pais.value != '') {
        if (this.localidadEntidad != 'pais') {
          this.obtenerEstadisticas("Coordinador Provincial", "pais", this.pais.value.id.toString());
        } else if (this.localidadEntidad == 'pais') {
          this.obtenerEstadisticas("Coordinador Provincial", "pais", this.localidadValor);
        }
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No se ha seleccionado una localidad', life: 10000 });
      }
    }
  }

  limpiarFiltros(tipo: string) {
    this.pais.setValue('');
    this.provincia.setValue('');
    this.distrito.setValue('');
    this.canton.setValue('');
    this.parroquia.setValue('');
    this.provincia?.disable();
    this.canton?.disable();
    this.parroquia?.disable();
    this.tieneDistrito = false;
    this.paisVisible = true;
    this.provinciaVisible = true;
    this.distritoVisible = true;
    this.cantonVisible = true;
    this.parroquiaVisible = true;
    this.obtenerPaises();

    if (tipo == 'total') {
      this.rol.setValue('');
    }
    if (this.filtroAvanzado) {
      this.validarOpciones();
    }
    this.cargarEstadisticas();
  }

  validarOpciones() {
    switch (this.rol.value.territorio) {
      case 'pais':
        this.paisVisible = true;
        this.provinciaVisible = false;
        this.distritoVisible = false;
        this.cantonVisible = false;
        this.parroquiaVisible = false;
        break;
      case 'provincia':
        this.paisVisible = true;
        this.provinciaVisible = true;
        this.distritoVisible = false;
        this.cantonVisible = false;
        this.parroquiaVisible = false;
        break;
      case 'distrito':
        this.paisVisible = true;
        this.provinciaVisible = true;
        this.distritoVisible = true;
        this.cantonVisible = false;
        this.parroquiaVisible = false;
        break;
      case 'canton':
        this.paisVisible = true;
        this.provinciaVisible = true;
        this.distritoVisible = true;
        this.cantonVisible = true;
        this.parroquiaVisible = false;
        break;
      case 'parroquia':
        this.paisVisible = true;
        this.provinciaVisible = true;
        this.distritoVisible = true;
        this.cantonVisible = true;
        this.parroquiaVisible = true;
        break;
    }
  }

  actualizaOpciones(filtro: string) {
    let nombresControles = [];
    switch (filtro) {
      case 'pais':
        this.tieneDistrito = false;
        this.provincias = [];
        this.distritos = [];
        this.cantones = [];
        this.parroquias = [];
        nombresControles = [
          'provincia',
          'distrito',
          'canton',
          'parroquia'
        ];
        this.obtenerProvincias(null, this.pais.value.id);
        break;

      case 'provincia':
        this.tieneDistrito = false;
        this.distritos = [];
        this.cantones = [];
        this.parroquias = [];
        nombresControles = [
          'distrito',
          'canton',
          'parroquia'
        ];
        this.obtenerDistritos(null, this.provincia.value.id);
        break;

      case 'distrito':
        this.cantones = [];
        this.parroquias = [];
        nombresControles = [
          'canton',
          'parroquia'
        ];
        this.cantonesService('distrito', this.distrito.value.id);
        break;

      case 'canton':
        this.parroquias = [];
        nombresControles = [
          'parroquia'
        ];
        this.obtenerParroquias(null, this.canton.value.id);
        break;
    }
    this.resetearTerritorioEspecificos(nombresControles);
  }

  resetearTerritorioEspecificos(territorios: any) {
    territorios.forEach(control => {
      this.form.get(control).reset('');
      this.form.get(control).disable();
    });
  }

  filtroRol(event: AutoCompleteCompleteEvent) {
    this.filtradoRol = this.filterService.filterTextContains(event.query, 'rol', this.listaRoles);
  }

  filtroPais(event: AutoCompleteCompleteEvent) {
    this.filtradoPais = this.filterService.filterTextContains(event.query, 'pais', this.paises);
  }

  filtroProvincia(event: AutoCompleteCompleteEvent) {
    this.filtradoProvincia = this.filterService.filterTextContains(event.query, 'provincia', this.provincias);
  }

  filtroDistrito(event: AutoCompleteCompleteEvent): void {
    this.filtradoDistrito = this.filterService.filterTextContains(event.query, 'distritos', this.distritos);
  }

  filtroCanton(event: AutoCompleteCompleteEvent): void {
    this.filtradoCanton = this.filterService.filterTextContains(event.query, 'canton', this.cantones);
  }

  filtroParroquia(event: AutoCompleteCompleteEvent): void {
    this.filtradoParroquia = this.filterService.filterTextContains(event.query, 'parroquia', this.parroquias);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  isMobile(): boolean {
    return this.windowRef.isMobile();
  }
}