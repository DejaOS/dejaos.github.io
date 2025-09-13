# dxSqliteDB

## 1. 概述

`dxSqliteDB` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于具有多实例和线程安全功能的 SQLite 数据库操作。

此模块提供**多实例、线程安全的 SQLite 数据库接口**。它通过文件路径管理数据库连接，允许应用程序的不同部分（包括不同线程）安全地访问和操作同一个数据库文件，而无需手动锁定。

**主要特性：**
- 基于文件路径的多实例数据库管理
- 使用序列化事务模型的线程安全操作
- 通过全局注册表进行跨线程协调
- 自动数据库文件创建和路径管理
- 完整的 SQLite 功能，包括事务、CRUD 操作和数据类型支持
- 针对高容量操作进行性能优化

## 2. 文件

- `dxSqliteDB.js` - JavaScript 模块包装器
- `libvbar-m-dxsqlitedb.so` - 底层 C++ 语言实现

> 确保这两个文件都包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- **dxMap**: 用于跨线程注册表管理
- **dxLogger**: 用于错误日志记录和调试
- **dxStd**: 用于文件系统操作

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### `dxSqliteDB.init(path)`

这是模块的核心函数。它初始化并返回给定文件路径的数据库实例。

- `path` `{string}`: **（必需）** 数据库文件的完整绝对路径。此路径用作唯一标识符。
- **返回值**: `{SqliteDB_base_class}` 具有数据库操作方法的数据库实例对象。
- **抛出**: 如果 'path' 缺失或为空，或底层数据库连接失败则抛出 `Error`。

**线程安全**: 此函数可以安全地从任何线程多次调用相同路径，在适当时会返回缓存的实例。

### 数据库实例方法

由 `dxSqliteDB.init(path)` 返回的每个数据库实例提供以下方法：

#### `instance.exec(sql)`
执行非查询 SQL 语句（例如，CREATE、INSERT、UPDATE、DELETE）。

- `sql` `{string}`: **（必需）** 要执行的 SQL 语句。
- **返回值**: `{void}` 无返回值。
- **抛出**: SQL 执行失败时抛出 `Error`。

#### `instance.select(sql)`
执行查询 SQL 语句（SELECT）并返回结果对象数组。

- `sql` `{string}`: **（必需）** 要执行的 SELECT SQL 语句。
- **返回值**: `{object[]}` 结果对象数组，其中每个对象代表一行，列名作为键。
- **抛出**: SQL 执行失败时抛出 `Error`。

#### `instance.begin()`
开始新事务。

- **返回值**: `{void}` 无返回值。
- **抛出**: 如果事务已在进行中则抛出 `Error`。

#### `instance.commit()`
提交当前事务。

- **返回值**: `{void}` 无返回值。
- **抛出**: 如果没有进行中的事务或提交失败则抛出 `Error`。

#### `instance.rollback()`
回滚当前事务。

- **返回值**: `{void}` 无返回值。
- **抛出**: 如果没有进行中的事务或回滚失败则抛出 `Error`。

### `dxSqliteDB.deinit(path)`

关闭当前线程的数据库连接。

- `path` `{string}`: 要反初始化的数据库实例路径。
- **返回值**: `{void}` 无返回值。
- **注意**: 这是线程本地操作，不影响全局注册表。

## 6. 使用示例

```javascript
import dxSqliteDB from "dxmodules/dxSqliteDB.js";
import * as log from "dxmodules/dxLogger.js";

const DB_PATH = "/app/code/data/myapp.db";

// 1. 初始化数据库并创建表
log.info("\n=== 数据库初始化 ===");
const db = dxSqliteDB.init(DB_PATH);
db.exec("DROP TABLE IF EXISTS users");
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        age INTEGER,
        created_at INTEGER
    )
`);
log.info("数据库已初始化并创建表");

// 2. 基本 CRUD 操作
log.info("\n=== CRUD 操作 ===");

// 插入数据
db.exec(
  "INSERT INTO users (name, email, age, created_at) VALUES ('Alice', 'alice@example.com', 25, " +
    Date.now() +
    ")"
);
db.exec(
  "INSERT INTO users (name, email, age, created_at) VALUES ('Bob', 'bob@example.com', 30, " +
    Date.now() +
    ")"
);

