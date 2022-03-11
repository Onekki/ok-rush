const fs = require('fs')
const axios = require('axios')
const notifier = require('node-notifier')

const config = JSON.parse(fs.readFileSync('config.json'))

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        const { status } = response.data
        if ([200].includes(status)) {
            console.log(options.url)
            console.log(response.data)
            return response.data
        }
        console.log(JSON.stringify(response.data))
    } catch (e) { 
        console.log(e.message)
    }
    await sleep(1000)
    return await request(options)
}

const start = async () => {
    notifier.notify('start')

    let data = await request({
        method: 'GET',
        url: 'https://meta-art.genimous.com/api/goods/detail/' + config.pid + '?apiSource=client',
        headers: config.headers
    })

    const unique = data.data.products[0].unique
    
    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/cart/add',
        data: JSON.stringify({
            cartNum: 1,
            productId: config.pid,
            uniqueId: unique
        }),
        headers: config.headers
    })

    const cartId = data.data.cartId

    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/confirm',
        data: JSON.stringify({
            cartId: cartId
        }),
        headers: config.headers
    })

    const orderKey = data.data.orderKey

    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/computed/' + orderKey,
        data: JSON.stringify({
            couponId: '0'
        }),
        headers: config.headers
    })

    await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/create/' + orderKey,
        data: JSON.stringify({
            couponId: '0',
            from: 'weixinh5',
            isPay: '0',
            payType: 'weixin'
        }),
        headers: config.headers
    })

    notifier.notify('end')
}

start()