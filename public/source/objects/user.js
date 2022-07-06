class User{
    constructor(name, id){
        this.name = name
        this.id = id ? id: (() => {throw Error("UserError 001")})()
    }
}

export { User }