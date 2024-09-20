export const appConfig = {
    
  rowsInit: 10,
  rowsPerPageOptions: [10, 25, 50],

  //credenciales api imagen
  apiImagenes: {
    urlToken: 'https://app01.cne.gob.ec/apigateway/apifotografiasrc/auth/token',
    urlImagen: 'https://app01.cne.gob.ec/apigateway/apifotografiasrc/fotografia/GetFotografia',
    userName: 'FotosRC2023',
    password: 'F0t0s_2023'
  },

  excepciones: [
    'https://app01.cne.gob.ec/',
  ]
};