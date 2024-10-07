module.exports = function (hookPath, updateHandler) {
    return (req, res, next) => {
        if (req.method !== 'POST' || req.url !== hookPath) {
            if (typeof next === 'function') {
                return next()
            }
            res.statusCode = 403
            return res.end()
        }
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        console.log(body);

        req.on('end', () => {
            let update = {}
            try {
                update = JSON.parse(body)
            } catch (error) {
                res.writeHead(415)
                res.end()
                console.log(error);
                return
            }
            updateHandler(update, res)
                res.end()
        })
    }
}