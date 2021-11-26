import ExcelJS from 'exceljs';
const { convert } = require('html-to-text');
import chalk from 'chalk';
import slugify from 'slugify';

export default async function main(array, cityName) {
    console.log(chalk.green("Ya estamos generando Excel"))
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('dptos');
    const arrAux = []

    const technicalKeysForHeader = array[0].technicals.map( val => {
        return {
            header: val.title,
            key: slugToKey(val.title)
        }
    });

    // Creamos las columnas
    worksheet.columns = [
        { header: 'Id', key: 'id' },
        { header: 'Enlace', key: 'url' },
        { header: 'Título', key: 'title' },
        { header: 'Precio', key: 'price' },
        { header: 'Descripción', key: 'description' },
        ...technicalKeysForHeader
    ];

    array.forEach(data => {
        let obj = new Object;
        obj.id = data.id;
        obj.url = data.url;
        obj.title = data.name;
        obj.price = data.price;
        obj.description = convert(data.description);
        data.technicals.forEach( ({title, value}) => {
            let titleSlug = slugToKey(title);
            obj[titleSlug] = value;
        })

        arrAux.push(obj);
    })
    worksheet.addRows(arrAux)

    workbook.xlsx.writeFile(`./exports/${cityName}.xlsx`).then(() => {
        console.log(chalk.green("Archivo creado correctamente!"))
    })
    .catch(err => {
        console.log(chalk.red(err.message))
    });
}

function slugToKey(val) {
    return slugify(val, { replacement: '_', trim: true, lower: true })
}