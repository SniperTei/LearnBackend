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

- **URL**: `/api/v1/drinks/query/:id`
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

- **URL**: `/api/v1/drinks/update/:id`
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

- **URL**: `/api/v1/drinks/delete/:id`
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

获取酒类列表，支持分页和过滤。

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

- **URL**: `/api/v1/alcohols/query/:id`
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

- **URL**: `/api/v1/alcohols/update/:id`
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

- **URL**: `/api/v1/alcohols/delete/:id`
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

## 菜单管理 API

所有菜单接口都需要在请求头中携带认证 token：
```
Authorization: Bearer <token>
```

### 1. 创建菜品

**请求**
- 方法: `POST`
- URL: `/api/v1/foodmenus/create`
- 请求头: 
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- 请求体:
```json
{
  "name": "宫保鸡丁",
  "type": "meat",
  "description": "一道闻名中外的特色传统名菜，选用鸡丁、干辣椒、花生米等炒制而成。",
  "imageUrl": "http://example.com/image.jpg",
  "price": 38,
  "chef": "张大厨"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "菜品创建成功",
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "name": "宫保鸡丁",
    "type": "meat",
    "description": "一道闻名中外的特色传统名菜，选用鸡丁、干辣椒、花生米等炒制而成。",
    "imageUrl": "http://example.com/image.jpg",
    "price": 38,
    "chef": "张大厨",
    "createdBy": "jinyan",
    "updatedBy": "jinyan",
    "createdAt": "2025-01-05T08:23:42.123Z",
    "updatedAt": "2025-01-05T08:23:42.123Z"
  },
  "timestamp": "2025-01-05 16:23:42.123"
}
```

### 2. 获取菜品列表

**请求**
- 方法: `GET`
- URL: `/api/v1/foodmenus/list`
- 查询参数:
  - `page`: 页码（可选，默认1）
  - `limit`: 每页数量（可选，默认10）
  - `type`: 菜品类型（可选）
  - `minPrice`: 最低价格（可选）
  - `maxPrice`: 最高价格（可选）
  - `sortBy`: 排序字段（可选，默认createdAt）
  - `order`: 排序方式（可选，默认desc）

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "result": [
      {
        "_id": "5f9f1b9b9b9b9b9b9b",
        "name": "锅包肉",
        "type": "meat",
        "description": "酥脆可口的锅包肉",
        "imageUrl": "https://food-images.com/guobaorou.jpg",
        "price": 48,
        "chef": "朴金燕",
        "createdBy": "admin",
        "updatedBy": "admin",
        "createdAt": "2025-01-05T11:19:59.000Z",
        "updatedAt": "2025-01-05T11:19:59.000Z"
      }
    ]
  },
  "timestamp": "2025-01-05T11:19:59.000Z"
}
```

### 3. 获取单个菜品详情

**请求**
- 方法: `GET`
- URL: `/api/v1/foodmenus/query/:id`

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "_id": "5f9f1b9b9b9b9b9b9b",
    "name": "锅包肉",
    "type": "meat",
    "description": "酥脆可口的锅包肉",
    "imageUrl": "https://food-images.com/guobaorou.jpg",
    "price": 48,
    "chef": "朴金燕",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2025-01-05T11:19:59.000Z",
    "updatedAt": "2025-01-05T11:19:59.000Z"
  },
  "timestamp": "2025-01-05T11:19:59.000Z"
}
```

### 4. 更新菜品

**请求**
- 方法: `PUT`
- URL: `/api/v1/foodmenus/update/:id`
- 请求头: 
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- 请求体:
```json
{
  "name": "宫保鸡丁",
  "type": "meat",
  "description": "一道闻名中外的特色传统名菜，选用鸡丁、干辣椒、花生米等炒制而成。",
  "imageUrl": "http://example.com/image.jpg",
  "price": 42,
  "chef": "李大厨"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "菜品更新成功",
  "data": {
    "_id": "5f7b5d7e9b8c2d1a3e4f5g6h",
    "name": "宫保鸡丁",
    "type": "meat",
    "description": "一道闻名中外的特色传统名菜，选用鸡丁、干辣椒、花生米等炒制而成。",
    "imageUrl": "http://example.com/image.jpg",
    "price": 42,
    "chef": "李大厨",
    "createdBy": "jinyan",
    "updatedBy": "jinyan",
    "createdAt": "2025-01-05T08:23:42.123Z",
    "updatedAt": "2025-01-05T08:24:42.123Z"
  },
  "timestamp": "2025-01-05 16:24:42.123"
}
```

