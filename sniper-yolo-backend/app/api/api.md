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

创建新用户账户。支持通过邮箱或手机号注册（至少需要提供其中一个）。

**请求参数**:
```json
{
  "email": "user@example.com",  // 可选，邮箱
  "mobile": "13800000000",    // 可选，手机号
  "username": "exampleuser",    // 必填，用户名
  "password": "securepassword123" // 必填，密码
}
```

**说明**：
- email 和 mobile 字段至少需要提供其中一个
- username 必须唯一且长度为3-50个字符
- password 长度至少为8个字符
- 如果同时提供email和mobile，两者都必须唯一（不存在于系统中）

**响应示例**:
```json
{
    "code": "000000",
    "statusCode": 201,
    "msg": "用户注册成功",
    "data": {
        "access_token": "token",
        "token_type": "bearer"
    },
    "timestamp": "2025-11-22 11:40:34"
}
```

### 2. 用户登录
**POST** `/users/login`

用户登录并获取访问令牌。支持使用邮箱或手机号登录。

**请求参数**:
```json
{
  "identifier": "user@example.com",  // 必填，可以是邮箱或手机号
  "password": "securepassword123"    // 必填，密码
}
```

**说明**：
- identifier 字段可以是用户注册时提供的邮箱或手机号
- 系统会自动尝试通过邮箱和手机号两种方式查找用户
- 密码验证成功后返回访问令牌

### 3. 获取当前用户信息
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
    "mobile": "13800000000",
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

## 食品管理接口

### 1. 创建食品
**POST** `/foods/`

创建新的食品记录。

**认证**: 需要Bearer Token

**请求参数**:
```json
{
  "title": "宫保鸡丁",
  "content": "鸡肉嫩滑，花生酥脆，麻辣鲜香",
  "cover": "https://example.com/foods/kungpao-chicken.jpg",
  "images": [
    "https://example.com/foods/kungpao-chicken-1.jpg",
    "https://example.com/foods/kungpao-chicken-2.jpg"
  ],
  "tags": ["川菜", "鸡肉", "麻辣", "下饭菜"],
  "star": 4,
  "maker": "老川菜馆",
  "flavor": "麻辣"
}
```

**参数说明**：
- `title` (必填): 食品标题
- `content` (可选): 食品描述内容
- `cover` (可选): 封面图片URL
- `images` (可选): 图片URL数组
- `tags` (可选): 标签数组
- `star` (可选): 评分(0-5之间的数值)
- `maker` (必填): 制作者/餐厅名称
- `flavor` (可选): 口味描述

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "食品创建成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "宫保鸡丁",
    "content": "鸡肉嫩滑，花生酥脆，麻辣鲜香",
    "cover": "https://example.com/foods/kungpao-chicken.jpg",
    "images": ["https://example.com/foods/kungpao-chicken-1.jpg"],
    "tags": ["川菜", "鸡肉"],
    "star": 4,
    "maker": "老川菜馆",
    "flavor": "麻辣",
    "user_id": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": null
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 2. 获取食品列表
**GET** `/foods/`

获取食品记录列表，支持分页和多种条件查询。

