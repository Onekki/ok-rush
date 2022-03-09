const axios = require('axios')
const config = require('./config')

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve()), ms)
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        console.log(response.data)
        const { status } = response.data
        if ([200].includes(status)) {
            return response.data
        }
    } catch (e) { 
        console.log(e.message)
    }
    await sleep(1000)
    return await request(options)
}

const start = async () => {
    console.log('start')

    let data = await request({
        method: 'GET',
        url: 'https://meta-art.genimous.com/api/goods/detail/' + config.pid + '?apiSource=client',
        headers: config.headers
    })

    const unique = data.data.products[0].unique
    
    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/cart/add',
        data: {
            cartNum: 1,
            productId: config.pid,
            uniqueId: unique
        },
        headers: config.headers
    })

    const cartId = data.cartId

    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/confirm',
        data: {
            cartId: cartId
        },
        headers: config.headers
    })

    const orderKey = data.orderKey

    data = await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/computed/' + orderKey,
        data: {
            couponId: '0'
        },
        headers: config.headers
    })

    await request({
        method: 'POST',
        url: 'https://meta-art.genimous.com/api/order/create/' + orderKey,
        data: {
            couponId: '0',
            from: 'weixinh5',
            isPay: '0',
            payType: 'weixin'
        },
        headers: config.headers
    })

    console.log('end')
}

start()