### 5. 删除菜品

**请求**
- 方法: `DELETE`
- URL: `/api/v1/foodmenus/delete/:id`
- 请求头: 
  ```
  Authorization: Bearer <token>
  ```

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "菜品删除成功",
  "data": null,
  "timestamp": "2025-01-05 16:24:42.123"
}
```

### 6. 随机推荐菜品

**请求**
- 方法: `GET`
- URL: `/api/v1/foodmenus/random`
- 请求头: 
  ```
  Authorization: Bearer <token>
  ```
- 查询参数:
  - `foodCount`: 需要推荐的菜品数量（可选，默认1，最大10）

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "今晚吃这些！",
  "data": {
    "result": [
      {
        "_id": "5f9f1b9b9b9b9b9b9b",
        "name": "锅包肉",
        "type": "meat",
        "description": "酥脆可口的锅包肉",
        "imageUrl": "https://food-images.com/guobaorou.jpg",
        "price": 48,
        "chef": "朴金燕",
        "createdBy": "admin",
        "updatedBy": "admin",
        "createdAt": "2025-01-05T11:19:59.000Z",
        "updatedAt": "2025-01-05T11:19:59.000Z"
      }
    ]
  },
  "timestamp": "2025-01-05T11:19:59.000Z"
}
```

**错误响应**
```json
{
  "code": "1",
  "statusCode": 400,
  "msg": "错误信息",
  "data": null,
  "timestamp": "2025-01-05T11:19:59.000Z"
}
```

## 餐厅管理 API

所有餐厅接口都需要在请求头中携带认证 token：
```
Authorization: Bearer <token>
```

### 1. 创建餐厅

**请求**
- 方法: `POST`
- URL: `/api/v1/restaurants/create`
- 权限: 仅管理员
- 请求头: 
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- 请求体:
```json
{
  "name": "金燕饭店",
  "address": "延吉市公园路123号",
  "rating": 4.5,
  "imageUrls": [
    "https://restaurant-images.com/jingyan1.jpg",
    "https://restaurant-images.com/jingyan2.jpg"
  ],
  "description": "正宗朝鲜族料理，特色冷面和烤肉",
  "priceLevel": "moderate"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "餐厅创建成功",
  "data": {
    "name": "金燕饭店",
    "address": "延吉市公园路123号",
    "rating": 4.5,
    "imageUrls": [
      "https://restaurant-images.com/jingyan1.jpg",
      "https://restaurant-images.com/jingyan2.jpg"
    ],
    "description": "正宗朝鲜族料理，特色冷面和烤肉",
    "priceLevel": "moderate",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2025-01-05T14:29:13.000Z",
    "updatedAt": "2025-01-05T14:29:13.000Z"
  },
  "timestamp": "2025-01-05T14:29:13.000Z"
}
```

### 2. 获取餐厅列表

