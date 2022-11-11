# -*- ecoding: utf-8 -*-
# @ModuleName: db_session
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/9 17:57
import aiomysql as aiomysql


async def getSQLResult(sql,type='select'):
        pool = await aiomysql.create_pool(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='123456',
            db='demo',
            autocommit=True,
            cursorclass=aiomysql.cursors.DictCursor)

        if type == "select":
            async with pool.acquire() as conn:
                cur = await conn.cursor()
                try:
                    await cur.execute(sql)
                except:
                    raise Exception("sql语句异常-{}".format(sql))
                (r) = await cur.fetchall()
                pool.close()
                return r

        if type == "insert":
            async with pool.acquire() as conn:
                cur = await conn.cursor()
                try:
                    await cur.execute(sql)
                except:
                    raise Exception("sql语句异常-{}".format(sql))
                id = cur.lastrowid
                pool.close()
                return id


