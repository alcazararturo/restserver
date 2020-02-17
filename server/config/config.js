// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    // urlDB = 'mongodb+srv://m220student:FCbhWQrB78hcf8DS@mflix-bb7g0.mongodb.net/smeco?retryWrites=true&w=majority';
    //urlDB = `mongodb://gh_5304:gh_5304@localhost:27017/${ GITHUB_ISSUE }?authSource=admin`);
    //urlDB = 'mongodb://localhost:27017/smeco?authSource=admin';
    // let uri = 'mongodb://localhost:27017/smeco?authSource=admin&retryWrites=true';
    
    urlDB = ( 'mongodb://localhost:27017/smeco' );
} else {
//	urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ============================
//  Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '566354606247-ftfujddlb6f6jm6mtl6pshi36bej2vda.apps.googleusercontent.com'

// ============================
//  cloudinary Client ID
// ============================

process.env.CLOUDNAME = process.env.cloudName;
process.env.APIKEY    = process.env.apiKey;
process.env.APISECRET = process.env.apiSecret;