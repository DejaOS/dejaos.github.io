# dxSqliteDB

## 1. Overview

`dxSqliteDB` module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for SQLite database operations with multi-instance and thread-safe capabilities.

This module provides a **multi-instance, thread-safe interface to SQLite databases**. It manages database connections by their file path, allowing different parts of an application, including different threads, to safely access and manipulate the same database file without manual locking.

**Key Features:**
- Multi-instance database management based on file paths
- Thread-safe operations using a serialized transaction model
- Cross-thread coordination through global registry
- Automatic database file creation and path management
- Full SQLite functionality including transactions, CRUD operations, and data type support
- Performance optimized for high-volume operations

## 2. Files

- `dxSqliteDB.js` - JavaScript module wrapper
- `libvbar-m-dxsqlitedb.so` - Underlying C++ language implementation

> Ensure both files are included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- **dxMap**: For cross-thread registry management
- **dxLogger**: For error logging and debugging
- **dxStd**: For file system operations

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. API Reference

### `dxSqliteDB.init(path)`

This is the core function of the module. It initializes and returns a database instance for a given file path.

- `path` `{string}`: **(Required)** The full, absolute path to the database file. This path is used as the unique identifier.
- **Returns**: `{SqliteDB_base_class}` The database instance object with methods for database operations.
- **Throws**: `Error` if the 'path' is missing or empty, or if the underlying database connection fails.

**Thread Safety**: This function is safe to call multiple times with the same path from any thread. It will return cached instances when appropriate.

### Database Instance Methods

Each database instance returned by `dxSqliteDB.init(path)` provides the following methods:

#### `instance.exec(sql)`
Executes a non-query SQL statement (e.g., CREATE, INSERT, UPDATE, DELETE).

- `sql` `{string}`: **(Required)** The SQL statement to execute.
- **Returns**: `{void}` No return value.
- **Throws**: `Error` on SQL execution failure.

#### `instance.select(sql)`
Executes a query SQL statement (SELECT) and returns an array of result objects.

- `sql` `{string}`: **(Required)** The SELECT SQL statement to execute.
- **Returns**: `{object[]}` An array of result objects, where each object represents a row with column names as keys.
- **Throws**: `Error` on SQL execution failure.

#### `instance.begin()`
Begins a new transaction.

- **Returns**: `{void}` No return value.
- **Throws**: `Error` if a transaction is already in progress.

#### `instance.commit()`
Commits the current transaction.

- **Returns**: `{void}` No return value.
- **Throws**: `Error` if no transaction is in progress or on commit failure.

#### `instance.rollback()`
Rolls back the current transaction.

- **Returns**: `{void}` No return value.
- **Throws**: `Error` if no transaction is in progress or on rollback failure.

### `dxSqliteDB.deinit(path)`

Closes the database connection for the current thread.

- `path` `{string}`: The path of the database instance to deinitialize.
- **Returns**: `{void}` No return value.
- **Note**: This is a thread-local operation and does not affect the global registry.

## 6. Usage Examples

```javascript
import dxSqliteDB from 'dxmodules/dxSqliteDB.js';
import * as log from 'dxmodules/dxLogger.js';

const DB_PATH = '/app/code/data/myapp.db';

// 1. Initialize database and create table
log.info("\n=== Database Initialization ===");
const db = dxSqliteDB.init(DB_PATH);
db.exec('DROP TABLE IF EXISTS users');
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        age INTEGER,
        created_at INTEGER
    )
`);
log.info('Database initialized and table created');

// 2. Basic CRUD operations
log.info("\n=== CRUD Operations ===");

// Insert data
db.exec("INSERT INTO users (name, email, age, created_at) VALUES ('Alice', 'alice@example.com', 25, " + Date.now() + ")");
db.exec("INSERT INTO users (name, email, age, created_at) VALUES ('Bob', 'bob@example.com', 30, " + Date.now() + ")");

// Query data
const users = db.select('SELECT * FROM users');
log.info('All users:', users);
// Output: [{ id: 1, name: 'Alice', email: 'alice@example.com', age: 25, created_at: 1678886400000 }, ...]

