const fs = require('fs');

const axios = require('axios');


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {

    }

    async ciudad( lugar = '' ) {

        try {
           
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: {
                    'access_token': process.env.MAPBOX_KEY,
                    'limit': 5,
                    'language': 'es'
                }
            });
            
            const resp = await instance.get();
            
            return resp.data.features.map( location => ({
                id: location.id,
                nombre: location.place_name,
                lng: location.center[0],
                lat: location.center[1]
            }))
            
        } catch (error) {
            return [];
        }
    }

    async climaLugar( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {
                    lat,
                    lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            })

            const clima = await instance.get();

            return {
                desc: clima.data.weather[0].description,
                min: clima.data.main.temp_min,
                max: clima.data.main.temp_max,
                temp: clima.data.main.temp
            };

        } catch (error) {
        
        }
    }

    agregarHistorial( lugar = '' ) {
        if ( !this.historial.includes( lugar )) {
            this.historial.unshift( lugar );
        }
        
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerHistorial() {
        if ( fs.existsSync( this.dbPath ) ) {
            this.historial = JSON.parse(fs.readFileSync( this.dbPath,'utf8' )).historial;
        }
    }
}

module.exports = Busquedas;