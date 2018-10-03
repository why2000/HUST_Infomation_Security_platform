# 教学(视频)页面 API文档

~~我真的实在是看不懂原来写的是个什么玩意儿，所以自己写吧~~



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

| 状态码 | 错误原因            |
| ------ | ------------------- |
| 200    | 无错误              |
| 400    | 提交数据格式有误    |
| 401    | 未登录/用户权限不足 |
| 404    | 未找到相关资源      |
| 500    | 服务器错误          |



## 数据表设计

```json
{
    "_id": ObjectID("教学ID"),
    "course_id": ObjectID("课程ID"),
    "title": "教学视频名",
    "video": "https://website.com/video.mp4",
    "description": "视频简介"
}
```



## API设计

### GET /

**跳转到 /index**



### GET /index

**主页**



### GET /:course_id

**获得课程下的教学列表**



#### Request

None



#### Response

```json
[
    {
        "_id": "教学ID",
        "title": "教学视频名",
    }
]
```



### POST /:course_id

**上传教学视频**



#### Request

```json
{
    "title": "教学视频名",
    "video": "https://website.com/video.mp4",
    "description": "视频简介"
}
```



#### Response

```json
{}
```





### GET /:course_id/:tutorial_id

**获得课程下的某个教学**



#### Request

None



#### Response

```json
{
    "title": "教学视频名",
    "video": "https://website.com/video.mp4",
    "description": "视频简介"
}
```





### DELETE /:course_id/:tutorial_id

**删除课程下的某个教学**



#### Request

None



#### Response

```json
{}
```





