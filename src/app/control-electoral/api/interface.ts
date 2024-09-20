export interface VoluntarioDatosRegistro {
    id?: string;
    padron_electoral_id: number;
    correo: string;
    telefono: string;
    tipo: string;
    red_fb?: string;
    red_tw?: string;
    red_ig?: string;
    red_tk?: string;
    estado?: string;
}

export interface PadronElectoral {
    padron_electoral_id: number;
    cedula: string;
    nom_padron: string;
    nom_pais: string;
    provincia_id: number;
    nom_provincia: string;
    canton_id: number;
    nom_canton: string;
    parroquia_id: number;
    nom_parroquia: string;
}

export interface Eleccion {
    id: number;
    eleccion: string;
    descripcion: string;
    fecha: string;
    estado: string;
    nemonico: string;
}

export interface Permiso {
    id?: string;
    permiso: string;
    estado: string;
    descripcion: string;
    proceso?:string;
}

export interface CountryInfo {
    name: string;
    code: string;
    mask: string;
    flag: string;
    numCod: string; // Añadido el nuevo campo numCod
}

export const americaCountries: CountryInfo[] = [
    { name: 'Argentina', code: 'AR', mask: '99 9999 9999', flag: 'ar', numCod: '+54' },
    { name: 'Bolivia', code: 'BO', mask: '9 9999 9999', flag: 'bo', numCod: '+591' },
    { name: 'Brasil', code: 'BR', mask: '(99) 99999 9999', flag: 'br', numCod: '+55' },
    { name: 'Canadá', code: 'CA', mask: '(999) 999 9999', flag: 'ca', numCod: '+1' },
    { name: 'Chile', code: 'CL', mask: '9 9999 9999', flag: 'cl', numCod: '+56' },
    { name: 'Colombia', code: 'CO', mask: '999 999 9999', flag: 'co', numCod: '+57' },
    { name: 'Costa Rica', code: 'CR', mask: '9999 9999', flag: 'cr', numCod: '+506' },
    { name: 'Cuba', code: 'CU', mask: '9 9999 9999', flag: 'cu', numCod: '+53' },
    { name: 'República Dominicana', code: 'DO', mask: '(999) 999 9999', flag: 'do', numCod: '+1' },
    { name: 'Ecuador', code: 'EC', mask: '99 999 9999', flag: 'ec', numCod: '+593' },
    { name: 'El Salvador', code: 'SV', mask: '9999 9999', flag: 'sv', numCod: '+503' },
    { name: 'Guatemala', code: 'GT', mask: '9999 9999', flag: 'gt', numCod: '+502' },
    { name: 'Haití', code: 'HT', mask: '9999 9999', flag: 'ht', numCod: '+509' },
    { name: 'Honduras', code: 'HN', mask: '9999 9999', flag: 'hn', numCod: '+504' },
    { name: 'México', code: 'MX', mask: '(999) 999 9999', flag: 'mx', numCod: '+52' },
    { name: 'Nicaragua', code: 'NI', mask: '9999 9999', flag: 'ni', numCod: '+505' },
    { name: 'Panamá', code: 'PA', mask: '9999 9999', flag: 'pa', numCod: '+507' },
    { name: 'Paraguay', code: 'PY', mask: '(999) 999 999', flag: 'py', numCod: '+595' },
    { name: 'Perú', code: 'PE', mask: '999 999 999', flag: 'pe', numCod: '+51' },
    { name: 'Estados Unidos', code: 'US', mask: '(999) 999 9999', flag: 'us', numCod: '+1' },
    { name: 'Uruguay', code: 'UY', mask: '9999 9999', flag: 'uy', numCod: '+598' },
    { name: 'Venezuela', code: 'VE', mask: '(999) 999 9999', flag: 've', numCod: '+58' },
    { name: 'Alemania', code: 'DE', mask: '9999 9999999', flag: 'de', numCod: '+49' },
    { name: 'Francia', code: 'FR', mask: '99 99 99 99 99', flag: 'fr', numCod: '+33' },
    { name: 'Italia', code: 'IT', mask: '999 999 9999', flag: 'it', numCod: '+39' },
    { name: 'España', code: 'ES', mask: '999 99 99 99', flag: 'es', numCod: '+34' },
    { name: 'Reino Unido', code: 'GB', mask: '99999 999999', flag: 'gb', numCod: '+44' },
    { name: 'Países Bajos', code: 'NL', mask: '99 999 9999', flag: 'nl', numCod: '+31' },
    { name: 'Bélgica', code: 'BE', mask: '999 99 99 99', flag: 'be', numCod: '+32' },
    { name: 'Suiza', code: 'CH', mask: '99 999 99 99', flag: 'ch', numCod: '+41' },
    { name: 'Suecia', code: 'SE', mask: '999 999 99 99', flag: 'se', numCod: '+46' },
    { name: 'Noruega', code: 'NO', mask: '99 99 99 99', flag: 'no', numCod: '+47' },
    { name: 'Dinamarca', code: 'DK', mask: '99 99 99 99', flag: 'dk', numCod: '+45' },
    { name: 'Finlandia', code: 'FI', mask: '999 9999999', flag: 'fi', numCod: '+358' },
    { name: 'Irlanda', code: 'IE', mask: '999 999 9999', flag: 'ie', numCod: '+353' },
    { name: 'Portugal', code: 'PT', mask: '999 999 999', flag: 'pt', numCod: '+351' },
    { name: 'Austria', code: 'AT', mask: '9999 999999', flag: 'at', numCod: '+43' },
    { name: 'Grecia', code: 'GR', mask: '999 999 9999', flag: 'gr', numCod: '+30' },
    { name: 'Polonia', code: 'PL', mask: '999 999 999', flag: 'pl', numCod: '+48' },
    { name: 'Hungría', code: 'HU', mask: '99 999 999', flag: 'hu', numCod: '+36' },
    { name: 'República Checa', code: 'CZ', mask: '999 999 999', flag: 'cz', numCod: '+420' },
    { name: 'Rumania', code: 'RO', mask: '999 999 999', flag: 'ro', numCod: '+40' },
    { name: 'Croacia', code: 'HR', mask: '99 999 9999', flag: 'hr', numCod: '+385' },
    { name: 'Eslovaquia', code: 'SK', mask: '999 999 999', flag: 'sk', numCod: '+421' },
    { name: 'Eslovenia', code: 'SI', mask: '99 999 9999', flag: 'si', numCod: '+386' }
];