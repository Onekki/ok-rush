const fs = require('fs')
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('config.json'))

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}

const request = async (options) => {
    try {
        const response = await axios.request(options)
        if (response.data.success) {
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

    let data = await request({
        method: "POST",
        url: "https://h5.ubanquan.cn/api/opactivity/client/theme/detail",
        headers: config.headers,
        data: JSON.stringify({
            themeKey: "DGHT",
            userId: config.userId
        })
    })
}


start()

