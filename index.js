require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    let opt;
    const busquedas = new Busquedas();

    do {
        busquedas.leerHistorial();
        
        opt = await inquirerMenu();

        let id;
        
        switch (opt) {

            case 1:
                const lugar = await leerInput('Escriba el nombre de la ciudad: ');
                const lugares = await busquedas.ciudad( lugar );
                id = await listarLugares( lugares );

                if ( id === 0 ) {
                    break;                    
                }                
                
                const lugarSel = lugares.find( l => l.id === id );

                const {nombre, lat, lng} = lugarSel;

                busquedas.agregarHistorial( nombre );
                
                console.log( '\nInformación de la ciudad:\n'.green );
                
                console.log( 'Ciudad: ', nombre );
                console.log( 'longitud: ', lng );
                console.log( 'latitud: ', lat );

                const clima = await busquedas.climaLugar( lat, lng );
                const {desc, min, max, temp} = clima;

                console.log( '\nInformación del clima de la ciudad:\n'.green );

                console.log( 'Descripción: ', desc );
                console.log( 'Temperatura: ', temp );
                console.log( 'Temperatura mínima: ', min );
                console.log( 'Temperatura máxima: ', max );


                break;

            case 2:
                console.log();
                busquedas.historial.forEach(( lugar, id ) => {
                    const idx = `${id + 1}.`.green;
                    console.log( idx, lugar );
                });
                break;
        
            default:
                break;
        }

        if ( opt !== 0 && id !== 0 ) {
            await pausa();
        }

    } while ( opt !== 0);
}

main();