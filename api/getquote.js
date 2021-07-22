const axios = require('axios')
const config = require('../config')

async function getQuote({origin, destination}){

    const location = `https://maps.googleapis.com/maps/api/distancematrix/json?`
    let distance = 0
    let precio = 0

    try {

        const response = await axios.get(location, {
            params:{
                origins:`place_id:${origin}`,
                destinations:`place_id:${destination}`,
                key:config.key
            }
        })

        const precioBase = config.basePrice
        const distanciaBase = config.baseDistance

        distance = response.data.rows[0].elements[0].distance.value;

        if(distance < 1) distance = 1

        precio = (distance*precioBase) / distanciaBase

        if(precio < config.basePriceLimit){
            precio = config.basePriceLimit
        }

        return {
            status:true,
            data:{
                origin: response.data.origin_addresses[0],
                destination: response.data.destination_addresses[0],
                price:Math.round(precio)
            }
        }

    } catch (error) {
        return {
            status:false,
            error
        }
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.json(await getQuote({origin: req.query.origin, destination: req.query.destination}))
}