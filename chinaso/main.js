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
        if ([0].includes(status)) {
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
        method: 'POST',
        url: 'https://collection.chinaso.com/collection-app/homepage/product/detail',
        headers: config.headers,
        data: JSON.stringify({
            productId: config.pid
        })
    })

    const collectionSetId = data.data.collectionSetId

    await request({
        method: 'POST',
        url: 'https://collection.chinaso.com/collection-app/order/create',
        headers: config.headers,
        data: JSON.stringify({
            collectionSetId: collectionSetId,
            productId: config.pid,
            payMethod: "WXPAY"
        })
    })

    notifier.notify('end')
}

start()