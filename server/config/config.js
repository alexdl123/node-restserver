/**
 * 
 */

//-------------------------------------
//------------Puerto-------------------
//-------------------------------------

process.env.PORT = process.env.PORT || 3000;

//-------------------------------------
//--------------SEED-------------------
//-------------------------------------

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarollo';

//-------------------------------------
//----Vencimiento del token------------
//-------------------------------------
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';


//-------------------------------------
//------------Client Google ID---------
//-------------------------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || '620380468093-curab1udpve8tlg6b803ebccdvtte2nu.apps.googleusercontent.com';

//-------------------------------------
//--------------Entorno----------------
//-------------------------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//-------------------------------------
//------------Base de Datos------------
//-------------------------------------

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.URL;
}

process.env.URLDB = urlDB;