/**
 * @typedef {'do-login' | 'do-register' | 'req-ping' | 'req-login-exists' | 'get-countries-names'} ServerEvents
 * @typedef {'M' | 'F'} Gender
 * @typedef {(ping:Number) => void} PingCB
 * @typedef {(countries: CountryList) => void} CountriesNamesCB
 * @typedef {(result:Number) => void} LoginExtistsCB
 * @typedef {(result:Number, login:String, password:String) => void} LoginCB
 * @typedef {(result:Number, login:String, password:String, cantInsertReason:{attribute:String, msg:String}) => void} RegisterCB
 * 
 * @typedef {{
 *  id: String;
 *  on(event: String, callback: Function): void;
 *  emit(event: ServerEvents, ...args: any[]): void;
 *  timeout(time: Number): Socket;
 *  disconnect(close: boolean): void;
 * }} Socket
 * 
 * @typedef {{
 * 'name': String;
 * 'login': String;
 * 'password': String;
 * 'nacionality': String;
 * 'gender': Gender;
 * 'born-date': String;
 * }} User
 * 
 * @typedef {Array<[String, String]>} CountryList
 */

const REQUEST_TIMEOUT = 5000

const REQUEST_ERRORS = {
    24: () => {
        alert('server error')
    },
    25: () => {
        alert('db error')
    },
    26: () => {
        alert('Esse login já foi registrado')
    }
}

/**
 * 
 * @returns {Socket}
 */
const connect = () => {
    return io()
}

const requests = {

    /**
     * 
     * @param {(ping: Number) => Number} callback
     */
    ping(callback){
        const now = new Date().getTime()
        const socket = connect()

        socket.timeout(1000).emit('req-ping', (err) => {
            try{
                if(err){
                    callback('+999ms')
                } else {
                    let ping = `${Math.trunc((new Date().getTime() - now)/2)}ms`;
                    callback(ping)
                }
            } finally {
                socket.disconnect(true)
            }
        })
    },

    /**
     * 
     * @param {CountriesNamesCB} callback 
     */
    countriesNames(callback){
        const socket = connect()

        socket.timeout(REQUEST_TIMEOUT).emit("get-countries-names",
        (RequestError, countries) => {
            try {
                if(RequestError){
                    REQUEST_ERRORS[24]()
                } else {
                    callback(countries)
                }
            } finally {
                socket.disconnect(true)
            }
        })
    },

    /**
     * 
     * @param {String} login
     * @param {LoginExtistsCB} callback 
     */
    loginExtists(login, callback){
        const socket = connect()

        socket.timeout(REQUEST_TIMEOUT).emit('req-login-exists', login, 
        (RequestError, result, cantInsertReason) => {
            try{
                if(RequestError) {
                    REQUEST_ERRORS[24]()
                } else if(REQUEST_ERRORS[result]) {
                    REQUEST_ERRORS[result]()
                } else {
                    callback(result, cantInsertReason, login, password)
                }
            } finally {
                socket.disconnect(true)
            }
        });
    },

    /**
     * 
     * @param {User} user 
     * @param {RegisterCB} callback
     */
    register(user, callback){
        const socket = connect()

        socket.timeout(REQUEST_TIMEOUT).emit('do-register', user, (RequestError, result, cantInsertReason) => {
            try{
                if(RequestError) {
                    REQUEST_ERRORS[24]()
                } else if(result === 25){
                    //REQUEST_ERRORS[26]()
                } else if(REQUEST_ERRORS[result]) {
                    REQUEST_ERRORS[result]()
                } else {
                    callback(result, user.login, user.password, cantInsertReason)
                }
            } finally {
                socket.disconnect(true)
            }
        })
    },

    /**
     * 
     * @param {String} login
     * @param {String} password
     * @param {LoginCB} callback
     */
    login(login, password, callback){
        const socket = connect()
        
        socket.timeout(REQUEST_TIMEOUT).emit('do-login', login, password, 
        (RequestError, result) => {
            try{
                if(RequestError) {
                    REQUEST_ERRORS[24]()
                } else if(REQUEST_ERRORS[result]) {
                    REQUEST_ERRORS[result]()
                } else {
                    callback(result, login, password)
                }
            } finally {
                socket.disconnect(true)
            }
        })
    }
}

export { requests };