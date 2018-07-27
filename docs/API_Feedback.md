# 报告提交及评价反馈页面 API文档

**前缀 /feedback**，以下文档中前缀省略

数据交流格式:

成功

```json
{
    "status": 200, // 状态码
    "data": {
        "data": "Some Data" // 数据
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
    "filename": "测试.doc", // 文件名
    "url": "http://someurl.com/somepath" // 文件URL()
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

Form表单，文件

#### Response

```json
{
    "status": 200,
    "data": {}
}
```



错误: 401, 400



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
{
    "status": 200,
    "data": {}
}
```



错误: 401, 404



## 评价反馈

### 