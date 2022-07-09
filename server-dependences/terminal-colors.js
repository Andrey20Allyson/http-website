/**
 * 
 * @param {String} text 
 * @param  {...any} optionalParams 
 * @returns formated text
 */
function format(text, ...optionalParams) {
    var i = 0;
    for(let param of optionalParams){
        text = text.replace(`%${i}`, param);
        i++;
    };
    return text;
};

/**
 * 
 * @param {Number[]} colors 
 * @param {String} message 
 * @param  {...any} optionalParams 
 * @returns colored text
 */
function colorString(colors, text) {
    var colorStr = '';
    for(let color of colors){
        colorStr += `\x1b[${color}m`;
    };

    return `${colorStr}${text}${colors.length > 0 ? '\x1b[0m': ''}`;
};

/**
 * 
 * @param {String} text 
 * @param  {...{text: String; color?: Number[]}} optionalParams 
 * @returns colored & formated text
 */
function colorFormat(text, ...optionalParams) {
    for(let param of optionalParams) {
        text = text.replace(`%s`, colorString(param.color, param.text))
    }
    return text
}

/**
 * 
 * @param {Number[]} colors 
 * @param {String} message 
 * @param  {...any} optionalParams 
 */
function colorLog(colors, message, ...optionalParams) {
    var finalMessage = message;
    for(let i = 0; i < optionalParams.length; i++){
        finalMessage = finalMessage.replace(`%${i}`, optionalParams[i]);
    };

    var colorStr = '';
    for(let color of colors){
        colorStr += `\x1b[${color}m`;
    };

    console.log(`${colorStr}${finalMessage}\x1b[0m`);
};

function show() {
    for(let z = 40; z < 48; z++){
        var sep = ' ';
        for(let i = 0; i < 9; i++){
            sep += '+';
            for(let j = 0; j < 13; j++){
                sep += '-';
            };
        };
        sep += '+';

        console.log(sep);

        for(let y = 30; y < 38; y++){
            let text = '';
            for(let x = 0; x < 9; x++){
                    text += ' | ' + colorString([x, z, y], `[${x}, ${y}, ${z}]`);
            };
            console.log(text + ' |');
        };
        
        console.log(sep);

        for(let y = 40; y < 48; y++){
            let text = '';
            for(let x = 0; x < 9; x++){
                    text += ' | ' + colorString([x, z, y], `[${x}, ${y}, ${z}]`);
            };
            console.log(text + ' |');
        };

        console.log(sep + '\n');
    };
};


export { colorFormat, colorLog, colorString, format, show }