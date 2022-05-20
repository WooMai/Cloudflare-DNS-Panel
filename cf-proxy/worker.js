/**
 * Cloudflare API Proxy
 *    Worker Edition
 */


async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        const response = new Response()
        response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
        response.headers.set('Access-Control-Allow-Methods', '*');
        response.headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*');
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set('Access-Control-Max-Age', '31536000')
        response.headers.set('Vary', 'Origin')
        response.headers.set('X-Request-Type', 'CORS Preflight')
        return response;
    }

    let url = new URL(request.url);
    url.host = 'api.cloudflare.com';
    url.scheme = 'https:';

    let response = await fetch(url.toString(), {
        body: request.body,
        method: request.method,
        headers: {
            accept: 'application/json',
            authorization: request.headers.get('authorization'),
            'user-agent': 'Cloudflare API Proxy Worker',
        },
    });

    // Recreate the response so you can modify the headers
    response = new Response(response.body, response);

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '31536000')
    response.headers.set('Vary', 'Origin')
    response.headers.set('X-Request-Type', 'Standard')

    return response;
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});