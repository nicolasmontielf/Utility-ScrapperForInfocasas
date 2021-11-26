import scrapper from "scrape-it";
import chalk from 'chalk';

const host = "https://www.infocasas.com.py"

 /**
  * Scrapea cada web y retorna un json con los datos que necesitamos
  * @param string[] arrUrls
  * 
  * @return Object[]
  */
export default async function main(arrUrls) {
    console.log(chalk.green("Ahora estamos trayendo los datos de cada propiedad, esto puede demorar un poco..."))
    const arr = [];

    for await (let url of arrUrls) {
        if (checkIfIsUnidad(url)) {
            console.log("Esta es una unidad y no podemos procesarla, puede ir a mirarla usted mismo", host + url);
            continue;
        }

        try {
            let { data } = await scrapper(host + url, { datos: "#__NEXT_DATA__" })
            let parsedData = JSON.parse(data.datos);
            let id = parsedData.props.pageProps["__PROPERTY__ID__"];
            let datos = parsedData.props.pageProps.apolloState[`Property:${id}`];
            let obj = new Object;

            console.log("Mirando los datos de la propiedad con id: " + id)

            // Nutrimos el object
            obj.url = host + url;
            obj.id = id;
            obj.name = datos.title;
            obj.price = datos.price.amount;
            obj.description = datos.description;
            obj.technicals = datos.technicalSheet.map(val => {
                return {
                    title: val.text,
                    value: val.value
                }
            })
            obj.pictures = datos.images
                .map(val => val.__ref)
                .map(img => parsedData.props.pageProps.apolloState[img].image)
            
            obj.coord = {
                latitude: datos.latitude,
                longitude: datos.longitude,
            }
            
            arr.push(obj);
        } catch (error) {
            console.log("Ocurrió un error al traer data de una propiedad", error.message, host + url)
        }
    }
    return arr;
}

/**
 * Verifica si el enlace es para una unidad. En las unidades no se usa React y no tenemos ese json para ver todo.
 * @param string url
 * 
 * @return boolean
 */
function checkIfIsUnidad(url) {
    if ( (url.split("/"))[1].trim() == "unidades" ) {
        return true;
    }
    return false;
}