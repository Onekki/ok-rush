const axios = require('axios')
const config = require('./config')

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve()), ms)
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        console.log(response.data)
        const code = response.data.code
        if ([1].includes(code)) {
            return response.data
        }
    } catch (e) { 
        console.log(e.message)
    }
    await sleep(100)
    return await request(options)
}

const start = async () => {
    console.log('start')

    let data = await request({
        url: 'https://h5.stararknft.art/api/Box/detailed',
        method: 'POST',
        headers: config.headers,
        data: 'id=' + config.id + '&uid=' + config.uid
    })

    const { token_id, price} = data.data.info

    data = await request({
        url: 'https://h5.stararknft.art/api/Pay/before_buy_box',
        method: 'POST',
        headers: config.headers,
        data: 'id=' + config.id +'&uid=' + config.uid + '&token_id=' + token_id
    })

    data = await request({
        url: 'https://h5.stararknft.art/api/Pay/direct_buy_box',
        method: 'POST',
        headers: config.headers,
        data: 'id='+ config.id + 
                '&uid=' + config.uid + 
                '&money=' + price + 
                '&token_id='+ token_id + 
                '&password=' + config.password
    })
    
    console.log(data)
    
    console.log('end')
}

start()

