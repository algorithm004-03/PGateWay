# -*- ecoding: utf-8 -*-
# @ModuleName: utils
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/16 13:19
from db.db_session import select
import json
import time
import asyncio

"""黑名单功能"""
async def ip_limit(ip,service_name):
    result =await select("gateway_mapping",["black_list"],{"service_name":service_name})
    if result["code"] == 10000:
        if ip in  json.dumps(result["data"]) :
            return {"code":10005,"msg":"您的访问已被限制"}
    return False


"""频次限制功能"""
INTERVAL = 1
limit_number_dict={}
async def init_limit_number_dict():
    global limit_number_dict,INTERVAL
    result =await select("gateway_mapping",["service_name","number"],{})
    if result["code"] == 10000 and result["data"]:
        for item in result["data"]:
            limit_number_dict[item["service_name"]] = {"number":item["number"],"list":[]}



def number_limit(service_name):
    global limit_number_dict, INTERVAL
    for i in range(limit_number_dict[service_name]["number"]):
        current_time = time.time()
        while len(limit_number_dict[service_name]["list"]):  # 每次请求到来，先清理过期的请求
            if current_time - limit_number_dict[service_name]["list"][0] > INTERVAL:
                limit_number_dict[service_name]["list"].pop(0)
            else:
                break
        if len(limit_number_dict[service_name]["list"]) < limit_number_dict[service_name]["number"]:  # 如果小于请求次数，则允许请求
            limit_number_dict[service_name]["list"].append(current_time)
        else:

            return {"code": 10006, "msg": "服务器繁忙,请求拒绝!"}
    return False

loop = asyncio.get_event_loop()
result = loop.run_until_complete(init_limit_number_dict())
loop.close()