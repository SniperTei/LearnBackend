# YOLO Backend API Documentation

## 通用响应格式

所有API响应都遵循以下格式：

```json
{
  "code": "000000",        // 响应代码：成功="000000"，错误="A00xxx"
  "statusCode": 200,       // HTTP状态码
  "msg": "Success",        // 响应消息
  "data": null,           // 响应数据，错误时为null
  "timestamp": "2025-01-02 14:11:30.123" // 服务器时间戳
}
```

### 错误代码说明
- A00400: 请求参数错误
- A00401: 未授权
- A00403: 禁止访问
- A00404: 资源未找到
- A00500: 服务器内部错误
- A00502: 网关错误
- A00503: 服务不可用
- A00504: 网关超时

## 用户认证 API

### 1. 用户注册

**请求**
- 方法: `POST`
- 路径: `/api/v1/users/register`
- Content-Type: `application/json`

**请求体**
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com",
  "gender": "male",
  "mobile": "13800000001",
  "birthDate": "1990-01-01"
}
```

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "User registered successfully",
  "data": {
    "username": "testuser",
    "email": "test@example.com"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 2. 用户登录

**请求**
- 方法: `POST`
- 路径: `/api/v1/users/login`
- Content-Type: `application/json`

**请求体**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "username": "testuser",
      "email": "test@example.com",
      "isAdmin": false,
      "lastLoginAt": "2025-01-02T06:11:30.123Z"
    },
    "menus": [
      {
        "title": "Dashboard",
        "code": "dashboard",
        "path": "/dashboard",
        "icon": "dashboard",
        "children": []
      }
    ]
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

**错误响应示例**
- 用户名或密码错误
```json
{
  "code": "A00401",
  "statusCode": 401,
  "msg": "Invalid username or password",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```
- 缺少用户名或密码
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "Username and password are required",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 3. 获取用户资料

**请求**
- 方法: `GET`
- 路径: `/api/v1/users/profile`
- Headers: 
  - Authorization: Bearer {token}

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "username": "testuser",
    "email": "test@example.com",
    "gender": "male",
    "birthDate": "1990-01-01",
    "mobile": "13800000001",
    "avatarUrl": "default-avatar.png",
    "lastLoginAt": "2025-01-02T06:11:30.123Z"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 4. 更新用户资料

**请求**
- 方法: `PUT`
- 路径: `/api/v1/users/profile`
- Headers: 
  - Authorization: Bearer {token}
- Content-Type: `application/json`

**请求体**
```json
{
  "email": "newemail@example.com",
  "gender": "female",
  "birthDate": "1991-01-01",
  "mobile": "13800000002",
  "avatarUrl": "new-avatar.png"
}
```

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Profile updated successfully",
  "data": {
    "username": "testuser",
    "email": "newemail@example.com",
    "gender": "female",
    "birthDate": "1991-01-01",
    "mobile": "13800000002",
    "avatarUrl": "new-avatar.png"
  },
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 5. 删除用户（仅管理员）

**请求**
- 方法: `DELETE`
- 路径: `/api/v1/users/:id`
- Headers: 
  - Authorization: Bearer {token}

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "User deleted successfully",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 饮品管理 API

### 1. 创建饮品记录

**请求**
- 方法: `POST`
- 路径: `/api/v1/drinks/create`
- Headers: 
  - Authorization: Bearer {token}
- Content-Type: `application/json`

**请求体**
```json
{
  "drinkName": "青岛啤酒",
  "alcoholType": "啤酒",
  "unit": "瓶",
  "drinkTime": "2025-01-04T14:00:00Z",
  "reason": "朋友聚会"
}
```

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Drink record created successfully",
  "data": {
    "id": "65123456789abcdef1234567",
    "drinkName": "青岛啤酒",
    "alcoholType": "啤酒",
    "unit": "瓶",
    "drinkTime": "2025-01-04T14:00:00Z",
    "reason": "朋友聚会",
    "createdAt": "2025-01-04T14:00:00Z",
    "updatedAt": "2025-01-04T14:00:00Z"
  },
  "timestamp": "2025-01-04 14:00:00.123"
}
```

### 2. 获取饮品列表

**请求**
- 方法: `GET`
- 路径: `/api/v1/drinks/list`
- Headers: 
  - Authorization: Bearer {token}

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": [
    {
      "id": "65123456789abcdef1234567",
      "drinkName": "青岛啤酒",
      "alcoholType": "啤酒",
      "unit": "瓶",
      "drinkTime": "2025-01-04T14:00:00Z",
      "reason": "朋友聚会",
      "createdAt": "2025-01-04T14:00:00Z",
      "updatedAt": "2025-01-04T14:00:00Z"
    }
  ],
  "timestamp": "2025-01-04 14:00:00.123"
}
```

### 3. 获取单个饮品详情

**请求**
- 方法: `GET`
- 路径: `/api/v1/drinks/:id`
- Headers: 
  - Authorization: Bearer {token}

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "id": "65123456789abcdef1234567",
    "drinkName": "青岛啤酒",
    "alcoholType": "啤酒",
    "unit": "瓶",
    "drinkTime": "2025-01-04T14:00:00Z",
    "reason": "朋友聚会",
    "createdAt": "2025-01-04T14:00:00Z",
    "updatedAt": "2025-01-04T14:00:00Z"
  },
  "timestamp": "2025-01-04 14:00:00.123"
}
```

