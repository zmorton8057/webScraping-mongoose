// var mysql = require('mysql');
// var connection;

// ///// for JAWS DB when connecting to Heroku ADDON
// if (process.env.JAWSDB_URL) {
//     connection = mysql.createConnection(process.env.JAWSDB_URL);
// } else {
// ////// FOR LOCAL HOST Connection to default to if there is not a JAWSDB ADDON
//     connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         database: 'scraper_db'
//     });
// };

// connection.connect(function (err) {
//     if (err) {
//         console.log("Error Connection: " + err.stack);
//         return;
//     }
//     console.log("Connected as ID: " + connection.threadId);
// });

// module.exports = connection;