const { Worker } = require('worker_threads')

const workers = []
for (let i = 0; i < 10; i++) {
    const worker = new Worker('./main.js')
    workers.push(worker)
    worker.on('exit', code => {
        console.log('worker-' + i + ' exit, code is ' + code)
        workers.pop(worker)
        workers.forEach((worker) => {
            worker.terminate()
        })
    })
}