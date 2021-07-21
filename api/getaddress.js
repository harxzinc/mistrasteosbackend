const axios = require('axios')
const config = require('../config')

async function getAddress({address}){
    const location = `https://maps.googleapis.com/maps/api/place/autocomplete/json?`
    try {
        const response = await axios.get(location, {
            params:{
                input:address,
                key:config.key,
                language:"es",
                components:"country:co"
            }
        })
        
        let addr = []
        const data = response.data.predictions.map((x) =>{

            addr = x.description.split(',')

            return {
                id:`${x.place_id}`,
                name: `${addr[0].trim()} (${addr[1].trim()}-${addr[2].trim()})`
            }
        })

        return {
            status:true,
            data
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
    res.json(await getAddress({address: req.query.id}))
}