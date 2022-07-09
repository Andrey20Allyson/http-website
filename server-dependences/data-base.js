import { createConnection } from 'mysql'
import { colorFormat } from './terminal-colors.js'

/**
 * @typedef {{qError: import('mysql').MysqlError, qResult: Object[], fields: import('mysql').FieldInfo[]}} QueryCBParams
 */

class SqlDebuguer {
    /**
     * 
     * @param {String} message 
     */
    static showSQLError(message) {
        message = colorFormat('> [%s] %s', { text: 'SQL Error', color: [3, 41, 41] }, { text: message, color: [1, 31, 40] })
        console.log(message);
    }
}

class SqlFormater {
    /**
     * uses @[argIndex] to format
     * @param {String} text 
     * @param  {...any} args 
     * @returns {String}
     */
    static stringFormat(text, ...args) {
        for(let i = 0; i < args.length; i++){
            text = text.replace(`@${i}`, args[i]);
        };
        return text
    };

    /**
     * 
     * @param {String} tableName 
     * @param {any} object 
     * @returns {String}
     */
    static objectToInsert(tableName, object) {
        var tableName = `\`${tableName}\``

        var columns = '('
        var values = '('

        for(let [key, value] of Object.entries(object)) {
            columns += `\`${key}\`,`
            values += `"${value}",`
        }

        columns = columns.slice(undefined, columns.length - 1) + ')'
        values = values.slice(undefined, values.length - 1) + ')'

        return `INSERT INTO ${tableName} ${columns} VALUES ${values};`
    }
}

class DataBaseConnection {
    /**
     * 
     * @param {import('mysql').ConnectionConfig} connectionUri
     */
    constructor(connectionUri) {
        /**@type {import('mysql').Connection} */
        this.connection = createConnection(connectionUri);
    }

    /**
     * 
     * @param {import('mysql').Query} query 
     * @returns {Promise<QueryCBParams>}
     */
    connectQuery(query) {
        return new Promise((resolve, reject) => {
            try{
                this.connection.query(query, (qError, qResult, fields) => resolve({qError, qResult, fields}))
            } catch (exeption) {
                console.warn(exeption)
                reject(exeption)
            }
        });
    }

    /**
     * 
     * @param {String} tableName 
     * @param {any} object
     * @returns {Promise<QueryCBParams>}
     */
    insertInto(tableName, object) {
        return new Promise(
            (resolve, reject) => {
                this.connectQuery(SqlFormater.objectToInsert(tableName, object))
                .then(resolve)
            }
        );
    }

    isInsertValid(tableName, object) {
        
    }
}

export { DataBaseConnection, SqlFormater, SqlDebuguer }