### 4. 更新饮品记录

**请求**
- 方法: `PUT`
- 路径: `/api/v1/drinks/:id`
- Headers: 
  - Authorization: Bearer {token}
- Content-Type: `application/json`

**请求体**
```json
{
  "drinkName": "青岛啤酒",
  "alcoholType": "啤酒",
  "unit": "瓶",
  "drinkTime": "2025-01-04T15:00:00Z",
  "reason": "修改后的原因"
}
```

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Drink record updated successfully",
  "data": {
    "id": "65123456789abcdef1234567",
    "drinkName": "青岛啤酒",
    "alcoholType": "啤酒",
    "unit": "瓶",
    "drinkTime": "2025-01-04T15:00:00Z",
    "reason": "修改后的原因",
    "createdAt": "2025-01-04T14:00:00Z",
    "updatedAt": "2025-01-04T15:00:00Z"
  },
  "timestamp": "2025-01-04 15:00:00.123"
}
```

### 5. 删除饮品记录

**请求**
- 方法: `DELETE`
- 路径: `/api/v1/drinks/:id`
- Headers: 
  - Authorization: Bearer {token}

**响应示例**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Drink record deleted successfully",
  "data": null,
  "timestamp": "2025-01-04 15:00:00.123"
}
```

## 酒类管理 API

所有酒类相关的 API 都需要在请求头中包含有效的 JWT token：
```http
Authorization: Bearer <your-token>
```

### 创建酒类

创建一个新的酒类记录。

- **URL**: `/api/v1/alcohols`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Asahi Super Dry",
  "type": "beer",
  "brand": "Asahi",
  "alcoholContent": 5.2,
  "volume": 330,
  "volumeUnit": "ml",
  "description": "日本顶级啤酒",
  "imageUrl": "https://example.com/asahi.jpg"  // 可选
}
```

**type 可选值**:
- beer (啤酒)
- baijiu (白酒)
- red_wine (红酒)
- foreign_wine (洋酒)
- sake (清酒)
- shochu (烧酒)

**volumeUnit 可选值**:
- ml (毫升)
- L (升)

**Success Response**:
- **Code**: 201
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "name": "Asahi Super Dry",
    "type": "beer",
    "brand": "Asahi",
    "alcoholContent": 5.2,
    "volume": 330,
    "volumeUnit": "ml",
    "description": "日本顶级啤酒",
    "imageUrl": "https://example.com/asahi.jpg",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:32:12.000Z"
  },
  "message": "Alcohol created successfully"
}
```

### 获取酒类列表

