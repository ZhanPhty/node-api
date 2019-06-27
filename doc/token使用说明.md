# token使用说明

* Version：V1.0.0
* 创建时间：2010-06-26

#### 1. 参数说明
| 参数名|数据类型|说明 |
|---|:---:|---|
| token | String | 接口调用凭据 |
| refreshToken | String | 续期token凭据 |
#### 2.接口调用凭据（token）

- 背景
JWT认证方案，无需服务器保存用户登录状态，减少服务器压力。因JWT自身特性，token一但发放在有效期内无法更改其状态，出于安全、用户体验考虑，token应设置一个较短的有效期，用户在使用过程token需自动续期。

- token使用说明

```
// 用户登录后获得token，保存至本地
{
   token: "eyJhbCJ9.eyJ1M30.4jCUwTFqhI", 
   refreshToken: "zQwNDE1ND.ydWUsIm.AzkZp49aY"
}

// 以axios为例，在request拦截器中添加headers
axios.interceptors.request.use(
  config => {
    config.headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
```

- refreshToken说明

```
// 当
```



