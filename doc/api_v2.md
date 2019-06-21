# 个人博客前-后端通讯接口

* Version：V1.0.0
* 创建时间：2010-06-21
* 测试用户：test  111111

# 目录索引

# 签名说明

### api请求说明
1. 使用restful风格
2. 接口请求必须额外添加参数，必填字段：auth_key（api授权key），timestamp（时间戳），token（参数签名），下面会介绍token生成规则和方法
3. 请求的header里需要带上参数：sessionKey（用户登录后服务端返回的JsonWebToken形式的token，有效期暂定一个月，token中包含用户的user_id，客户端保存到本地，每次请求时放入header的`access-token`参数中。用户退出时清除sessionKey）

### Token生成说明
#### 1. 请求API必须参数
| 参数名|数据类型|说明 |
|---|:---:|---|
| token | String | 接口调用凭据 |
| auth_key | String | 授权码校验key |
| timestamp | Number | 请求时间戳，UTC时间1970年1月1日 00:00:00以来的毫秒数 |
#### 2.接口调用凭据（token）生成算法

- 算法
将除token和auth_key外其他参数的值以参数名的字典顺序排序后拼接为字符串，再在字符串尾部拼接上auth_secret后做md5计算（32位）

- 详细说明

```
//申请到的授权码
{
   auth_key: "fwCWYMqmRINlRtMp", 
   auth_secret: "G7qMjMTRYkG7tuc9zujGvkVImW4WJ5kh"
}
//请求参数
requestData = {
  timestamp: 1529379565395,
  type: "login",
  mobile: "18701086068",
  auth_key: "fwCWYMqmRINlRtMp"
}
//将authKey外其他参数以参数名的字典顺序排序
'mobile', 'timestamp', 'type'
//以排序后的参数名的顺序将对应参数值拼接为字符串，并将auth_secret拼接到尾部，然后计算md5值

//拼接字符串
str = requestData.mobile + requestData.timestamp + requestData.type + auth_secret;
//即 str = "18701086068" + "1529379565395" + "login" + "G7qMjMTRYkG7tuc9zujGvkVImW4WJ5kh";
//计算md5值
token = md5(str) // token = "e47faedcccab34f2f91ddba207dad5f8"

//最终发出请求的参数为 
{
  timestamp: 1529379565395,
  type: "login",
  mobile: "18701086068",
  auth_key: "fwCWYMqmRINlRtMp",
  token:"c5115fc1c723bfa01f30307ec3a385dc"
}
```


# 其他说明

在本版本中，对数据请求`状态码`、`参数`等

### 公共参数说明
- `apiServer` - 表示WebApi部署的服务器地址，具体值是：域名或IP+端口;

### 状态码说明
接口返回`code`码与HTTP状态码一致。HTTP状态即接口服务器响应状态，各状态与 RFC2616 标准规定状态一致，常用状态如下：

- `200` - 正常    
- `201` - 重复提交   
- `301` - 永久重定向   
- `302` - 临时重定向   
- `400` - 请求错误、参数不匹配    
- `401` - 未认证、认证失败    
- `402` - 未授权、授权过期    
- `403` - 禁止访问    
- `404` - 请求资源不存在    
- `500` - 系统错误   
- `504` - 请求超时  
- `511` - 表示header缺失参数token
- `512` - 表示缺少auth_key
- `513` - 表示api接口参数验证token过期
- `514` - 表示api接口参数token验证失败
- `520` - jsonwebtoken生成失败
- `521` - jsonwebtoken验证失败


### 服务端返回数据结构

一般会包含主要的几个字段

- `code` {Number} - 请求状态码，200请求正常，数据返回正常
- `msg` {String}，可选 - 请求返回的消息，与`code`搭配使用，如`code`不是`200`，`msg`字段会描述问题原因
- `errors` {Any}，可选 - 错误信息，出错时存在
- `data` {Json} - 请求返回的数据

如：
```
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eb9120d72e48ed67c225f535bc27f9c51529379915929"
  }
}
```


# 1. 基本接口

## 1.1 公用部分
### 1.1.1 图片验证码
```
获取图片验证码，返回svg文件
```
**接口方式** HTTP    
**HTTP方法** GET    
**URI路径** '/blogapi/service/captcha'      
**参数**    

| 参数名|数据类型|必须|默认|说明 |
|---|:---:|:---:|:---:|---|
| width | Number | 否 | 120 | 图片宽度 |
| height | Number | 否 | 44 | 图片高度 |

**返回值**

| 参数名|数据类型|说明 |
|---|:---:|---|
| data | Image | 返回svg图片（html标签显示）  |


## 1.2 用户相关
### 1.2.1 用户注册
```
普通用户注册，验证码、用户名验证相关查看（1.1 公用部分）
```
**接口方式** HTTP    
**HTTP方法** POST    
**URI路径** '/blogapi/reg'      
**参数**    

| 参数名|数据类型|必须|默认|说明 |
|---|:---:|:---:|:---:|---|
| account | String | 是 | | 用户名 |
| password | String | 是 | | 密码(需要md5加密) |
| email | String | 是 | | 注册邮箱(未认证状态) |
| nick | String | 否 | '新用户-****' | 密码(需要md5加密) |
| captcha | String | 是 | | 图形验证码 |

**返回值**

| 参数名|数据类型|说明 |
|---|:---:|---|
| code | Number | 状态码 |
| msg | String | 提示信息 |
| data | JSON | 用户信息 |

**返回参数data说明**

| 参数名|数据类型|说明 |
|---|:---:|---|
| account | String | 注册的用户名 |
| email | String | 注册的邮箱 |
| emailVerified | Boolean | 邮箱认证状态 |
| status | String | 用户状态：pending: 未认证; normal: 正常; reject: 未通过认证; freeze: 冻结 |
| nick | String | 用户昵称 |
| created | Date | 注册时间戳（毫秒） |
| level | Number | 用户等级 |

```
{
    account: 'test',
    email: '468768678@qq.com',
    emailVerified: false,
    status: 'pending',
    nick: '小灰',
    created: 1561083720816,
    type: 'client',
    level: 0
}
```

### 1.2.2 登录
```
用户登录，使用jwt加密方式
```
**接口方式** HTTP    
**HTTP方法** GET    
**URI路径** '/admin/logout'      
**参数**    

| 参数名|数据类型|必须|默认|说明 |
|---|:---:|:---:|:---:|---|
|  |  |  | |  |

**返回值**

| 参数名|数据类型|说明 |
|---|:---:|---|
| code | Number | 状态码 |
| msg | String | 提示信息 |


# 2. 用户管理




