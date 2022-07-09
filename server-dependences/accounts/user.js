/**
 * @typedef {'AttrNotFound' | 'TooSmallValue' | 'Other'} Reason
 */

class CantInsertReason {

    /**@type */ attribute
    /**@type {Reason} */ reason
    
    /**
     * 
     * @param {String} attribute 
     * @param {Reason} reason 
     */
    constructor(attribute, reason) {
        this.attribute = attribute || '';
        this.reason = reason || 'Other';
    }
}

class User {
    static minLengthIn = {
        name: 5,
        login: 6,
        password: 8,
        nacionality: 1,
        gender: 1,
        bornDate: 'XXXX-XX-XX'.length
    }

    constructor({name, login, password, nacionality, gender, bornDate}) {
        this.name = name
        this.login = login
        this.password = password
        this.nacionality = nacionality
        this.gender = gender
        this.bornDate = bornDate
    }

    /**
     * returns true if this instance is able to be inserted in users table
     * @returns { {can: Boolean, reason?: CantInsertReason} }
     */
    canRegister() {
        for(let [key, value] of Object.entries(User.minLengthIn)){
            if(!this[key]){
                return {can: false, reason: new CantInsertReason(key, 'AttrNotFound')}
            }

            if(this[key] < value){
                return {can: false, reason: new CantInsertReason(key, 'TooSmallValue')}
            }
        }

        return {can: true}
    }
}

export { User }