**查询参数**:
- `page` (可选): 页码，从1开始，默认1
- `count` (可选): 每页数量，默认10
- `title` (可选): 标题模糊查询
- `content` (可选): 内容模糊查询
- `maker` (可选): 制作者精确查询
- `min_star` (可选): 最低评分
- `max_star` (可选): 最高评分
- `flavor` (可选): 口味精确查询
- `tag` (可选): 标签包含查询

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取食品列表成功",
  "data": {
    "foods": [
      {
        "id": "6562c5a5b1d4e3f2e4a1b2c3",
        "title": "宫保鸡丁",
        "content": "鸡肉嫩滑，花生酥脆，麻辣鲜香",
        "cover": "https://example.com/foods/kungpao-chicken.jpg",
        "images": [],
        "tags": ["川菜", "鸡肉"],
        "star": 4,
        "maker": "老川菜馆",
        "flavor": "麻辣",
        "user_id": "1",
        "create_time": "2024-01-01T00:00:00",
        "update_time": "2024-01-01T00:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "count": 10
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 3. 获取单个食品
**GET** `/foods/{food_id}`

根据ID获取单个食品的详细信息。

**路径参数**:
- `food_id`: 食品ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取食品成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "宫保鸡丁",
    "content": "鸡肉嫩滑，花生酥脆，麻辣鲜香",
    "cover": "https://example.com/foods/kungpao-chicken.jpg",
    "images": ["https://example.com/foods/kungpao-chicken-1.jpg"],
    "tags": ["川菜", "鸡肉", "麻辣", "下饭菜"],
    "star": 4,
    "maker": "老川菜馆",
    "flavor": "麻辣",
    "user_id": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": "2024-01-01T12:00:00"
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 4. 更新食品
**PUT** `/foods/{food_id}`

根据ID更新单个食品的信息。

**认证**: 需要Bearer Token

**路径参数**:
- `food_id`: 食品ID

**请求参数**:
```json
{
  "title": "香辣宫保鸡丁",
  "content": "升级版宫保鸡丁，更加香辣可口",
  "star": 5,
  "tags": ["川菜", "鸡肉", "麻辣", "招牌菜"]
}
```

**说明**: 只需要提供需要更新的字段，未提供的字段保持不变。

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "更新成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "香辣宫保鸡丁",
    "content": "升级版宫保鸡丁，更加香辣可口",
    "cover": "https://example.com/foods/kungpao-chicken.jpg",
    "images": ["https://example.com/foods/kungpao-chicken-1.jpg"],
    "tags": ["川菜", "鸡肉", "麻辣", "招牌菜"],
    "star": 5,
    "maker": "老川菜馆",
    "flavor": "麻辣",
    "user_id": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": "2024-01-02T10:00:00"
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 5. 删除食品
**DELETE** `/foods/{food_id}`

根据ID删除单个食品。

**认证**: 需要Bearer Token

**路径参数**:
- `food_id`: 食品ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": "2025-11-27 13:44:02"
}

## 饭店管理接口

### 1. 创建饭店
**POST** `/enjoys/`

创建新的饭店记录。

**认证**: 需要Bearer Token

**请求参数**:
```json
{
  "title": "老川菜馆",
  "content": "正宗川菜，环境优雅，服务周到",
  "cover": "https://example.com/enjoys/sichuan-restaurant.jpg",
  "images": [
    "https://example.com/enjoys/sichuan-restaurant-1.jpg",
    "https://example.com/enjoys/sichuan-restaurant-2.jpg"
  ],
  "tags": ["川菜", "正宗", "环境优雅", "服务周到"],
  "star": 4.5,
  "maker": "美食推荐官",
  "flavor": "麻辣",
  "location": "北京市朝阳区建国路88号",
  "price_per_person": 120,
  "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼"]
}
```

**参数说明**：
- `title` (必填): 饭店名称
- `content` (可选): 饭店介绍/就餐体验/评价
- `cover` (可选): 饭店封面图/招牌菜图片URL
- `images` (可选): 菜品图/店内环境图URL集合
- `tags` (可选): 标签数组
- `star` (可选): 评分(1-5之间的数值)
- `maker` (必填): 推荐来源/推荐人
- `flavor` (可选): 主打口味
- `location` (必填): 饭店详细地址
- `price_per_person` (可选): 人均消费(元)
- `recommend_dishes` (可选): 推荐菜品/招牌菜

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 201,
  "msg": "饭店创建成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "老川菜馆",
    "content": "正宗川菜，环境优雅，服务周到",
    "cover": "https://example.com/enjoys/sichuan-restaurant.jpg",
    "images": ["https://example.com/enjoys/sichuan-restaurant-1.jpg"],
    "tags": ["川菜", "正宗"],
    "star": 4.5,
    "maker": "美食推荐官",
    "flavor": "麻辣",
    "location": "北京市朝阳区建国路88号",
    "price_per_person": 120,
    "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼"],
    "created_by": "1",
    "updated_by": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": "2024-01-01T00:00:00"
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 2. 获取饭店列表
**GET** `/enjoys/`

获取饭店记录列表，支持分页和多种条件查询。

**查询参数**:
- `page` (可选): 页码，从1开始，默认1
- `count` (可选): 每页数量，默认10
- `title` (可选): 标题模糊查询
- `location` (可选): 地址模糊查询
- `maker` (可选): 推荐来源精确查询
- `min_star` (可选): 最低评分，支持小数
- `max_star` (可选): 最高评分，支持小数
- `flavor` (可选): 口味精确查询
- `tag` (可选): 标签包含查询

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取饭店列表成功",
  "data": {
    "enjoys": [
      {
        "id": "6562c5a5b1d4e3f2e4a1b2c3",
        "title": "老川菜馆",
        "content": "正宗川菜，环境优雅，服务周到",
        "cover": "https://example.com/enjoys/sichuan-restaurant.jpg",
        "images": [],
        "tags": ["川菜", "正宗"],
        "star": 4.5,
        "maker": "美食推荐官",
        "flavor": "麻辣",
        "location": "北京市朝阳区建国路88号",
        "price_per_person": 120,
        "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼"],
        "created_by": "1",
        "updated_by": "1",
        "create_time": "2024-01-01T00:00:00",
        "update_time": "2024-01-01T00:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "count": 10
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 3. 获取单个饭店
**GET** `/enjoys/{enjoy_id}`

根据ID获取单个饭店的详细信息。

**路径参数**:
- `enjoy_id`: 饭店ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取饭店成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "老川菜馆",
    "content": "正宗川菜，环境优雅，服务周到",
    "cover": "https://example.com/enjoys/sichuan-restaurant.jpg",
    "images": ["https://example.com/enjoys/sichuan-restaurant-1.jpg"],
    "tags": ["川菜", "正宗", "环境优雅", "服务周到"],
    "star": 4.5,
    "maker": "美食推荐官",
    "flavor": "麻辣",
    "location": "北京市朝阳区建国路88号",
    "price_per_person": 120,
    "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼"],
    "created_by": "1",
    "updated_by": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": "2024-01-01T12:00:00"
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 4. 更新饭店
**PUT** `/enjoys/{enjoy_id}`

根据ID更新单个饭店的信息。

**认证**: 需要Bearer Token

**路径参数**:
- `enjoy_id`: 饭店ID

**请求参数**:
```json
{
  "title": "正宗老川菜馆",
  "content": "正宗川菜，环境优雅，服务周到，新增特色菜品",
  "star": 5,
  "price_per_person": 130,
  "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼", "夫妻肺片"]
}
```

**说明**: 只需要提供需要更新的字段，未提供的字段保持不变。

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "更新成功",
  "data": {
    "id": "6562c5a5b1d4e3f2e4a1b2c3",
    "title": "正宗老川菜馆",
    "content": "正宗川菜，环境优雅，服务周到，新增特色菜品",
    "cover": "https://example.com/enjoys/sichuan-restaurant.jpg",
    "images": ["https://example.com/enjoys/sichuan-restaurant-1.jpg"],
    "tags": ["川菜", "正宗", "环境优雅", "服务周到"],
    "star": 5,
    "maker": "美食推荐官",
    "flavor": "麻辣",
    "location": "北京市朝阳区建国路88号",
    "price_per_person": 130,
    "recommend_dishes": ["宫保鸡丁", "麻婆豆腐", "水煮鱼", "夫妻肺片"],
    "created_by": "1",
    "updated_by": "1",
    "create_time": "2024-01-01T00:00:00",
    "update_time": "2024-01-02T10:00:00"
  },
  "timestamp": "2025-11-27 13:44:02"
}
```

### 5. 删除饭店
**DELETE** `/enjoys/{enjoy_id}`

根据ID删除单个饭店。

**认证**: 需要Bearer Token

**路径参数**:
- `enjoy_id`: 饭店ID

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "删除成功",
  "data": null,
  "timestamp": "2025-11-27 13:44:02"
}
```

## LLM管理接口

### 1. 生成文本（非流式）
**POST** `/llm/generate`

使用大语言模型生成文本，非流式输出。

**请求参数**:
```json
{
  "model": "deepseek-r1:1.5b",
  "prompt": "请介绍一下人工智能的发展历史",
  "stream": false,
  "temperature": 0.8,
  "top_p": 0.9,
  "max_tokens": 500,
  "num_ctx": 2048
}
```

**参数说明**：
- `model` (必填): 模型名称，如 deepseek-r1:1.5b
- `prompt` (必填): 输入提示词
- `stream` (可选): 是否流式输出，默认false
- `temperature` (可选): 控制随机性，0-2，默认0.8
- `top_p` (可选): 核采样参数，0-1，默认0.9
- `max_tokens` (可选): 最大生成token数，默认500
- `num_ctx` (可选): 上下文窗口大小，默认2048

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "文本生成成功",
  "data": {
    "response": "人工智能的发展历史可以追溯到20世纪50年代...",
    "model": "deepseek-r1:1.5b",
    "done": true,
    "context": [1, 2, 3, 4, 5],
    "total_duration": 1234567890,
    "load_duration": 12345678,
    "prompt_eval_count": 10,
    "eval_count": 50
  },
  "timestamp": "2025-01-14 10:00:00.000"
}
```

### 2. 生成文本（流式）
**POST** `/llm/generate/stream`

使用大语言模型生成文本，流式输出。

**请求参数**: 与非流式生成相同

**响应**: 返回流式文本，Content-Type为text/plain

**说明**: 流式响应会实时返回生成的文本片段，适合需要实时展示生成过程的场景。

### 3. 对话模式（非流式）
**POST** `/llm/chat`

使用大语言模型进行对话，非流式输出。

**请求参数**:
```json
{
  "model": "deepseek-r1:1.5b",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的AI助手"
    },
    {
      "role": "user",
      "content": "你好，请介绍一下你自己"
    }
  ],
  "stream": false,
  "temperature": 0.8,
  "top_p": 0.9,
  "max_tokens": 500,
  "num_ctx": 2048
}
```

**参数说明**：
- `model` (必填): 模型名称
- `messages` (必填): 对话消息列表，每条消息包含role和content
  - `role`: 消息角色，可选值为 system、user、assistant
  - `content`: 消息内容
- 其他参数与文本生成相同

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "对话成功",
  "data": {
    "message": {
      "role": "assistant",
      "content": "你好！我是一个AI助手，可以帮助你解答问题..."
    },
    "model": "deepseek-r1:1.5b",
    "done": true,
    "total_duration": 1234567890,
    "load_duration": 12345678,
    "prompt_eval_count": 15,
    "eval_count": 60
  },
  "timestamp": "2025-01-14 10:00:00.000"
}
```

