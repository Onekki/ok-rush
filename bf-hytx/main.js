const fs = require('fs')
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('config.json'))

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        const code = response.data.code
        if ([0].includes(code)) {
            console.log(response.data)
            return response.data
        }
        console.log(JSON.stringify(response.data))
    } catch (e) { 
        console.log(e.message)
    }
    await sleep(100)
    return await request(options)
}

const start = async () => {
    console.log('start')

    let data = await request({
        url: 'https://api.bf.hytx.club/v1/product/info?SpuId=' + config.pid,
        method: 'GET',
        headers: config.headers
    })

    const { spuId, buyLimit } = data.data
    config.headers["content-type"] = "application/json"

    data = await request({
        url: 'https://api.bf.hytx.club/v1/product/order/create',
        method: 'POST',
        headers: config.headers,
        data: JSON.stringify({
            SpuId: spuId,
            SpuNum: buyLimit
        })
    })

    // await request({
    //     url: 'https://api.bf.hytx.club/v1/product/order/pay',
    //     method: 'POST',
    //     headers: config.headers,
    //     data: JSON.stringify({
    //         payAmount: spuId,
    //         orderId: ,
    //         spuType: 
    //     })
    // })
    
    console.log('end')
}

start()