**请求**
- 方法: `GET`
- URL: `/api/v1/restaurants/list`
- 查询参数:
  - `page`: 页码（可选，默认1）
  - `limit`: 每页数量（可选，默认10）
  - `name`: 餐厅名称关键词（可选）
  - `minRating`: 最低评分（可选）
  - `maxRating`: 最高评分（可选）
  - `priceLevel`: 价位等级（可选，可选值：super_expensive/expensive/moderate/cheap）
  - `sortBy`: 排序字段（可选，默认createdAt）
  - `order`: 排序方式（可选，desc/asc，默认desc）

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "restaurants": [
      {
        "name": "金燕饭店",
        "address": "延吉市公园路123号",
        "rating": 4.5,
        "imageUrls": [
          "https://restaurant-images.com/jingyan1.jpg",
          "https://restaurant-images.com/jingyan2.jpg"
        ],
        "description": "正宗朝鲜族料理，特色冷面和烤肉",
        "priceLevel": "moderate",
        "createdBy": "admin",
        "updatedBy": "admin",
        "createdAt": "2025-01-05T14:29:13.000Z",
        "updatedAt": "2025-01-05T14:29:13.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  },
  "timestamp": "2025-01-05T14:29:13.000Z"
}
```

### 3. 获取单个餐厅

**请求**
- 方法: `GET`
- URL: `/api/v1/restaurants/query/:id`

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "name": "金燕饭店",
    "address": "延吉市公园路123号",
    "rating": 4.5,
    "imageUrls": [
      "https://restaurant-images.com/jingyan1.jpg",
      "https://restaurant-images.com/jingyan2.jpg"
    ],
    "description": "正宗朝鲜族料理，特色冷面和烤肉",
    "priceLevel": "moderate",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2025-01-05T14:29:13.000Z",
    "updatedAt": "2025-01-05T14:29:13.000Z"
  },
  "timestamp": "2025-01-05T14:29:13.000Z"
}
```

### 4. 更新餐厅

**请求**
- 方法: `PUT`
- URL: `/api/v1/restaurants/update/:id`
- 权限: 仅管理员
- 请求头: 
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- 请求体:
```json
{
  "rating": 4.8,
  "description": "正宗朝鲜族料理，特色冷面和烤肉，新增特色火锅"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "餐厅更新成功",
  "data": {
    "name": "金燕饭店",
    "address": "延吉市公园路123号",
    "rating": 4.8,
    "imageUrls": [
      "https://restaurant-images.com/jingyan1.jpg",
      "https://restaurant-images.com/jingyan2.jpg"
    ],
    "description": "正宗朝鲜族料理，特色冷面和烤肉，新增特色火锅",
    "priceLevel": "moderate",
    "createdBy": "admin",
    "updatedBy": "admin",
    "createdAt": "2025-01-05T14:29:13.000Z",
    "updatedAt": "2025-01-05T14:29:13.000Z"
  },
  "timestamp": "2025-01-05T14:29:13.000Z"
}
```

### 5. 删除餐厅

**请求**
- 方法: `DELETE`
- URL: `/api/v1/restaurants/delete/:id`
- 权限: 仅管理员
- 请求头: 
  ```
  Authorization: Bearer <token>
  ```

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "餐厅删除成功",
  "data": null,
  "timestamp": "2025-01-05T14:29:13.000Z"
}
```

## 运动记录接口

### 1. 创建运动记录

**请求**
- 方法: `POST`
- URL: `/api/v1/fitness/create`
- Headers:
  - `Authorization`: Bearer token
- Body:
```json
{
  "exerciseType": "跑步",
  "exerciseDate": "2025-01-06T14:00:00.000Z",
  "duration": 30,
  "caloriesBurned": 300,
  "intensity": "moderate",
  "location": "公园"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "运动记录创建成功",
  "data": {
    "exerciseType": "跑步",
    "userId": "5f7b5d6b3f6a8c2a1c9e4b7d",
    "exerciseDate": "2025-01-06T14:00:00.000Z",
    "duration": 30,
    "caloriesBurned": 300,
    "intensity": "moderate",
    "location": "公园",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-06T14:29:13.000Z",
    "updatedAt": "2025-01-06T14:29:13.000Z"
  },
  "timestamp": "2025-01-06T14:29:13.000Z"
}
```

### 2. 获取运动记录列表

**请求**
- 方法: `GET`
- URL: `/api/v1/fitness/list`
- Headers:
  - `Authorization`: Bearer token
- Query Parameters:
  - `page`: 页码（默认：1）
  - `limit`: 每页数量（默认：10）
  - `startDate`: 开始日期（可选）
  - `endDate`: 结束日期（可选）
  - `exerciseType`: 运动类型（可选）
  - `intensity`: 运动强度（可选）
  - `sortBy`: 排序字段（默认：exerciseDate）
  - `order`: 排序方式（asc/desc，默认：desc）

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "records": [
      {
        "_id": "5f7b5d6b3f6a8c2a1c9e4b7e",
        "exerciseType": "跑步",
        "userId": {
          "_id": "5f7b5d6b3f6a8c2a1c9e4b7d",
          "username": "john_doe"
        },
        "exerciseDate": "2025-01-06T14:00:00.000Z",
        "duration": 30,
        "caloriesBurned": 300,
        "intensity": "moderate",
        "location": "公园",
        "createdBy": "john_doe",
        "updatedBy": "john_doe",
        "createdAt": "2025-01-06T14:29:13.000Z",
        "updatedAt": "2025-01-06T14:29:13.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-01-06T14:29:13.000Z"
}
```

