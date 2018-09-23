# 课程 API文档

**前缀 /course**，以下文档中前缀省略

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



**以下示例返回值只显示data中的内容**



状态码一览

| 状态码 | 错误原因            |
| ------ | ------------------- |
| 200    | 无错误              |
| 400    | 提交数据格式有误    |
| 401    | 未登录/用户权限不足 |
| 404    | 未找到相关资源      |
| 500    | 服务器错误          |



## 数据库设计

collection: course

```json
{
    "_id": "课程ID(会由MongoDB自行创建)",
    "name": "课程名称",
    "description": "课程介绍",
    "teacher": ["老师ID1", "老师ID2"],
	"student": ["学生ID1", "学生ID2"]
}
```



## API设计

### GET /

**获取当前用户所拥有的课程**

权限: 学生&教师



#### Request

None

#### Response

```json
[
    {
    "_id": "课程ID",
    "name": "课程名称",
    "description": "课程介绍",
	}
]
```



### GET /all

**获取全部课程**

权限: 学生&教师

#### Request

None

#### Response

```json
[
    {
    "_id": "课程ID",
    "name": "课程名称",
    "description": "课程介绍",
    "teacher": ["老师ID1", "老师ID2"],
	}
]
```



### POST /

**创建课程**

权限: 教师

#### Request

```json
{
    "name": "课程名称",
    "description": "课程介绍",
    "teacher": ["老师ID1", "老师ID2"],
	"student": ["学生ID1", "学生ID2"]
}
```

**注:**以上四个四段均为可选字段，如果提交时没有则会自动补全。

#### Response

```json
{}
```



### DELETE /:id

**删除课程**

权限: 教师

id: 课程ID

#### Request

None

#### Response

```json
{}
```



### GET /:id/student

**获取该课程所有的学生**

权限: 教师&学生

id: 课程ID

#### Request

None

#### Response

```json
["学生ID1","学生ID2"]
```



### GET /:id/student

**获取该课程所有的老师**

***用法同上，不再叙述***



### POST /:id/student

**向该课程添加学生**

权限: 教师

id:课程ID

#### Request

```json
{
    "id": "学生ID"
}
```

#### Response

```json
{}
```



### POST /:id/teacher

**向该课程添加老师**

***用法同上，不再叙述***