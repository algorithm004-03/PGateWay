# -*- ecoding: utf-8 -*-
# @ModuleName: tserServer
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/10 11:22
from flask import Flask
import json


app=Flask(__name__)


@app.route('/index',methods=["POST"])
def index():
    return json.dumps({"data":[{"a":1}]})


app.run(host="0.0.0.0",port=6666)
# a = [{"A":1},{"B":2}]
# for i in a:
    # print(i.keys(),i.values())
# def a():
#     try:
#         return 1
#     except:
#         pass
#     finally:
#         print(11)
#
# a()