from aiohttp import web
import aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def handle(request):
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, 'http://www.baidu.com')
        return html



@web.middleware
async def middleware1(request, handler):
    response =await handle(request)
    return web.json_response({"data":"111"})

app = web.Application(middlewares=[middleware1])



web.run_app(app)