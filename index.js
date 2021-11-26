import { generarArrayEnlaces, generarArrayDetalles, generarExcel } from "./functions/index.js";
const prompt = require('prompt-sync')();
import chalk from 'chalk';

const cities = [
    { dpto: "central", city: "lambare", name: "Lambaré" },
    { dpto: "central", city: "villa-elisa", name: "Villa Elisa" },
    { dpto: "asuncion", city: "asuncion", name: "Asunción" },
    { dpto: "central", city: "fernando-de-la-mora", name: "Fernando de la Mora" },
    { dpto: "central", city: "nemby", name: "Ñemby" },
    { dpto: "central", city: "san-lorenzo", name: "San Lorenzo" },
    { dpto: "central", city: "mariano-roque-alonso", name: "Mariano Roque Alonso" },
];

async function main() {
    // Toda la interacción con el usuario.
    console.log(chalk.green("¡Hola! Por favor selecciona la ciudad que quieras para exportar"));
    cities.forEach( (val, index) => {
        console.log(`${index+1} - ${val.name}`)
    })
    const index = prompt("Selecciona el número de la ciudad: ");
    if (!cities[index-1]) {
        return console.log(chalk.red("No se encuentra la ciudad seleccionada."))
    }
    let city = cities[index-1];

    // Acá empieza el bardo
    const arrEnlaces = await generarArrayEnlaces(city)
    if (arrEnlaces.length === 0) {
        return console.log(chalk.red("No hay propiedades en esta ciudad."))
    }
    
    const detallesPropiedades = await generarArrayDetalles(arrEnlaces)

    await generarExcel(detallesPropiedades, city.city)
}

main();