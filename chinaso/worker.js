const { Worker } = require('worker_threads')

for (let i = 0; i < 10; i++) {
    const worker = new Worker('./main.js')
    worker.on('exit', code => {
        console.log('cp exit, code is ' + code)
    })
}