### 3. 获取单个运动记录

**请求**
- 方法: `GET`
- URL: `/api/v1/fitness/query/:id`
- Headers:
  - `Authorization`: Bearer token

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "_id": "5f7b5d6b3f6a8c2a1c9e4b7e",
    "exerciseType": "跑步",
    "userId": {
      "_id": "5f7b5d6b3f6a8c2a1c9e4b7d",
      "username": "john_doe"
    },
    "exerciseDate": "2025-01-06T14:00:00.000Z",
    "duration": 30,
    "caloriesBurned": 300,
    "intensity": "moderate",
    "location": "公园",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-06T14:29:13.000Z",
    "updatedAt": "2025-01-06T14:29:13.000Z"
  },
  "timestamp": "2025-01-06T14:29:13.000Z"
}
```

### 4. 更新运动记录

**请求**
- 方法: `PUT`
- URL: `/api/v1/fitness/update/:id`
- Headers:
  - `Authorization`: Bearer token
- Body:
```json
{
  "duration": 45,
  "caloriesBurned": 450,
  "intensity": "vigorous"
}
```

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "运动记录更新成功",
  "data": {
    "_id": "5f7b5d6b3f6a8c2a1c9e4b7e",
    "exerciseType": "跑步",
    "userId": {
      "_id": "5f7b5d6b3f6a8c2a1c9e4b7d",
      "username": "john_doe"
    },
    "exerciseDate": "2025-01-06T14:00:00.000Z",
    "duration": 45,
    "caloriesBurned": 450,
    "intensity": "vigorous",
    "location": "公园",
    "createdBy": "john_doe",
    "updatedBy": "john_doe",
    "createdAt": "2025-01-06T14:29:13.000Z",
    "updatedAt": "2025-01-06T14:35:13.000Z"
  },
  "timestamp": "2025-01-06T14:35:13.000Z"
}
```

### 5. 删除运动记录

**请求**
- 方法: `DELETE`
- URL: `/api/v1/fitness/delete/:id`
- Headers:
  - `Authorization`: Bearer token