// Update data
db.exec("UPDATE users SET age = 26 WHERE name = 'Alice'");
const alice = db.select("SELECT * FROM users WHERE name = 'Alice'")[0];
log.info('Updated Alice:', alice);

// Delete data
db.exec("DELETE FROM users WHERE name = 'Bob'");
const remainingUsers = db.select('SELECT * FROM users');
log.info('Remaining users:', remainingUsers);

// 3. Transaction management
log.info("\n=== Transaction Management ===");
db.begin();
try {
    db.exec("INSERT INTO users (name, email, age, created_at) VALUES ('Charlie', 'charlie@example.com', 35, " + Date.now() + ")");
    db.exec("INSERT INTO users (name, email, age, created_at) VALUES ('Diana', 'diana@example.com', 28, " + Date.now() + ")");
    db.commit();
    log.info('Transaction committed successfully');
} catch (e) {
    db.rollback();
    log.error('Transaction rolled back due to error:', e.message);
}

// 4. Data type handling
log.info("\n=== Data Type Handling ===");
db.exec('DROP TABLE IF EXISTS datatypes');
db.exec('CREATE TABLE datatypes (k TEXT, v_int INTEGER, v_real REAL, v_text TEXT, v_null TEXT)');
db.exec("INSERT INTO datatypes VALUES ('key1', 123, 45.67, 'hello', NULL)");

const result = db.select('SELECT * FROM datatypes')[0];
log.info('Data type test result:', result);
// Output: { k: 'key1', v_int: 123, v_real: 45.67, v_text: 'hello', v_null: null }

// 5. Performance testing with bulk operations
log.info("\n=== Performance Test ===");
const NUM_RECORDS = 10000;
log.info(`Inserting ${NUM_RECORDS} records...`);

db.exec('DROP TABLE IF EXISTS perf_test');
db.exec('CREATE TABLE perf_test (id INTEGER PRIMARY KEY, data TEXT)');

const startTime = Date.now();
db.begin();
for (let i = 0; i < NUM_RECORDS; i++) {
    db.exec(`INSERT INTO perf_test (id, data) VALUES (${i}, 'test_data_${i}')`);
}
db.commit();
const endTime = Date.now();

log.info(`Inserted ${NUM_RECORDS} records in ${(endTime - startTime) / 1000} seconds`);

// 6. Cleanup
dxSqliteDB.deinit(DB_PATH);
log.info('Database connection closed');
```

## 7. Threading Model

The module handles cross-thread coordination through a sophisticated architecture:

### Thread Safety Features:
- **Serialized Transaction Model**: Uses a C++ layer that ensures database operations are serialized, preventing race conditions
- **Global Registry**: Leverages `dxMap` to maintain a cross-thread registry of initialized database paths
- **Thread-Local Caching**: Each thread maintains its own cache of database instances
- **Automatic Coordination**: Multiple threads can safely access the same database file without manual synchronization

### How It Works:
1. **First Initialization**: When `init(path)` is called for the first time in any thread, the path is registered globally
2. **Subsequent Calls**: Other threads calling `init(path)` with the same path get new local instances connected to the shared database file
3. **Resource Management**: Each thread manages its own database connections independently
4. **Automatic Cleanup**: `deinit(path)` only affects the current thread's connection

## 8. Data Type Support

The module fully supports all SQLite data types:

### Supported Types:
- **INTEGER**: 64-bit signed integers
- **REAL**: 64-bit floating point numbers
- **TEXT**: Variable-length text strings
- **BLOB**: Binary large objects
- **NULL**: Null values

### JavaScript Type Mapping:
- Numbers are automatically mapped to INTEGER or REAL based on their value
- Strings are mapped to TEXT
- Objects and arrays can be stored as JSON strings in TEXT fields
- Null values are properly handled
## 9. Related Modules

`dxSqliteDB` is the replacement for the `dxSqlite` module. `dxSqlite` is being gradually phased out - please use `dxSqliteDB` in new projects.

## 10. Demo
None