// 查询数据
const users = db.select("SELECT * FROM users");
log.info("所有用户:", users);
// 输出: [{ id: 1, name: 'Alice', email: 'alice@example.com', age: 25, created_at: 1678886400000 }, ...]

// 更新数据
db.exec("UPDATE users SET age = 26 WHERE name = 'Alice'");
const alice = db.select("SELECT * FROM users WHERE name = 'Alice'")[0];
log.info("更新后的 Alice:", alice);

// 删除数据
db.exec("DELETE FROM users WHERE name = 'Bob'");
const remainingUsers = db.select("SELECT * FROM users");
log.info("剩余用户:", remainingUsers);

// 3. 事务管理
log.info("\n=== 事务管理 ===");
db.begin();
try {
  db.exec(
    "INSERT INTO users (name, email, age, created_at) VALUES ('Charlie', 'charlie@example.com', 35, " +
      Date.now() +
      ")"
  );
  db.exec(
    "INSERT INTO users (name, email, age, created_at) VALUES ('Diana', 'diana@example.com', 28, " +
      Date.now() +
      ")"
  );
  db.commit();
  log.info("事务提交成功");
} catch (e) {
  db.rollback();
  log.error("由于错误回滚事务:", e.message);
}

// 4. 数据类型处理
log.info("\n=== 数据类型处理 ===");
db.exec("DROP TABLE IF EXISTS datatypes");
db.exec(
  "CREATE TABLE datatypes (k TEXT, v_int INTEGER, v_real REAL, v_text TEXT, v_null TEXT)"
);
db.exec("INSERT INTO datatypes VALUES ('key1', 123, 45.67, 'hello', NULL)");

const result = db.select("SELECT * FROM datatypes")[0];
log.info("数据类型测试结果:", result);
// 输出: { k: 'key1', v_int: 123, v_real: 45.67, v_text: 'hello', v_null: null }

// 5. 批量操作性能测试
log.info("\n=== 性能测试 ===");
const NUM_RECORDS = 10000;
log.info(`插入 ${NUM_RECORDS} 条记录...`);

db.exec("DROP TABLE IF EXISTS perf_test");
db.exec("CREATE TABLE perf_test (id INTEGER PRIMARY KEY, data TEXT)");

const startTime = Date.now();
db.begin();
for (let i = 0; i < NUM_RECORDS; i++) {
  db.exec(`INSERT INTO perf_test (id, data) VALUES (${i}, 'test_data_${i}')`);
}
db.commit();
const endTime = Date.now();

log.info(
  `在 ${(endTime - startTime) / 1000} 秒内插入了 ${NUM_RECORDS} 条记录`
);

// 6. 清理
dxSqliteDB.deinit(DB_PATH);
log.info("数据库连接已关闭");
```

## 7. 线程模型

该模块通过复杂的架构处理跨线程协调：

### 线程安全特性：
- **序列化事务模型**: 使用 C++ 层确保数据库操作被序列化，防止竞态条件
- **全局注册表**: 利用 `dxMap` 维护已初始化数据库路径的跨线程注册表
- **线程本地缓存**: 每个线程维护自己的数据库实例缓存
- **自动协调**: 多个线程可以安全地访问同一个数据库文件，无需手动同步

### 工作原理：
1. **首次初始化**: 当在任何线程中首次调用 `init(path)` 时，路径被全局注册
2. **后续调用**: 其他线程使用相同路径调用 `init(path)` 会获得连接到共享数据库文件的新本地实例
3. **资源管理**: 每个线程独立管理自己的数据库连接
4. **自动清理**: `deinit(path)` 只影响当前线程的连接

## 8. 数据类型支持

该模块完全支持所有 SQLite 数据类型：

### 支持的类型：
- **INTEGER**: 64 位有符号整数
- **REAL**: 64 位浮点数
- **TEXT**: 可变长度文本字符串
- **BLOB**: 二进制大对象
- **NULL**: 空值

### JavaScript 类型映射：
- 数字根据其值自动映射到 INTEGER 或 REAL
- 字符串映射到 TEXT
- 对象和数组可以作为 JSON 字符串存储在 TEXT 字段中
- 空值得到正确处理

## 9. 相关模块

`dxSqliteDB` 是 `dxSqlite` 模块的替代品。`dxSqlite` 正在逐渐被淘汰 - 请在新项目中使用 `dxSqliteDB`。

## 10. 演示

无