import { sockets } from "./server-dependences/http-server.js";
import { tcolor } from './server-dependences/terminal-colors.js';
import { DataBaseConnection, sqlFormater } from './server-dependences/data-base.js';
import { getCountries } from './server-dependences/countries-names/countries-names.js';

const DBconn = new DataBaseConnection({
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'port': '3306',
    'database': 'http_website'
});

const show = {
    'connection': true,
    'req-ping': false,
    'disconnection': true
};

const minCharsIn = {
    'name': 5,
    'login': 6,
    'password': 8,
    'born-date': 'XXXX-XX-XX'.length
}

sockets.on('connect', (socket) => {
    show['connection'] ? console.log('> [%s] Socket with id %s has connected', tcolor.colorString([1, 33, 42], ' Connection '), socket.id) : null;

    socket.on('req-ping', (callback) => {
        show['req-ping'] ? console.log('> [%s] Socket with id %s required his ping', tcolor.colorString([3, 30, 43], ' Request '), socket.id) : null;
        callback();
    });

    socket.on('disconnect', (reason) => {
        show['disconnection'] ? console.log('> [%s] Socket with id %s disconnected because: %s', tcolor.colorString([1, 33, 41], ' Disconnection '), socket.id, reason) : null;
    });

    socket.on('get-countries-names',
    /**
     * 
     * @param {Function} callback 
     */
    (callback) => {
        getCountries('./server-dependences/countries-names/countries.json', callback)
    })

    socket.on('req-login-exists',
    /**
     * 
     * @param {String} login 
     * @param {Function} callback 
     */
    (login, callback) => {
        console.log(login);
        console.log(sqlFormater.stringFormat("SELECT * FROM `users` WHERE `login` = '@0';", login))
        DBconn.connectQuery(
        sqlFormater.stringFormat("SELECT * FROM `users` WHERE `login` = '@0';", login),
        (qError, qResult, fields) => {
            if (qError) {
                callback(25);
                console.log(qError);
            } else {
                callback(qResult.length == 0 ? 0: 1);
            };
        });
    });

    socket.on('do-register',
    /**
     * 
     * @param {any} user 
     * @param {Function} callback
     */
    (user, callback) => {
        var canInsert = true
        var cantInsertReason = {attribute: '', msg: ''}

        for(let [key, value] of Object.entries(minCharsIn)){
            if(!user[key]){
                canInsert = false
                cantInsertReason = {
                    attribute: key, 
                    msg: 'não foi declarado'
                }
                break
            }
            if(user[key] < value){
                canInsert = false
                cantInsertReason = {
                    attribute: key,
                    msg: `precisa ter ${value} caracteres ou mais`
                }
                break
            }
        }

        if(canInsert){
            DBconn.insertInto('users', user,
                (qError, qResult, fields) => {
                    if (qError) {
                        callback(25, {})
                    } else {
                        callback(1, {})
                    }
                })
        } else {
            callback(0, cantInsertReason)
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
        DBconn.connectQuery(
            sqlFormater.stringFormat("SELECT * FROM `users` WHERE `login` = '@0' AND `password` = '@1';", login, password),
            (qError, qResult, fields) => {
                if (qError) {
                    callback(25)
                } else {
                    console.log(qResult)
                    callback(qResult.length == 0 ? 0: 1)
                }
            }
        );
    });
});
