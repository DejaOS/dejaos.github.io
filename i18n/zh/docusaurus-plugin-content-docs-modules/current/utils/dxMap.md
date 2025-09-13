# dxMap

## 1. 概述

`dxMap` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于基于主题命名空间的内存键值存储。

该模块提供**线程安全、基于主题的内存存储系统**。每个主题都是键的独立命名空间，允许多个 JavaScript 线程安全地访问和修改数据而不会发生冲突。

**主要特性：**

- 基于主题的键值存储，具有自动命名空间隔离
- 多线程环境的线程安全操作
- 各种数据类型的自动序列化/反序列化
- 支持字符串、数字、布尔值、对象和数组数据类型
- 内存高效存储，具有自动清理功能
- 简单直观的 API 设计

## 2. 文件

- `dxMap.js` - JavaScript 模块包装器
- `libvbar-m-dxmap.so` - 底层 C 语言实现

> 确保两个文件都包含在项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### `map.get(topicName)`

这是模块的核心函数。它返回特定主题命名空间的映射实例。

- `topicName` `{string}`: **（必需）** 主题命名空间的名称。不能为 null 或空。
- **返回**: 一个映射实例对象，具有在指定主题内管理数据的方法。
- **抛出**: 如果主题名称为 null 或空，则抛出 `Error`。

### 映射实例方法

由 `map.get(topicName)` 返回的每个映射实例提供以下方法：

#### `instance.put(key, value)`

在当前主题内插入或更新键值对。

- `key` `{string}`: **（必需）** 要设置的键。不能为 null 或空。
- `value` `{*}`: 与键关联的值。支持的类型：字符串、数字、布尔值、对象、数组。不支持函数。
- **返回**: `{boolean}` 成功时返回 `true`。
- **抛出**: 如果键为 null 或空，或值为函数，则抛出 `Error`。
- **特殊行为**: 如果 `value` 是 `null` 或 `undefined`，键将被自动删除。

#### `instance.get(key)`

在当前主题内检索与键关联的值。

- `key` `{string}`: **（必需）** 要检索的键。不能为 null 或空。
- **返回**: 与键关联的值，如果键不存在则返回 `undefined`。
- **抛出**: 如果键为 null 或空，则抛出 `Error`。
- **注意**: 返回值会自动反序列化为原始类型。

#### `instance.has(key)`

检查键是否在当前主题内存在。

- `key` `{string}`: **（必需）** 要检查的键。不能为 null 或空。
- **返回**: `{boolean}` 如果键存在则返回 `true`，否则返回 `false`。
- **抛出**: 如果键为 null 或空，则抛出 `Error`。

#### `instance.del(key)`

从当前主题中删除键值对。

- `key` `{string}`: **（必需）** 要删除的键。不能为 null 或空。
- **返回**: `{boolean}` 如果找到并删除键则返回 `true`，否则返回 `false`。
- **抛出**: 如果键为 null 或空，则抛出 `Error`。

#### `instance.keys()`

检索当前主题内的所有键。

- **返回**: `{string[]}` 主题的所有键的数组。如果主题为空或不存在，则返回空数组。

#### `instance.destroy()`

销毁整个主题，删除其所有键并释放关联的内存。

- **返回**: `{boolean}` 成功时返回 `true`。
- **警告**: 调用 destroy 后，不应再使用该实例。

## 6. 使用示例

```javascript
import map from "dxmodules/dxMap.js";
import * as log from "dxmodules/dxLogger.js";

// 1. 获取 'user' 主题的映射实例
log.info("\n=== User Topic ===");
const userMap = map.get("user");

// 2. 存储各种数据类型
userMap.put("name", "John Doe");
userMap.put("age", 30);
userMap.put("isActive", true);
userMap.put("roles", ["admin", "editor"]);
userMap.put("profile", { email: "john@example.com", lastLogin: "2024-01-01" });

// 3. 检索数据
log.info("Name:", userMap.get("name")); // "John Doe"
log.info("Age:", userMap.get("age")); // 30
log.info("Is Active:", userMap.get("isActive")); // true
log.info("Roles:", userMap.get("roles")); // ['admin', 'editor']
log.info("Profile:", userMap.get("profile")); // { email: 'john@example.com', lastLogin: '2024-01-01' }

// 4. 检查键是否存在
log.info("Has name:", userMap.has("name")); // true
log.info("Has email:", userMap.has("email")); // false

// 5. 获取所有键
log.info("All keys:", userMap.keys()); // ['name', 'age', 'isActive', 'roles', 'profile']

// 6. 删除键
userMap.del("isActive");
log.info("After deletion - has isActive:", userMap.has("isActive")); // false

// 7. 设置 null/undefined 来删除（特殊行为）
userMap.put("age", null); // 这会自动删除 'age' 键
log.info("After setting null - has age:", userMap.has("age")); // false

// 8. 为不同数据创建另一个主题
log.info("\n=== Settings Topic ===");
const settingsMap = map.get("settings");
settingsMap.put("theme", "dark");
settingsMap.put("language", "en");
settingsMap.put("notifications", true);

log.info("Settings keys:", settingsMap.keys()); // ['theme', 'language', 'notifications']
log.info("Theme:", settingsMap.get("theme")); // "dark"

// 9. 完成后清理
settingsMap.destroy(); // 销毁设置主题
log.info("After destroy - settings keys:", settingsMap.keys()); // []
```

## 7. 数据类型支持

该模块自动处理以下数据类型的序列化和反序列化：

### 支持的类型：

- **String**: 按原样存储
- **Number**: 使用 `#n#` 前缀存储（例如 `#n#42`、`#n#3.14`）
- **Boolean**: 使用 `#b#` 前缀存储（例如 `#b#true`、`#b#false`）
- **Array**: 使用 `#a#` 前缀和 JSON 序列化存储（例如 `#a#["item1","item2"]`）
- **Object**: 使用 `#o#` 前缀和 JSON 序列化存储（例如 `#o#{"key":"value"}`）

### 不支持的类型：

- **Function**: 如果尝试存储则抛出错误
- **null/undefined**: 设置时自动删除键

## 8. 线程安全

该模块设计为线程安全，允许多个 JavaScript 线程安全地：

- 同时访问同一主题
- 在同一主题内修改数据
- 独立创建和销毁主题

每个主题在其自己的命名空间中运行，防止应用程序不同部分之间的键冲突。

## 9. 演示

无
