# Sniper YOLO Backend API 文档

## 统一响应格式

所有API响应都遵循以下统一格式：

```json
{
  "code": "000000",        // 响应代码：成功="000000"，错误="A00xxx"
  "statusCode": 200,       // HTTP状态码
  "msg": "Success",        // 响应消息
  "data": null,           // 响应数据，错误时为null
  "timestamp": "2025-01-02 14:11:30.123" // 服务器时间戳
}
```

## 响应代码说明

### 成功响应
- **000000**: 请求成功

### 错误响应
- **C00400**: 请求参数错误 (400)
- **C00401**: 未授权访问 (401)
- **C00403**: 权限不足 (403)
- **C00404**: 资源未找到 (404)
- **C00422**: 请求参数验证失败 (422)
- **B00500**: 服务器内部错误 (500)
- **Z09999**: 未知错误 (999)

## 用户管理接口

### 1. 用户注册
**POST** `/users/`

创建新用户账户。

**请求参数**:
```json
{
  "email": "user@example.com",
  "username": "exampleuser",
  "password": "securepassword123"
}
```

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "用户创建成功",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "exampleuser",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 2. 获取当前用户信息
**GET** `/users/me`

获取当前登录用户的详细信息。

**认证**: 需要Bearer Token

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取用户信息成功",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "exampleuser",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 3. 获取用户列表
**GET** `/users/`

获取用户列表（支持分页）。

**查询参数**:
- `skip` (可选): 跳过记录数，默认0
- `limit` (可选): 返回记录数，默认100

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取用户列表成功",
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user1@example.com",
        "username": "user1",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00"
      },
      {
        "id": 2,
        "email": "user2@example.com",
        "username": "user2",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00"
      }
    ],
    "total": 2,
    "skip": 0,
    "limit": 100
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 4. 获取指定用户
**GET** `/users/{user_id}`

根据ID获取用户信息。

**路径参数**:
- `user_id`: 用户ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取用户信息成功",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "exampleuser",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 5. 更新用户信息
**PUT** `/users/{user_id}`

更新用户信息。

**认证**: 需要Bearer Token

**请求参数**:
```json
{
  "email": "newemail@example.com",
  "username": "newusername",
  "password": "newpassword123"
}
```

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "用户信息更新成功",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "username": "newusername",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T12:00:00"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 6. 删除用户
**DELETE** `/users/{user_id}`

删除用户账户。

**认证**: 需要Bearer Token

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "用户删除成功",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 物品管理接口

### 1. 创建物品
**POST** `/items/`

创建新物品。

**认证**: 需要Bearer Token

**请求参数**:
```json
{
  "title": "示例物品",
  "description": "这是一个示例物品的描述",
  "price": 99.99,
  "is_available": true
}
```

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "物品创建成功",
  "data": {
    "id": 1,
    "title": "示例物品",
    "description": "这是一个示例物品的描述",
    "price": 99.99,
    "is_available": true,
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 2. 获取物品列表
**GET** `/items/`

获取物品列表（支持分页）。

**查询参数**:
- `skip` (可选): 跳过记录数，默认0
- `limit` (可选): 返回记录数，默认100

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取物品列表成功",
  "data": {
    "items": [
      {
        "id": 1,
        "title": "物品1",
        "description": "描述1",
        "price": 99.99,
        "is_available": true,
        "owner_id": 1,
        "created_at": "2024-01-01T00:00:00"
      }
    ],
    "total": 1,
    "skip": 0,
    "limit": 100
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 3. 获取指定物品
**GET** `/items/{item_id}`

根据ID获取物品信息。

**路径参数**:
- `item_id`: 物品ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取物品信息成功",
  "data": {
    "id": 1,
    "title": "示例物品",
    "description": "物品描述",
    "price": 99.99,
    "is_available": true,
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 4. 更新物品信息
**PUT** `/items/{item_id}`

更新物品信息（只能更新自己的物品）。

**认证**: 需要Bearer Token

**请求参数**:
```json
{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "price": 149.99,
  "is_available": false
}
```

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "物品信息更新成功",
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "description": "更新后的描述",
    "price": 149.99,
    "is_available": false,
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T12:00:00"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 5. 删除物品
**DELETE** `/items/{item_id}`

删除物品（只能删除自己的物品）。

**认证**: 需要Bearer Token

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "物品删除成功",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 系统接口

### 1. 健康检查
**GET** `/health`

检查系统健康状态。

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "服务健康",
  "data": {
    "status": "healthy",
    "service": "Sniper YOLO Backend",
    "version": "1.0.0"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 2. 根路径
**GET** `/`

获取欢迎信息。

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "服务运行正常",
  "data": {
    "message": "Welcome to Sniper YOLO Backend",
    "version": "1.0.0",
    "docs": "/api/v1/docs"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 错误响应示例

### 404 错误
```json
{
  "code": "A00004",
  "statusCode": 404,
  "msg": "用户不存在",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 400 错误
```json
{
  "code": "A00001",
  "statusCode": 400,
  "msg": "请求参数错误",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 422 验证错误
```json
{
  "code": "A00007",
  "statusCode": 422,
  "msg": "请求参数验证失败",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "value is not a valid email address",
        "type": "value_error.email"
      }
    ]
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 测试示例

### 使用 curl 测试

#### 注册用户
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123"
  }'
```

#### 获取用户列表
```bash
curl -X GET "http://localhost:8000/api/v1/users/"
```

#### 创建物品
```bash
curl -X POST "http://localhost:8000/api/v1/items/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "测试物品",
    "description": "这是一个测试物品",
    "price": 29.99,
    "is_available": true
  }'
```

### 使用 Python 测试
```python
import requests

# 注册用户
response = requests.post(
    "http://localhost:8000/api/v1/users/",
    json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass123"
    }
)
print(response.json())
```

## 更新日志

### v1.1.0
- 统一响应格式
- 全局异常处理
- 标准化错误代码
- 时间戳格式统一

### v1.0.0
- 初始版本发布
- 用户管理功能
- 物品管理功能
- 基础认证系统