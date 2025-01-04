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

## 饮酒记录 API

所有饮酒记录相关的 API 都需要在请求头中包含有效的 JWT token：
```http
Authorization: Bearer <your-token>
```

### 创建饮酒记录

创建一个新的饮酒记录。

- **URL**: `/api/v1/drinks/create`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:
```json
{
  "alcoholId": "5f7b5d7e9b8c2d1a3e4f5g6h",  // 酒类ID，必需
  "drinkTime": "2025-01-04T15:30:00Z",      // 饮酒时间，必需
  "amount": 2,                               // 饮酒数量，必需
  "mood": "happy",                           // 心情，可选
  "occasion": "party",                       // 场合，可选
  "location": "家里",                        // 地点，可选
  "companions": ["小明", "小红"],            // 同饮人，可选
  "photos": ["url1", "url2"],               // 照片URL数组，可选
  "note": "和朋友聚会很开心"                 // 备注，可选
}
```

**字段说明**:
- `alcoholId`: 对应酒类记录的ID（必需）
- `drinkTime`: ISO 8601 格式的时间字符串（必需）
- `amount`: 饮酒数量（必需，单位为瓶/杯）
- `mood`: 心情（可选），可选值：
  - happy (开心)
  - sad (难过)
  - excited (兴奋)
  - relaxed (放松)
  - neutral (平静)
- `occasion`: 场合（可选），可选值：
  - party (聚会)
  - dinner (晚餐)
  - social (社交)
  - alone (独饮)
  - business (商务)
- `location`: 饮酒地点（可选）
- `companions`: 同饮人姓名数组（可选）
- `photos`: 照片URL数组（可选）
- `note`: 备注信息（可选）

**Success Response**:
- **Code**: 201
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "userId": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "alcoholId": {
      "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
      "name": "Asahi Super Dry",
      "type": "beer",
      "brand": "Asahi",
      "alcoholContent": 5.2,
      "volume": 330,
      "volumeUnit": "ml"
    },
    "drinkTime": "2025-01-04T15:30:00Z",
    "amount": 2,
    "mood": "happy",
    "occasion": "party",
    "location": "家里",
    "companions": ["小明", "小红"],
    "photos": ["url1", "url2"],
    "note": "和朋友聚会很开心",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:32:12.000Z"
  },
  "message": "Drink record created successfully"
}
```

### 获取饮酒记录列表

获取当前用户的饮酒记录列表，支持分页和过滤。

- **URL**: `/api/v1/drinks/list`
- **Method**: `GET`
- **Auth Required**: Yes

**Query Parameters**:
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `startDate` (可选): 开始日期，ISO 8601 格式
- `endDate` (可选): 结束日期，ISO 8601 格式
- `mood` (可选): 按心情过滤
- `occasion` (可选): 按场合过滤
- `sortBy` (可选): 排序字段，默认 drinkTime
- `order` (可选): 排序方向，asc 或 desc，默认 desc

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": {
    "drinks": [
      {
        "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
        "userId": "5f7b5d7e9b8c2d1a3e4f5g6h",
        "alcoholId": {
          "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
          "name": "Asahi Super Dry",
          "type": "beer",
          "brand": "Asahi",
          "alcoholContent": 5.2,
          "volume": 330,
          "volumeUnit": "ml"
        },
        "drinkTime": "2025-01-04T15:30:00Z",
        "amount": 2,
        "mood": "happy",
        "occasion": "party",
        "location": "家里",
        "companions": ["小明", "小红"],
        "photos": ["url1", "url2"],
        "note": "和朋友聚会很开心",
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

### 获取单个饮酒记录

获取单个饮酒记录的详细信息。

- **URL**: `/api/v1/drinks/:id`
- **Method**: `GET`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 饮酒记录 ID

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "userId": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "alcoholId": {
      "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
      "name": "Asahi Super Dry",
      "type": "beer",
      "brand": "Asahi",
      "alcoholContent": 5.2,
      "volume": 330,
      "volumeUnit": "ml"
    },
    "drinkTime": "2025-01-04T15:30:00Z",
    "amount": 2,
    "mood": "happy",
    "occasion": "party",
    "location": "家里",
    "companions": ["小明", "小红"],
    "photos": ["url1", "url2"],
    "note": "和朋友聚会很开心",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:32:12.000Z"
  }
}
```

### 更新饮酒记录

更新现有饮酒记录的信息。

- **URL**: `/api/v1/drinks/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 饮酒记录 ID

**Request Body** (所有字段都是可选的):
```json
{
  "alcoholId": "5f7b5d7e9b8c2d1a3e4f5g6h",
  "drinkTime": "2025-01-04T15:30:00Z",
  "amount": 3,
  "mood": "relaxed",
  "occasion": "dinner",
  "location": "餐厅",
  "companions": ["小王"],
  "photos": ["url3"],
  "note": "更新的备注"
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
    "userId": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "alcoholId": {
      "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
      "name": "Asahi Super Dry",
      "type": "beer",
      "brand": "Asahi",
      "alcoholContent": 5.2,
      "volume": 330,
      "volumeUnit": "ml"
    },
    "drinkTime": "2025-01-04T15:30:00Z",
    "amount": 3,
    "mood": "relaxed",
    "occasion": "dinner",
    "location": "餐厅",
    "companions": ["小王"],
    "photos": ["url3"],
    "note": "更新的备注",
    "createdAt": "2025-01-04T15:32:12.000Z",
    "updatedAt": "2025-01-04T15:40:52.000Z"
  },
  "message": "Drink record updated successfully"
}
```

### 删除饮酒记录

删除指定的饮酒记录。只有记录的创建者可以删除自己的记录。

- **URL**: `/api/v1/drinks/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**URL Parameters**:
- `id`: 饮酒记录 ID

**Success Response**:
- **Code**: 200
- **Content**:
```json
{
  "success": true,
  "data": null,
  "message": "Drink record deleted successfully"
}
```

**Error Responses**:

1. 记录不存在
- **Code**: 404
- **Content**:
```json
{
  "success": false,
  "message": "Drink record not found"
}
```

2. 权限不足
- **Code**: 403
- **Content**:
```json
{
  "success": false,
  "message": "You can only delete your own drink records"
}
```

3. 无效的记录ID
- **Code**: 400
- **Content**:
```json
{
  "success": false,
  "message": "Invalid drink record ID"
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

## 酒类管理 API

所有酒类相关的 API 都需要在请求头中包含有效的 JWT token：
```http
Authorization: Bearer <your-token>
```

### 创建酒类

创建一个新的酒类记录。

- **URL**: `/api/v1/alcohols/create`
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

- **URL**: `/api/v1/alcohols/list`
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
