import scrapper from "scrape-it";
import chalk from 'chalk';

const url = "https://www.infocasas.com.py/alquiler/departamentos"
const filters = "1-dormitorio-y-2-dormitorios/con-garaje";
const superArray = [];

export default async function main(city) {
    console.log(chalk.green("Estamos buscando todas las propiedades en " + city.name))
    let page = 1;
    
    while (true) {
        console.log("Mirando la página ", page);
        let generatedUrl = `${url}/${city.dpto}/${city.city}/${filters}/pagina${page}`
        let { data } = await scrapper(generatedUrl, {
            properties: {
                listItem: ".ant-card.property-card",
                data: {
                    enlace: {
                        selector: "a.containerLink",
                        attr: "href"
                    },
                }
            },
        });

        if (!data.properties || data.properties.length == 0) break;
        
        data.properties.forEach(val => {
            superArray.push(val.enlace);
        })

        page = page + 1;
    }
    
    return superArray;
}