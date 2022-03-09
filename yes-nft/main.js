const notifier = require('node-notifier')
const axios = require('axios')
const config = require('./config')

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        const code = response.data.code
        if ([1].includes(code)) {
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
    notifier.notify('yes-nft start')

    let data = await request({
        method: 'GET',
        url: 'https://shop.yes-nft.com/api/manghe/detail?manghe_id=' + config.manghe_id,
        headers: config.headers
    })

    data = await request({
        method: 'POST',
        url: 'https://shop.yes-nft.com/api/manghe/preCreate',
        data: JSON.stringify({
            buy_type: 'now',
            manghe_id: config.manghe_id,
            buy_num: 1
        }),
        headers: config.headers
    })

    const { id, price, sku_price } = data.data
    const sku_price_id = sku_price[0].id

    data = await request({
        method: 'POST',
        url: 'https://shop.yes-nft.com/addons/shopro/order/createOrder',
        data: JSON.stringify({
            address_id: 1,
            buy_type: 'alone',
            coupons_id: 0,
            from: 'goods',
            groupon_id: 0,
            invoice: {},
            order_type: 'goods',
            remark: '',
            goods_list: [
              {
                goods_id: id,
                goods_num: 1,
                goods_price: price,
                sku_price_id: sku_price_id
              }
            ],
            need_address: 0,
            is_diy: 0,
            is_manghe: 1
        }),
        headers: config.headers
    })

    const order_sn = data.data.order_sn

    await request({
        method: 'POST',
        url: 'https://shop.yes-nft.com//addons/shopro/pay/prepay',
        data: JSON.stringify({
            order_sn: order_sn,
            payment: 'alipay',
            recharge: 0
        }),
        headers: config.headers
    })

    notifier.notify('yes-nft end')
}

start()
