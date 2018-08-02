# 文件上传/下载页面 API文档

**前缀 /file**，以下文档中前缀省略

数据交流格式:

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
| 401    | 未登录/用户权限不足 |
| 404    | 未找到相关资源      |
| 500    | 服务器错误          |



**以下正常回复数据的部分只提供data字段**



## 文件上传/下载

### GET /

**获取全部已上传文件**

权限:  管理员



#### Request

None

#### Response

```json
[
    {
    	"name": "file.doc",
    	"file_id": "somefileid",
    	"uploader": "student:1"
    }
]
```

uploader:  \<身份\>:\<id\>



错误: 401



### POST /

上传文件

权限: 老师&管理员



#### Request

表单，文件(id为upload) 

#### Response

```json
{
    "file_id": "somefileid"
}
```



错误: 401



### GET /:file_id

**下载文件**

参数:

​	file_id: 文件ID

权限：所有已登录用户



#### Request

None

#### Response

下载文件



错误: 401, 404



### DELETE /:file_id

**删除文件**

参数:

​	file_id: 文件ID

权限：管理员



#### Request

None

#### Response

```json
{}
```



错误: 401, 404



# 数据库设计

```json
{
    "name": "filename.doc",
    "file_id": "somefileid",
	"uploader": "student:yyy"
}
```



文件保存位置：PATH + file_id