**响应**
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "运动记录删除成功",
  "data": null,
  "timestamp": "2025-01-06T14:36:13.000Z"
}
```

## 通用接口

### 上传图片

上传图片文件，支持同时上传多张图片。

- **接口URL**: `/api/v1/common/uploadImg`
- **请求方式**: `POST`
- **认证要求**: 需要登录认证，请在 Header 中携带 token
- **Content-Type**: `multipart/form-data`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| files | File[] | 是 | 图片文件数组，最多支持9张图片 |

**图片要求**:
- 支持的格式：jpeg, png, gif, webp
- 单个文件大小限制：5MB
- 最大上传数量：9张

**成功响应**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "urls": [
      {
        "url": "http://your-domain.com/uploads/2025/01/05/1641345678912-123456789.jpg",
        "filename": "1641345678912-123456789.jpg"
      }
    ]
  },
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

**错误响应**:

1. 未上传文件
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "No files uploaded",
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

2. 文件类型错误
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "Invalid file type. Only images are allowed.",
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

3. 超出文件数量限制
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "Too many files. Maximum allowed is 9",
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

4. 文件大小超限
```json
{
  "code": "A00400",
  "statusCode": 400,
  "msg": "File too large. Maximum size is 5MB",
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

5. 未登录或 token 无效
```json
{
  "code": "A00401",
  "statusCode": 401,
  "msg": "Unauthorized",
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

**使用示例**:

```javascript
// 前端代码示例
const formData = new FormData();
imageFiles.forEach(file => {
  formData.append('files', file);
});

const response = await fetch('/api/v1/common/uploadImg', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
if (result.code === '000000') {
  const imageUrls = result.data.urls;
  // 处理上传成功的图片URL
} else {
  // 处理错误
  console.error(result.msg);
}
```

## 字典接口

### 获取字典数据

获取指定分组的字典数据，支持同时获取多个分组的数据。

**请求**
- 方法: `GET`
- URL: `/api/v1/dictionary`
- 认证: 需要 Bearer Token
- 查询参数:
  - `groups`: 字典分组，多个分组用逗号分隔（例如：RESTAURANT_PRICE_LEVEL,OTHER_GROUP）

**成功响应**:
- 状态码: `200 OK`
- 响应体:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "Success",
  "data": {
    "RESTAURANT_PRICE_LEVEL": [
      {
        "key": "super_expensive",
        "value": "爆贵"
      },
      {
        "key": "expensive",
        "value": "很贵"
      },
      {
        "key": "moderate",
        "value": "正常"
      },
      {
        "key": "cheap",
        "value": "便宜"
      }
    ]
  },
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

**错误响应**:

1. 未指定分组
```json
{
  "code": "400000",
  "statusCode": 400,
  "msg": "请指定字典分组",
  "data": null,
  "timestamp": "2025-01-05T15:45:48.000Z"
}
```

2. 未认证或认证失败
```json
{
  "code": "401000",
  "statusCode": 401,
  "msg": "未认证或认证失败",
  "data": null,
  "timestamp": "2025-01-05T15:45:48.000Z"
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

## 游记 API

### 创建游记
- **URL**: `/api/v1/travel-diaries/create`
- **Method**: `POST`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "京都温泉游记",
    "content": "今天去了岚山温泉，体验了日本传统的温泉文化...",
    "location": {
      "country": "日本",
      "city": "京都",
      "place": "岚山温泉"
    },
    "images": [
      {
        "url": "http://example.com/image1.jpg",
        "caption": "岚山温泉外景"
      }
    ],
    "travelPlanId": "677f63b5f93fa973677950a9",  // 可选，关联的旅行计划ID
    "tags": ["温泉", "日本", "京都"]
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 201,
    "msg": "游记创建成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉游记",
      "content": "今天去了岚山温泉，体验了日本传统的温泉文化...",
      "location": {...},
      "images": [...],
      "tags": ["温泉", "日本", "京都"],
      "travelPlanId": "677f63b5f93fa973677950a9",
      "createdBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      },
      "updatedBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      },
      "createdAt": "2025-01-10T05:48:33.867Z",
      "updatedAt": "2025-01-10T05:48:33.867Z"
    }
  }
  ```

### 获取游记列表
- **URL**: `/api/v1/travel-diaries/list`
- **Method**: `GET`
- **Auth**: Required
- **Query Parameters**:
  - `page` (optional): 页码，默认1
  - `limit` (optional): 每页数量，默认10
  - `tags` (optional): 标签筛选，多个标签用逗号分隔
  - `location` (optional): 位置筛选，支持国家和城市
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "Success",
    "data": {
      "diaries": [
        {
          "_id": "677f63b5f93fa973677950a9",
          "title": "京都温泉游记",
          "content": "今天去了岚山温泉...",
          "location": {...},
          "images": [...],
          "tags": ["温泉", "日本", "京都"],
          "createdBy": {
            "_id": "677f5f65523623b6f1a9ebfa",
            "username": "tester"
          },
          "updatedBy": {
            "_id": "677f5f65523623b6f1a9ebfa",
            "username": "tester"
          },
          "createdAt": "2025-01-10T05:48:33.867Z",
          "updatedAt": "2025-01-10T05:48:33.867Z"
        }
      ],
      "totalPages": 1,
      "currentPage": 1
    }
  }
  ```

### 获取游记详情
- **URL**: `/api/v1/travel-diaries/query/:id`
- **Method**: `GET`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 游记ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "Success",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉游记",
      "content": "今天去了岚山温泉...",
      "location": {...},
      "images": [...],
      "tags": ["温泉", "日本", "京都"],
      "travelPlanId": {
        "_id": "677f63b5f93fa973677950a9",
        "title": "京都温泉之旅"
      },
      "createdBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      },
      "updatedBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      }
    }
  }
  ```

### 更新游记
- **URL**: `/api/v1/travel-diaries/update/:id`
- **Method**: `PUT`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 游记ID
- **Request Body** (所有字段都是可选的):
  ```json
  {
    "title": "京都温泉和美食游记",
    "content": "更新的内容...",
    "location": {...},
    "images": [...],
    "tags": ["温泉", "美食", "日本", "京都"]
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "游记更新成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉和美食游记",
      "updatedAt": "2025-01-10T05:51:15.367Z",
      ...
    }
  }
  ```

### 删除游记
- **URL**: `/api/v1/travel-diaries/delete/:id`
- **Method**: `DELETE`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 游记ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "游记删除成功",
    "data": null
  }
  ```

