

//configuracion de puerto
process.env.PORT = process.env.PORT || 3001;

// =========================================
// Entorno 
// =========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =========================================
// Tiempo de uso del token
// =========================================

process.env.CADUCIDAD_TOKEN = '2h';

// =========================================
// SEED Semilla de autenticacion del token 
// =========================================

process.env.SEED = process.env.SEED || 'semilla-de-token-de-desarrollo';



// =========================================
// Base de datos
// =========================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/WorkShop'

} else {
    urlDB = "mongodb+srv://Admin:ROziEJW4ox2SKy5b@cluster0.hxboc.mongodb.net/WorkShop?retryWrites=true&w=majority"

}

process.env.URLDB = urlDB;



