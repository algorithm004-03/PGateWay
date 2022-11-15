# -*- ecoding: utf-8 -*-
# @ModuleName: db_session
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/9 17:57
from datetime import datetime
import aiomysql as aiomysql

from log.log import logger


async def get_pool():
    pool = None
    if pool is None:
        pool = await aiomysql.create_pool(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='123456',
            db='demo',
            autocommit=False,
            cursorclass=aiomysql.cursors.DictCursor)
    return pool


async def insert(table_name, insert_dict):
    pool = await get_pool()
    param = ''
    value = ''
    if (isinstance(insert_dict, dict)):
        for key in insert_dict.keys():
            param = param + key + ','
            value = value + "'"+insert_dict[key] + "'"+','
        param = param[:-1]
        value = value[:-1]
        sql = "insert into %s(%s) values(%s)" % (table_name, param, value)
        conn = await pool.acquire()
        cursor = await conn.cursor()
        try:
            await cursor.execute(sql)
            await conn.commit()
            id = cursor.lastrowid
            query_sql = "select id,service_name,host,date_format(create_time,'%Y-%m-%d %T') as create_time," \
                        "date_format(update_time,'%Y-%m-%d %T') as update_time from {} where id = {}".format(table_name, id)
            logger.debug(query_sql)
            await cursor.execute(query_sql)
            (result,) = await cursor.fetchall()
            return {"code":10000,"msg":"新增成功","data":result}
        except:
            await conn.rollback()
            return {"code": 10001, "msg": "数据库执行错误"}
        finally:
            await cursor.close()
            conn.close()


async def update(table_name,id,update_dict):
    pool = await get_pool()
    if (isinstance(update_dict, dict)):
        conn = await pool.acquire()
        cursor = await conn.cursor()
        query_sql = "select date_format(update_time,'%Y-%m-%d %T') as update_time from {} where id = {}".format(table_name, id)
        await cursor.execute(query_sql)
        (result,) = await cursor.fetchall()
        if result["update_time"] != update_dict["updated_at"]:
            return {"code": 10003, "msg": "当前数据不是最新的,请获取最新数据"}
        del update_dict["id"]
        del update_dict["updated_at"]
        update_content_sql = ''.join(["{}='{}',".format(val,update_dict[val]) for val in list(update_dict.keys())])[:-1]
        sql = "update {} set {} where id={}".format(table_name, update_content_sql,id)
        logger.debug(sql)
        try:
            await cursor.execute(sql)
            await conn.commit()
            query_sql = "select id,service_name,host,date_format(create_time,'%Y-%m-%d %T') as create_time," \
                        "date_format(update_time,'%Y-%m-%d %T') as update_time from {} where id = {}".format(table_name, id)
            await cursor.execute(query_sql)
            (result,) = await cursor.fetchall()
            return {"code": 10000, "msg": "修改成功", "data": result}
        except:
            await conn.rollback()
            return {"code": 10001, "msg": "数据库执行错误"}
        finally:
            await cursor.close()
            conn.close()


async def select(table_name,column_names,where_dict,offset=0,limit=10):
    pool = await get_pool()
    if (isinstance(column_names, list)) and (isinstance(where_dict,dict)):
        for index,item in enumerate(column_names):
            if column_names[index] == "create_time":
                column_names[index] = "date_format(create_time,'%Y-%m-%d %T') as create_time"
            if column_names[index] == "update_time":
                column_names[index] = "date_format(update_time,'%Y-%m-%d %T') as update_time"
        where_sql=""
        for k,v in where_dict.items():
            where_sql += "{} = '{}' and".format(k,v)
        where_sql = where_sql + " 1 = 1"
        column_names = (",").join(column_names)
        sql_data = "select {} from {} where {} and  delete_time is null limit {},{}".format(column_names,table_name,where_sql,offset,limit)
        sql_count = "select count(*) as count from {} where delete_time is null".format(table_name)
        conn = await pool.acquire()
        cursor = await conn.cursor()
        try:
            await cursor.execute(sql_data)
            logger.debug(sql_data)
            (r) = await cursor.fetchall()
            await cursor.execute(sql_count)
            result = await cursor.fetchall()
            total =result[0]["count"]
            await conn.commit()
            return {"code": 10000, "msg": "查询成功", "data": r,"total":total}
        except:
            await conn.rollback()
            return {"code": 10001, "msg": "数据库执行错误"}
        finally:
            await cursor.close()
            # conn.close()


async def delete(table_name,id):
    pool = await get_pool()
    now_time = datetime.now()
    sql = "update {} set delete_time = '{}' where id = {}".format(table_name,now_time, id)
    logger.debug(sql)
    conn = await pool.acquire()
    cursor = await conn.cursor()
    try:
        await cursor.execute(sql)
        await conn.commit()
        return {"code": 10000, "msg": "删除成功"}
    except:
        await conn.rollback()
        return {"code": 10001, "msg": "数据库执行错误"}
    finally:
        await cursor.close()
        conn.close()


