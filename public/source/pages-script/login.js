import { requests } from '../connection.js';

const inputs = {
    login: document.getElementById('login'),
    password: document.getElementById('password'),
    confirmLogin: document.getElementById('logar'),
    goToCadastro: document.getElementById('cadastro')
};

const loginError = document.getElementById('loginError')

inputs.goToCadastro.addEventListener('click', (event) => {
    document.location.href = '../registrar';
});

inputs.login.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        inputs.password.focus({preventScroll: true})
    }
});

inputs.password.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        inputs.confirmLogin.focus({preventScroll: true})
    }
});

/**@type {import('../connection.js').LoginCB} */
const loginCB = (result, login, password) => {
    if(result === 0){
        loginError.innerText = 'login ou senha incorreto'
    } else if(result === 1) {
        document.cookie = `login=${login};password=${password}`
        document.location.href = '../home'
    } else {
        console.log('invalid result');
    }
}

const confirmLoginListeners = {
    /**
     * 
     * @param {MouseEvent} event 
     */
    mouse: (event) => {
        requests.login(inputs.login.value, inputs.password.value, loginCB)
    },

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    keyBoard: (event) => {
        if(event.key == 'Enter'){
            requests.login(inputs.login.value, inputs.password.value, loginCB)
        }
    }
}

inputs.confirmLogin.addEventListener('click', confirmLoginListeners.mouse);
inputs.confirmLogin.addEventListener('keydown', confirmLoginListeners.keyBoard);
