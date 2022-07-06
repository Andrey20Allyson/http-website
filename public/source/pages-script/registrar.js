import { requests } from "../connection.js"

const inputs = {
    name: document.getElementById('nameIn'),
    login: document.getElementById('loginIn'),
    password: document.getElementById('passIn'),
    confirmPW: document.getElementById('confPassIn'),
    bornDate: document.getElementById('dateBornIn'),
    nacionality: document.getElementById('selectNa'),
    gender: {
        chosed: undefined,
        MBtn: document.getElementById('maleBTN'),
        FBtn: document.getElementById('femaleBTN')
    },
    register: document.getElementById('register')
}

const SNT = document.getElementById('selectNaText')

inputs.gender.MBtn.addEventListener('click', (event) => {
    inputs.gender.chosed = 'M';
    inputs.gender.MBtn.value = 'x';
    inputs.gender.FBtn.value = '';
})

inputs.gender.FBtn.addEventListener('click', (event) => {
    inputs.gender.chosed = 'F';
    inputs.gender.MBtn.value = '';
    inputs.gender.FBtn.value = 'x';
})

/**@type {import("../connection.js").RegisterCB} */
const registerCB = (result, login, password) => {
    console.log({
        result: result,
        login: login,
        password: password
    });
}

const loadingFrames = ['.', '..', '...', '....']
var loading = true

const sleep = (ms) => {
    return new Promise((resolve) => {
        setInterval(resolve, ms)
    })
}

const StaticSNTText = SNT.innerText

const load = async () => {
    await sleep(1000)
    while(loading){
        for(let frame of loadingFrames){
            if(!loading) {
                SNT.innerText = StaticSNTText
                return
            }
            SNT.innerText = `${frame} [loading] ${StaticSNTText}`
            await sleep(500)
        }
    }
}; 

load();

requests.countriesNames((countries) => {
    loading = false
    SNT.innerText = StaticSNTText
    for(let [code, name] of countries){
        inputs.nacionality.appendChild(new Option(name, code))
    }

    const confirmRegisterListeners = {
        /**
         * 
         * @param {MouseEvent} event 
         */
        mouse: (event) => {
            if(inputs.password.value === inputs.confirmPW.value) {
                requests.register({
                    name: inputs.name.value,
                    login: inputs.login.value,
                    password: inputs.password.value,
                    "born-date": inputs.bornDate.value,
                    nacionality: inputs.nacionality.value,
                    gender: 'M',
                }, registerCB)
            }
        },

        /**
         * 
         * @param {KeyboardEvent} event 
         */
        keyBoard: (event) => {
            if(event.key == 'Enter' && inputs.password.value === inputs.confirmPW.value) {
                requests.register({
                    name: inputs.name.value,
                    login: inputs.login.value,
                    password: inputs.password.value,
                    "born-date": inputs.bornDate.value,
                    nacionality: inputs.nacionality.value,
                    gender: 'M',
                }, registerCB)
            }
        }
    }

    inputs.register.addEventListener('click', confirmRegisterListeners.mouse);
    inputs.register.addEventListener('keydown', confirmRegisterListeners.keyBoard);
});