# 报告提交及评价反馈页面 API文档

**前缀 /feedback**，以下文档中前缀省略

数据交流格式:

成功

```json
{
    "status": 200,
    "data": {
        "data": "Some Data"
    }
}
```

或错误

```json
{
    "status": 401,
    "msg": "Unauthorized."
}
```



状态码一览

| 状态码 | 错误原因            |
| ------ | ------------------- |
| 200    | 无错误              |
| 400    | 提交数据格式有误    |
| 401    | 未登录/用户权限不足 |
| 404    | 未找到相关资源      |
| 500    | 服务器错误          |



**以下正常回复数据的部分只提供data字段**



## 报告部分

### GET /report/:student_id/:module_id

**获取用户**

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 学生(student_id符合)，教师&管理员(所有)



#### Request

None

#### Response

```json
{
    "file_id": "somefileid"
}
```



错误: 401, 404



### POST /report/:student_id/:module_id

****

**上传报告文件**

支持重复上传，会替换掉以前的文件

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 学生(student_id符合)，管理员(所有)



#### Request

Form表单，文件(id为upload)

#### Response

```json
{}
```



错误: 401, 400, 404



### DELETE /report/:student_id/:module_id

**删除报告文件**

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 学生(student_id符合)，教师&管理员(所有)



#### Request

None

#### Response

```json
{}
```



错误: 401, 404



## 评价反馈

### GET /judgement/:student_id/:module_id

**获得学生该模块的教师评价**

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 学生(student_id符合)，教师&管理员(所有)

#### Request

None

#### Response

```json
{
    "score": 59,
    "text": "Very good!!"
}
```



错误: 401, 404



### POST /judgement/:student_id/:module_id

**提交学生该模块的教师评价(已有情况下会被覆盖)**

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 教师(所有)



#### Request

```json
{
    "score": 59,
    "text": "Very good!!"
}
```

#### Response

```json
{}
```



错误: 400, 401, 404



### DELETE /judgement/:student_id/:module_id

**删除学生该模块的教师评价**

参数：

​	student_id: 学生ID

​	module_id: 模块ID

权限: 教师&管理员(所有)



#### Request

None

#### Response

```json
{}
```



错误: 400, 401, 404



# 数据表设计

## IS_Report

```json
{
    "student_id": "studentid",
    "module_id": "moduleid",
    "file_id": "fileid"
}
```

## IS_Feedback

```json
{
    "student_id": "studentid",
    "module_id": "moduleid",
    "score": 59,
    "text": "Very good!!"
}
```

