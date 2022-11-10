from aiohttp import web
import aiohttp
from backend.db.db_session import getSQLResult

"""微服务地址,根据实际情况修改"""
SERVER = "localhost:8080"


"""路由转发函数"""
async def fetch(request,session, url):
    async with session.request(request.method,json=await request.json(),url=url) as response:
        return {"code": response.status,"data":await response.text()}


"""预处理函数"""
async def pre_handle(request):
    if request.content_type != "application/json":
        return {"code": "100010", "data": "暂不支持非json格式数据"}
    else:
        """获取微服务名称"""
        service_name = str(request.url).split('/')[3]
        """根据微服务名称查找微服务地址及端口"""
        micro_server_list = await getSQLResult(
            "select host from gateway_mapping where service_name='{}'".format(service_name))
        if micro_server_list:
            host = micro_server_list[0]['host']
            target_url = str(request.url).replace(SERVER + '/' + service_name, host)
            async with aiohttp.ClientSession() as session:
                response = await fetch(request, session, target_url)
            return response
        else:
            return {"code": "100011", "data": "未找到该微服务-{}".format(service_name)}


@web.middleware
async def before_request(request,handler):
    response =await pre_handle(request)
    return web.json_response({'data':response})


app = web.Application(middlewares=[before_request])


web.run_app(app)