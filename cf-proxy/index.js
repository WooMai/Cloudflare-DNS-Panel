const httpProxy = require('http-proxy');
const process = require('process');

const port = process.argv[2] || 8080;

const proxy = httpProxy.createProxyServer({
    target: 'https://api.cloudflare.com/',
    secure: false
}).listen(port);

console.log(`Cloudflare API Proxy listening on 0.0.0.0:${port}`);

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    res.setHeader('Access-Control-Allow-Origin', req.headers['Origin'] || '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', req.headers['Access-Control-Request-Headers'] || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', 31536000);

    let dst;
    if (req.method === 'OPTIONS') {
        res.setHeader('X-Request-Type', 'CORS Preflight');
        res.end();
        dst = 'Answered Locally';
    } else {
        res.setHeader('X-Request-Type', 'Standard');
        dst = 'Cloudflare API';
    }

    proxyReq.setHeader('Host', 'api.cloudflare.com');
    proxyReq.setHeader('User-Agent', 'Cloudflare API Proxy');

    console.log(`[${(new Date).toISOString()}] ${req.method} ${req.url} -> ${dst}`);
});