获取酒类列表，支持分页、过滤和排序。

- **URL**: `/api/v1/alcohols`
- **Method**: `GET`
- **Auth Required**: Yes

**Query Parameters**:
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `type` (可选): 酒类类型
- `brand` (可选): 品牌名称（支持模糊搜索）
- `minAlcoholContent` (可选): 最小酒精度数
- `maxAlcoholContent` (可选): 最大酒精度数
- `sortBy` (可选): 排序字段，默认 createdAt
- `order` (可选): 排序方向，asc 或 desc，默认 desc

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": {
    "alcohols": [
      {
        "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
        "name": "Asahi Super Dry",
        "type": "beer",
        "brand": "Asahi",
        "alcoholContent": 5.2,
        "volume": 330,
        "volumeUnit": "ml",
        "description": "日本顶级啤酒",
        "imageUrl": "https://example.com/asahi.jpg",
        "createdBy": "john_doe",
        "updatedBy": "john_doe",
        "createdAt": "2025-01-04T15:32:12.000Z",
        "updatedAt": "2025-01-04T15:32:12.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "totalPages": 5,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 获取单个酒类

获取单个酒类的详细信息。

- **URL**: `/api/v1/alcohols/:id`
- **Method**: `GET`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 酒类 ID

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "name": "Asahi Super Dry",
    "type": "beer",
    "brand": "Asahi",
    "alcoholContent": 5.2,
    "volume": 330,
    "volumeUnit": "ml",
    "description": "日本顶级啤酒",
    "imageUrl": "https://example.com/asahi.jpg",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:32:12.000Z"
  }
}
```

### 更新酒类

更新现有酒类的信息。

- **URL**: `/api/v1/alcohols/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 酒类 ID

**Request Body** (所有字段都是可选的):
```json
{
  "name": "Updated Name",
  "type": "beer",
  "brand": "Updated Brand",
  "alcoholContent": 5.5,
  "volume": 350,
  "volumeUnit": "ml",
  "description": "Updated description",
  "imageUrl": "https://example.com/updated.jpg"
}
```

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "name": "Updated Name",
    "type": "beer",
    "brand": "Updated Brand",
    "alcoholContent": 5.5,
    "volume": 350,
    "volumeUnit": "ml",
    "description": "Updated description",
    "imageUrl": "https://example.com/updated.jpg",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:40:52.000Z"
  },
  "message": "Alcohol updated successfully"
}
```

### 删除酒类

删除指定的酒类。如果该酒类已被饮品记录引用，则无法删除。

- **URL**: `/api/v1/alcohols/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 酒类 ID

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": null,
  "message": "Alcohol deleted successfully"
}
```

**Error Responses**:

1. 记录不存在
- **Code**: 404
- **Content**:
```json
{
  "success": false,
  "message": "Alcohol not found"
}
```

2. 验证错误
- **Code**: 400
- **Content**:
```json
{
  "success": false,
  "message": "Validation failed: type must be one of: beer, baijiu, red_wine, foreign_wine, sake, shochu"
}
```

3. 无法删除（被引用）
- **Code**: 400
- **Content**:
```json
{
  "success": false,
  "message": "Cannot delete alcohol: it is referenced by drink records"
}
```

4. 服务器错误
- **Code**: 500
- **Content**:
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

## 错误响应示例

### 1. 未授权访问
```json
{
  "code": "A00401",
  "statusCode": 401,
  "msg": "Unauthorized",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 2. 请求参数错误
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "Username and password are required",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

### 3. 资源未找到
```json
{
  "code": "A00404",
  "statusCode": 404,
  "msg": "User not found",
  "data": null,
  "timestamp": "2025-01-02 14:11:30.123"
}
```

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 JWT token：
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

2. 手机号码格式必须是有效的中国大陆手机号码（11位）

3. 密码在传输和存储时都会进行 MD5 加密

4. 管理员用户可以访问所有菜单，普通用户只能访问被授权的菜单

5. token 有效期为 24 小时
