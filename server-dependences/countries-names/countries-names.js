import { readFile } from 'fs';

/**
 * 
 * @param {(countries: [String, String][]) => void} callback 
 */
const getCountries = (directory, callback) => {
    readFile(directory, 'utf-8', (err, data) => {
        if(err){
            console.warn(err.message);
            return;
        }
        callback(Object.entries(JSON.parse(data)))
    })
}

export { getCountries }