### 错误响应
所有API可能返回以下错误响应：

- **401 Unauthorized**:
  ```json
  {
    "code": "401000",
    "statusCode": 401,
    "msg": "未授权"
  }
  ```

- **403 Forbidden**:
  ```json
  {
    "code": "403000",
    "statusCode": 403,
    "msg": "没有权限操作此游记"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "code": "404000",
    "statusCode": 404,
    "msg": "未找到游记"
  }
  ```

- **400 Bad Request**:
  ```json
  {
    "code": "400000",
    "statusCode": 400,
    "msg": "验证错误信息"
  }
  ```

### 注意事项
1. 所有需要认证的API都需要在请求头中包含 `Authorization: Bearer <token>`
2. 图片上传请使用公共接口 `/api/v1/common/uploadImg`
3. 创建和更新操作会自动记录操作用户和时间
4. 只有创建者可以更新和删除游记
5. 游记可以选择性地关联到旅行计划

## 旅行计划 API

### 创建旅行计划
- **URL**: `/api/v1/travel-plans/create`
- **Method**: `POST`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "title": "京都温泉之旅",
    "description": "体验日本传统温泉文化",
    "startDate": "2025-04-01",
    "endDate": "2025-04-05",
    "destination": {
      "country": "日本",
      "city": "京都",
      "locations": ["岚山温泉", "嵐山竹林", "金阁寺"]
    },
    "itinerary": [
      {
        "day": 1,
        "date": "2025-04-01",
        "activities": [
          {
            "time": "14:00",
            "location": "岚山温泉",
            "activity": "泡温泉",
            "duration": "3小时"
          }
        ]
      }
    ]
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 201,
    "msg": "旅行计划创建成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉之旅",
      "description": "体验日本传统温泉文化",
      "startDate": "2025-04-01T00:00:00.000Z",
      "endDate": "2025-04-05T00:00:00.000Z",
      "destination": {...},
      "itinerary": [...],
      "status": "draft",
      "createdBy": "677f5f65523623b6f1a9ebfa",
      "updatedBy": "677f5f65523623b6f1a9ebfa",
      "createdAt": "2025-01-09T05:50:45.867Z",
      "updatedAt": "2025-01-09T05:50:45.867Z"
    }
  }
  ```

### 获取旅行计划列表
- **URL**: `/api/v1/travel-plans/list`
- **Method**: `GET`
- **Auth**: Required
- **Query Parameters**:
  - `page` (optional): 页码，默认1
  - `limit` (optional): 每页数量，默认10
  - `status` (optional): 过滤状态
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "Success",
    "data": {
      "travelPlans": [
        {
          "_id": "677f63b5f93fa973677950a9",
          "title": "京都温泉之旅",
          "description": "体验日本传统温泉文化",
          "destination": {...},
          "itinerary": [...],
          "status": "draft",
          "createdBy": {
            "_id": "677f5f65523623b6f1a9ebfa",
            "username": "tester"
          },
          "updatedBy": {
            "_id": "677f5f65523623b6f1a9ebfa",
            "username": "tester"
          },
          "createdAt": "2025-01-09T05:50:45.867Z",
          "updatedAt": "2025-01-09T05:50:45.867Z"
        }
      ],
      "totalPages": 1,
      "currentPage": 1
    }
  }
  ```

