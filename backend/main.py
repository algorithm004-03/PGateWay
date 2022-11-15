from aiohttp import web
import aiohttp
from backend.db.db_session import select, insert, update, delete
import aiohttp_cors

"""微服务地址,根据实际情况修改"""
SERVER = "127.0.0.1:8080"


"""路由转发函数"""
async def fetch(request,session, url):
    async with session.request(request.method,json=await request.json(),url=url) as response:
        return {"code": response.status,"data":await response.text()}


"""预处理函数"""
async def pre_handle(service_name,request):
    if request.content_type != "application/json":
        return {"code": "100010", "data": "暂不支持非json格式数据"}
    else:
        """根据微服务名称查找微服务地址及端口"""
        micro_server_list,total = await select("gateway_mapping",["host"],{"service_name":service_name})
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
    service_name = str(request.url).split('/')[3]
    if service_name == "gateway":
         return await handler(request)
    else:
        response =await pre_handle(service_name,request)
        return web.json_response({'data':response})


app = web.Application(middlewares=[before_request])
# app = web.Application()

routes = web.RouteTableDef()

cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
})


@routes.post("/gateway/findAll")
async def gateway_query(request):
    print(111)
    try:
        json_data = await request.json()
        offset,limit = json_data["offset"],json_data['limit']
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    result =await select("gateway_mapping",["id","service_name","host","create_time","update_time"],{},offset,limit)
    return web.json_response(result)


@routes.post("/gateway/create")
async def gateway_create(request):
    try:
        dict_data = await request.json()
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    result = await insert("gateway_mapping",dict_data)
    return web.json_response(result)


@routes.post("/gateway/update")
async def gateway_update(request):
    try:
        dict_data = await request.json()
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    result = await update("gateway_mapping",dict_data["id"],dict_data)
    return web.json_response(result)


@routes.post("/gateway/delete")
async def gateway_delete(request):
    try:
        dict_data = await request.json()
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    result = await delete("gateway_mapping",dict_data["id"])
    return web.json_response(result)


app.router.add_routes(routes)


for route in list(app.router.routes()):
    cors.add(route)


web.run_app(app)