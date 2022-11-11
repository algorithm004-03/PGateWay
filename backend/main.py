from aiohttp import web
import aiohttp
from backend.db.db_session import getSQLResult
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
        micro_server_list = await getSQLResult(
            "select host from gateway_mapping where service_name='{}' and delete_time is null".format(service_name))
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
async def get_all(request):
    try:
        json_data = await request.json()
        offset,limit = json_data["offset"],json_data['limit']
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    data_sql = "select id,service_name,host,is_alive," \
               "date_format(create_time,'%Y-%m-%d %T') as create_time," \
               "date_format(update_time,'%Y-%m-%d %T') as update_time " \
               "from gateway_mapping where delete_time is null limit {},{}".format(offset,limit)
    data_list = await getSQLResult(data_sql)
    count_sql = "select count(*) as count from gateway_mapping where delete_time is null"
    count_result = await getSQLResult(count_sql)
    total = count_result[0]["count"]
    return web.json_response({'code':"10000","data":data_list,"total":total,"msg":"请求成功"})


@routes.post("/gateway/create")
async def get_all(request):
    try:
        json_data = await request.json()
        service_name,host = json_data["service_name"],json_data['host']
    except:
        return web.json_response({'code': "100200", 'msg':"请求参数错误"})
    data_sql = "insert into gateway_mapping(service_name,host) values('{}','{}')".format(service_name,host)
    result = await getSQLResult(data_sql,"insert")
    return web.json_response({'code':"10000","data":result,"msg":"请求成功"})


app.router.add_routes(routes)


for route in list(app.router.routes()):
    cors.add(route)


web.run_app(app)