### 获取单个旅行计划
- **URL**: `/api/v1/travel-plans/query/:id`
- **Method**: `GET`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "Success",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉之旅",
      "description": "体验日本传统温泉文化",
      "destination": {...},
      "itinerary": [...],
      "status": "draft",
      "createdBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      },
      "updatedBy": {
        "_id": "677f5f65523623b6f1a9ebfa",
        "username": "tester"
      }
    }
  }
  ```

### 更新旅行计划
- **URL**: `/api/v1/travel-plans/update/:id`
- **Method**: `PUT`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Request Body** (所有字段都是可选的):
  ```json
  {
    "title": "京都温泉和文化之旅",
    "description": "体验日本传统温泉文化",
    "status": "published",
    "destination": {...},
    "itinerary": [...]
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划更新成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "title": "京都温泉和文化之旅",
      "status": "published",
      "updatedAt": "2025-01-09T05:51:15.367Z",
      ...
    }
  }
  ```

### 删除旅行计划
- **URL**: `/api/v1/travel-plans/delete/:id`
- **Method**: `DELETE`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划删除成功",
    "data": null
  }
  ```

### 发布旅行计划
- **URL**: `/api/v1/travel-plans/publish/:id`
- **Method**: `POST`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划发布成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "status": "published",
      "updatedAt": "2025-01-09T05:51:15.367Z",
      ...
    }
  }
  ```

### 取消发布旅行计划
- **URL**: `/api/v1/travel-plans/unpublish/:id`
- **Method**: `POST`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划取消发布成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "status": "draft",
      "updatedAt": "2025-01-09T05:51:15.367Z",
      ...
    }
  }
  ```

### 获取旅行计划日程
- **URL**: `/api/v1/travel-plans/itinerary/:id`
- **Method**: `GET`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "Success",
    "data": {
      "itinerary": [
        {
          "day": 1,
          "date": "2025-04-01",
          "activities": [
            {
              "time": "14:00",
              "location": "岚山温泉",
              "activity": "泡温泉",
              "duration": "3小时"
            }
          ]
        }
      ]
    }
  }
  ```

### 更新旅行计划日程
- **URL**: `/api/v1/travel-plans/itinerary/:id`
- **Method**: `PUT`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Request Body**:
  ```json
  {
    "itinerary": [
      {
        "day": 1,
        "date": "2025-04-01",
        "activities": [
          {
            "time": "14:00",
            "location": "岚山温泉",
            "activity": "泡温泉",
            "duration": "3小时"
          }
        ]
      }
    ]
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划日程更新成功",
    "data": {
      "_id": "677f63b5f93fa973677950a9",
      "itinerary": [...],
      "updatedAt": "2025-01-09T05:51:15.367Z",
      ...
    }
  }
  ```

### 删除旅行计划日程
- **URL**: `/api/v1/travel-plans/itinerary/:id`
- **Method**: `DELETE`
- **Auth**: Required
- **URL Parameters**:
  - `id`: 旅行计划ID
- **Success Response**:
  ```json
  {
    "code": "000000",
    "statusCode": 200,
    "msg": "旅行计划日程删除成功",
    "data": null
  }
  ```

### 错误响应
所有API可能返回以下错误响应：

1. 记录不存在
```json
{
  "code": "404000",
  "statusCode": 404,
  "msg": "未找到旅行计划"
}
```

2. 权限不足
```json
{
  "code": "403000",
  "statusCode": 403,
  "msg": "没有权限操作此旅行计划"
}
```

3. 验证错误
```json
{
  "code": "400000",
  "statusCode": 400,
  "msg": "验证错误信息"
}
```

4. 服务器错误
```json
{
  "code": "500000",
  "statusCode": 500,
  "msg": "内部服务器错误"
}
```

### 注意事项
1. 所有需要认证的API都需要在请求头中包含 `Authorization: Bearer <token>`
2. 日期字段使用 ISO 8601 格式
3. 创建和更新操作会自动记录操作用户和时间
4. 只有创建者可以更新和删除旅行计划
5. 状态字段可选值：draft（草稿）、published（已发布）
6. 发布和取消发布操作会更新状态字段
7. 删除操作会删除整个旅行计划，包括日程
8. 更新日程操作会覆盖原有的日程
9. 删除日程操作会删除整个日程
10. 所有接口都支持分页和过滤
