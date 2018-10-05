# 测验页面 API文档

~~这个我真的也看不懂写的是个什么玩意儿，就重构了~~



**前缀 /exam**，以下文档中前缀省略

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



## 数据表设计

**exam表**

```json
{
    "_id": ObjectId("测试ID"),
    "course_id": ObjectId("课程ID"),
    "title": "测试名称",
    "description": "测试介绍",
    "content": [{}],
    "timelimit": 300,
}
```



**score表**

```json
{
    "exam_id": ObjectId("测试ID"),
    "student_id": "学生ID",
    "start_time": 0,
    "has_done": true,
    "score": "分数"
}
```



**has_done标志是否已经交卷，如果没有交卷则分数不存在**



**前缀 /tutorial**，以下文档中前缀省略

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

| 状态码 | 错误原因                               |
| ------ | -------------------------------------- |
| 200    | 无错误                                 |
| 400    | 提交数据格式有误/到达时间/IP检查未通过 |
| 401    | 未登录/用户权限不足                    |
| 404    | 未找到相关资源                         |
| 500    | 服务器错误                             |



**关于content:**

```json
{
    "id": 0,
    "type": "类型",
    "text": "文本",
    "indents": 0,
    "options": [{
        "text": "选项文本",
        "choice": "A",
        "is_correct": true
    }],
    "src": "图片地址"
}
```

**is_correct: 是否为正确答案**



**类型如下**

| 类型 | 介绍                  |
| ---- | --------------------- |
| text | 纯文本(不存在options) |
| sc   | 单选(Single Choice)   |
| mc   | 多选(Multiple Choice) |
| img  | 图片                  |



## API设计

### GET /:course_id

**获得该课程下的所有练习**



#### Request

None



#### Response

```json
[
    {
        "_id": ObjectId("测试ID"),
        "title": "测试名称",
        "description": "测试介绍"
	}
]
```



### POST /:course_id

**上传该课程的一个练习**



#### Request

```json
{
    "course_id": "课程ID",
    "title": "测试名称",
    "content": [{}],
    "timelimit": 300
}
```



#### Response

```json
{}
```



### GET /:course_id/:exam_id

**获得该课程的更详细信息**



#### Request

None



#### Response

**学生**

```json
{
    "title": "测试名称",
    "description": "测试介绍",
    "timelimit": 300
}
```

**老师**

```json
{
    "title": "测试名称",
    "description": "测试介绍",
    "content": [{}],
    "timelimit": 300
}
```

***相比学生多出了content内容***



### POST /:course_id/:exam_id/start

**开始做题(包括中途重进)**



#### Request

None



#### Response

```json
{
    "timelimit": 300,
    "content": {[]}
}
```

***timelimit会返回剩余的时间***

***content不包括正确答案***



**对于该接口错误返回的特殊说明:**

因为测验存在时间限制，所以当测验超时时，会返回

```json
{
    "status": 400,
    "msg": "Time Limit Exceeded."
}
```

***因不知道需求，目前测验结束(访问相应API)了之后能够再次开始测验***





### POST /:course_id/:exam_id/commit

**交卷**



#### Request

```json
[
    {
        "id": 0,
        "answer": "A,B,C"
    }
]
```



#### Response

```json
{
	"score": "100"
}
```

**或者score以 *对题数量/总数量* 这样的形式**



**错误包含上方的TLE，以及Not Started(400)**



### GET /:course_id/:exam_id/score

**获取所有同学的成绩**



#### Request

None



#### Response

```json
[
    {
        "name": "学生名",
        "userid": "用户ID(学号)",
        "has_done": true,
        "score": "分数"
    }
]
```



**has_done: 是否交卷**