import { createConnection } from 'mysql'

/**
 * @typedef {(qError: Error, qResult: Object[], fields: import('mysql').FieldInfo[]) => void} queryCallback
 */

const sqlFormater = {}

/**
 * uses @[argIndex] to format
 * @param {String} text 
 * @param  {...any} args 
 * @returns {String}
 */
sqlFormater.stringFormat = (text, ...args) => {
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
sqlFormater.objectToInsert = (tableName, object) => {
    var tableName = '`' + tableName + '`'

    var columns = '('
    var values = '('

    for(let [key, value] of Object.entries(object)){
        columns += '`' + key + '`,'
        values += `"${value}",`
    }

    columns = columns.slice(undefined, columns.length - 1) + ')'
    values = values.slice(undefined, values.length - 1) + ')'

    return `INSERT INTO ${tableName} ${columns} VALUES ${values};`
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
     * @param {queryCallback} callback 
     */
    connectQuery(query, callback) {
        this.connection.connect((conError) => {
                try {
                    this.connection.query(query, callback);
                } catch (exeption) {
                    console.warn(exeption);
                }
            });
    }

    /**
     * 
     * @param {String} tableName 
     * @param {any} object 
     * @param {queryCallback} callback 
     */
    insertInto(tableName, object, callback) {
        this.connectQuery(sqlFormater.objectToInsert(tableName, object), callback)
    }

    isInsertValid(tableName, object) {
        
    }
}

export { DataBaseConnection, sqlFormater }