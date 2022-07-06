const tcolor = {}

/**
 * 
 * @param {String} text 
 * @param  {...any} optionalParams 
 * @returns formated text
 */
tcolor.format = (text, ...optionalParams) => {
    var i = 0;
    for(param of optionalParams){
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
tcolor.colorString = (colors, text) => {
    var colorStr = '';
    for(let color of colors){
        colorStr += `\x1b[${color}m`;
    };

    return `${colorStr}${text}\x1b[0m`;
};

/**
 * 
 * @param {Number[]} colors 
 * @param {String} text 
 * @param  {...any} optionalParams 
 * @returns colored & formated text
 */
tcolor.colorFormat = (colors, text, ...optionalParams) => {
    return tcolor.colorString(colors, tcolor.format(text, ...optionalParams))
}

/**
 * 
 * @param {Number[]} colors 
 * @param {String} message 
 * @param  {...any} optionalParams 
 */
tcolor.log = (colors, message, ...optionalParams) => {
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

tcolor.show = () => {
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
                    text += ' | ' + tcolor.colorString([x, z, y], `[${x}, ${y}, ${z}]`);
            };
            console.log(text + ' |');
        };
        
        console.log(sep);

        for(let y = 40; y < 48; y++){
            let text = '';
            for(let x = 0; x < 9; x++){
                    text += ' | ' + tcolor.colorString([x, z, y], `[${x}, ${y}, ${z}]`);
            };
            console.log(text + ' |');
        };

        console.log(sep + '\n');
    };
};

export { tcolor }