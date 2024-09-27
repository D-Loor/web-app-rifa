import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, SelectItem } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RifaService } from 'src/app/control-electoral/services/rifa.service';
import { FechaService } from 'src/app/control-electoral/services/utils/fecha.service';
import { Product } from 'src/app/demo/api/product';

@Component({
    selector: 'app-tiket',
    templateUrl: './tiket.component.html',
    styleUrls: ['./tiket.component.scss'],
    providers: [MessageService]
})
export class TiketComponent implements OnInit {
    products: Product[] = [];

    sortOptions: SelectItem[] = [];

    sourceCities: any[] = [];
    targetCities: any[] = [];
    orderCities: any[] = [];
    numSuerte: string | null = null; // Inicializa la variable
    // Aseguramos que `listaRifas` esté correctamente tipada como array de objetos
    listaRifas: any[] = [];
    comprarTicket: boolean = false;
    rifaDatos: any
    sortField = 'valor'; // Campo por el cual se ordena
    sortOrder = 1;
    fechaHoy: any = null;
    cifras = [
        { name: 'Dos Cifras', code: '2' },
        { name: 'Tres Cifras', code: '3' }
    ];

    pdfUrl: SafeResourceUrl | null = null;
    constructor(private rifaService: RifaService, private messageService: MessageService, private spinner: NgxSpinnerService,
        private fechaService: FechaService, private sanitizer: DomSanitizer
    ) {
        this.fechaHoy = this.fechaService.obtenerFechaHoy();
    }

    ngOnInit() {
        this.cargarRifas();
    }

    cargarRifas() {
        this.spinner.show();
        // Llamada al servicio para obtener la lista de rifas
        this.rifaService.listaRifasAVender().subscribe({
            next: (data: any) => {
                if (!data['result'] || data['result'].length === 0) {
                    this.spinner.hide();  // Ocultar spinner si no hay rifas
                    this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'No hay rifas disponibles', life: 3000 });
                    this.listaRifas = []; // O podrías asignar un mensaje u objeto adecuado
                    return; // Salir de la función si no hay datos
                }

                const rifasConConteo = data['result'].map((rifa: any) => {
                    const nomCifras = this.getCifrasLabel(rifa.cifras);

                    // Retorna el observable del conteoVendidos para hacer forkJoin
                    return this.rifaService.conteoVendidos(this.fechaHoy, rifa.id).pipe(
                        map((conteoData: any) => {
                            const limiteRestante = rifa.limite - conteoData['result'];
                            return {
                                ...rifa,  // Mantén los datos originales
                                nom_Cifras: nomCifras,  // Añade el campo nom_Cifras
                                limite: limiteRestante  // Actualiza el límite restante
                            };
                        })
                    );
                });

                // Esperamos a que todas las peticiones de conteoVendidos se completen
                forkJoin(rifasConConteo).subscribe({
                    next: (resultados: any[]) => {
                        this.listaRifas = resultados;
                        this.spinner.hide();  // Asignamos las rifas con el límite actualizado
                    },
                    error: (error) => {
                        this.spinner.hide();
                        console.error('Error al combinar los resultados:', error);
                    }
                });
            },
            error: (error) => {
                this.spinner.hide();
                console.error('Error al obtener las rifas:', error);
            }
        });
    }


    getStatusText(limite: number): string {
        if (limite === 0) {
            return 'No Disponible';
        } else if (limite > 5) {
            return 'Disponible';
        } else {
            return 'Por Terminarse';
        }
    }

    // Devuelve el nombre de las cifras basado en el código
    getCifrasLabel(code: number | string): string {
        const cifra = this.cifras.find(c => c.code == code);
        return cifra ? cifra.name : 'Desconocido'; // Devuelve 'Desconocido' si no hay coincidencia
    }

    verMas(rifa: any) {
        this.comprarTicket = true;
        this.rifaDatos = rifa;
    }

    cerrarDialog() {
        this.comprarTicket = false;
        this.pdfUrl = null;
        this.numSuerte = ''
        this.cargarRifas();
    }

    guardarTicket(numSuerteInput: any) {
        if (numSuerteInput.invalid) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información!', detail: 'Ingrese un número de la suerte valido', life: 3000 });
        } else {
            this.spinner.show();
            this.rifaService.comprarTicket(this.rifaDatos, this.numSuerte).subscribe({
                next: (pdfBlob: Blob) => { // Cambia aquí para recibir el PDF
                    const blobUrl = window.URL.createObjectURL(pdfBlob);
                    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Asegura la URL del PDF

                    // Mostrar el número de suerte en el mensaje de éxito
                    this.messageService.add({
                        key: 'tst',
                        severity: 'success',
                        summary: '¡Ticket Comprado!',
                        detail: 'Tu número de suerte es: ' + this.numSuerte,
                        life: 5000
                    });
                    this.spinner.hide();
                },
                error: (error) => {
                    this.spinner.hide();
                    console.error('Error al comprar el ticket:', error);
                    this.messageService.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Se produjo un error al comprar el ticket.'
                    });
                }
            });

        }
    }
}