### 4. 对话模式（流式）
**POST** `/llm/chat/stream`

使用大语言模型进行对话，流式输出。

**请求参数**: 与非流式对话相同

**响应**: 返回流式文本，Content-Type为text/plain

**说明**: 流式响应会实时返回生成的对话内容，适合需要实时展示对话过程的场景。

### 5. 获取可用模型列表
**GET** `/llm/models`

获取当前可用的所有大语言模型列表。

**响应示例**:
```json
{
  "code": "000000",
  "statusCode": 200,
  "msg": "获取模型列表成功",
  "data": {
    "models": [
      {
        "name": "deepseek-r1:1.5b",
        "modified_at": "2025-01-01T00:00:00.000000Z",
        "size": 1073741824,
        "digest": "sha256:abc123...",
        "details": {
          "format": "gguf",
          "family": "deepseek",
          "families": ["deepseek"],
          "parameter_size": "1.5B",
          "quantization_level": "Q4_0"
        }
      },
      {
        "name": "llama2:7b",
        "modified_at": "2025-01-01T00:00:00.000000Z",
        "size": 4294967296,
        "digest": "sha256:def456...",
        "details": {
          "format": "gguf",
          "family": "llama",
          "families": ["llama"],
          "parameter_size": "7B",
          "quantization_level": "Q4_0"
        }
      }
    ],
    "total": 2
  },
  "timestamp": "2025-01-14 10:00:00.000"
}
```

### LLM接口测试示例

#### 生成文本
```bash
curl -X POST "http://localhost:8000/api/v1/llm/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1:1.5b",
    "prompt": "请介绍一下Python编程语言",
    "temperature": 0.8
  }'
```

#### 对话
```bash
curl -X POST "http://localhost:8000/api/v1/llm/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1:1.5b",
    "messages": [
      {
        "role": "user",
        "content": "你好，请帮我写一个快速排序算法"
      }
    ]
  }'
```

#### 获取模型列表
```bash
curl -X GET "http://localhost:8000/api/v1/llm/models"
```

#### 流式生成文本
```bash
curl -X POST "http://localhost:8000/api/v1/llm/generate/stream" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1:1.5b",
    "prompt": "请写一首关于春天的诗"
  }'
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