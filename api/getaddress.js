const axios = require('axios')
const config = require('../config')

async function getAddress({address}){
    const location = `https://maps.googleapis.com/maps/api/place/autocomplete/json?`
    let data = {}
    let response = {}

    try {
        response = await axios.get(location, {
            params:{
                input:address,
                key:config.key,
                language:"es",
                components:"country:co"
            }
        })
        
        data = response.data.predictions.map((x) =>{
            return {
                id:`${x.place_id}`,
                name: `${x.description}`
            }
        })

        return {
            status:true,
            data
        }

    } catch (error) {
        return {
            status:false,
        }
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    response = await getAddress({address: req.query.id})
    res.json(response)
}