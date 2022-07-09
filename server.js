import { sockets } from "./server-dependences/http-server.js";
import { colorString } from './server-dependences/terminal-colors.js';
import { DataBaseConnection, SqlDebuguer, SqlFormater } from './server-dependences/data-base.js';
import { getCountries } from './server-dependences/countries-names/countries-names.js';
import { User } from './server-dependences/accounts/user.js';

const DBconn = new DataBaseConnection({
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'port': '3306',
    'database': 'http_website'
});

const show = {
    'connection': false,
    'req-ping': false,
    'disconnection': false
};

sockets.on('connect', (socket) => {
    show['connection'] ? console.log('> [%s] Socket with id %s has connected', colorString([1, 33, 42], ' Connection '), socket.id) : null;

    socket.on('req-ping', (callback) => {
        show['req-ping'] ? console.log('> [%s] Socket with id %s required his ping', colorString([3, 30, 43], ' Request '), socket.id) : null;
        callback();
    });

    socket.on('disconnect', (reason) => {
        show['disconnection'] ? console.log('> [%s] Socket with id %s disconnected because: %s', colorString([1, 33, 41], ' Disconnection '), socket.id, reason) : null;
    });

    socket.on('get-countries-names',
    /**
     * 
     * @param {Function} callback 
     */
    (callback) => getCountries('./server-dependences/countries-names/countries.json', callback))

    socket.on('req-login-exists',
    /**
     * 
     * @param {String} login 
     * @param {Function} callback 
     */
    (login, callback) => { 
        DBconn.connectQuery(SqlFormater.stringFormat("SELECT * FROM `users` WHERE `login` = '@0';", login))
        .then(({qError, qResult, fields}) => {
            if (qError) {
                SqlDebuguer.showSQLError(qError.message);
                callback(25);
            } else {
                callback(qResult.length == 0 ? 0: 1);
            };
        })
    });
    
    socket.on('do-register',
    /**
     * 
     * @param {any} user 
     * @param {Function} callback
     */
    (user, callback) => {
        const {can, reason} = new User(user).canRegister();
        if(can) { 
            DBconn.insertInto('users', user)
            .then(({qError}) => {
                if (qError) {
                    SqlDebuguer.showSQLError(qError.message);
                    callback(25);
                } else {
                    callback(1);
                }
            });
        } else {
            callback(0, reason);
        }
    });

    socket.on('do-login',
    /**
     * 
     * @param {String} login 
     * @param {String} password 
     * @param {Function} callback 
     */
    (login, password, callback) => {
        DBconn.connectQuery(SqlFormater.stringFormat("SELECT * FROM `users` WHERE `login` = '@0' AND `password` = '@1';", login, password))
        .then(({qError, qResult}) => {
            if (qError) {
                SqlDebuguer.showSQLError(qError.message);
                callback(25);
            } else {
                callback(qResult.length == 0 ? 0: 1);
            }
        });
    });
});
