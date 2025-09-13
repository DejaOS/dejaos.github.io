# dxStd

## 1. 概述

此模块为 DejaOS 提供全面的标准库，包装和扩展内置的 `os` 和 `std` 模块。它提供与操作系统交互的统一接口，包括文件 I/O、定时器、环境变量、线程等。它旨在为常见系统级任务提供更高级、更便捷的 API。

## 2. 文件

- `dxStd.js`

> - 确保此文件包含在您项目根目录下的 dxmodules 子目录中。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 基本用法

```javascript
import dxstd from "./dxmodules/dxStd.js";

// --- 文件操作 ---
const filePath = "/app/data/greeting.txt";
const content = "Hello from dxStd!";

// 将内容保存到文件
dxstd.saveFile(filePath, content);
log.info("文件已保存。");

// 检查文件是否存在
if (dxstd.exist(filePath)) {
  // 从文件加载内容
  const loadedContent = dxstd.loadFile(filePath);
  log.info("文件内容:", loadedContent);
}

// 清理文件
dxstd.remove(filePath);
log.info("文件已删除。");

// --- 定时器 ---
log.info("设置 1 秒超时。");
dxstd.setTimeout(() => {
  log.info("超时触发！");
}, 1000);

// --- 工具 ---
const randomString = dxstd.genRandomStr(8);
log.info("生成的随机字符串:", randomString);
```

## 6. API 参考

### 进程管理

#### `dxstd.exit(n)`
退出应用程序。
- **参数：**
  - `n` (number): 退出代码。
- **返回值：** `void`

### 定时器

#### `dxstd.setTimeout(func, delay)`
启动定时器以在延迟后异步执行函数。
- **参数：**
  - `func` (function): 要执行的函数。
  - `delay` (number): 延迟时间（毫秒）。
- **返回值：** (any): 可与 `clearTimeout` 一起使用的定时器句柄。

#### `dxstd.clearTimeout(handle)`
清除由 `setTimeout` 创建的指定定时器。
- **参数：**
  - `handle` (any): `setTimeout` 返回的定时器句柄。
- **返回值：** `void`

#### `dxstd.setInterval(callback, interval, once)`
设置重复定时器。
- **参数：**
  - `callback` (function): 要重复调用的函数。
  - `interval` (number): 间隔时间（毫秒）。
  - `once` (boolean, 可选): 如果为 true，在创建后立即执行一次回调。
- **返回值：** (string): 此间隔的唯一定时器 ID，可与 `clearInterval` 一起使用。

#### `dxstd.clearInterval(timerId)`
清除由 `setInterval` 创建的间隔定时器。
- **参数：**
  - `timerId` (string): 要清除的定时器 ID。
- **返回值：** `void`

#### `dxstd.clearIntervalAll()`
清除当前线程中创建的所有间隔定时器。

#### `dxstd.sleep(delay_ms)`
暂停执行指定的毫秒数。
- **参数：**
  - `delay_ms` (number): 延迟时间（毫秒）。
- **返回值：** `void`

### 文件系统

#### 常量
- **文件打开标志：** `O_RDONLY`、`O_WRONLY`、`O_RDWR`、`O_APPEND`、`O_CREAT`、`O_EXCL`、`O_TRUNC`。
- **文件查找标志：** `SEEK_SET`、`SEEK_CUR`、`SEEK_END`。
- **文件模式标志：** `S_IFMT`、`S_IFIFO`、`S_IFCHR`、`S_IFDIR`、`S_IFBLK`、`S_IFREG`、`S_IFSOCK`、`S_IFLNK`、`S_ISGID`、`S_ISUID`。

#### `dxstd.saveFile(filename, content, sync)`
将字符串保存到文件。如果目录路径不存在则创建。
- **参数：**
  - `filename` (string): 文件的绝对路径。
  - `content` (string): 要保存的字符串内容。
  - `sync` (boolean, 可选, 默认: `true`): 如果为 true，执行系统级同步以将所有文件系统缓冲区刷新到磁盘。
- **返回值：** (boolean): 成功时为 `true`。

#### `dxstd.loadFile(filename)`
将文件内容作为 UTF-8 字符串加载。
- **参数：**
  - `filename` (string): 文件名。
- **返回值：** (string): 文件内容。

#### `dxstd.saveBinaryFile(filename, data, offset, length, sync)`
将二进制数据（ArrayBuffer 或 Uint8Array）保存到文件。
- **参数：**
  - `filename` (string): 文件的绝对路径。
  - `data` (ArrayBuffer|Uint8Array): 要保存的二进制数据。
  - `offset` (number, 可选, 默认: `0`): 数据中开始写入的字节偏移量。
  - `length` (number, 可选, 默认: `data.byteLength - offset`): 要写入的字节数。
  - `sync` (boolean, 可选, 默认: `true`): 如果为 true，执行系统级同步。
- **返回值：** (boolean): 成功时为 `true`。

#### `dxstd.loadBinaryFile(filename, offset, length)`
将文件的部分或全部内容作为二进制数据加载到 `Uint8Array` 中。
- **参数：**
  - `filename` (string): 文件的绝对路径。
  - `offset` (number, 可选, 默认: `0`): 文件中开始读取的字节偏移量。
  - `length` (number, 可选): 要读取的字节数。默认为从偏移量读取到文件末尾。
- **返回值：** (Uint8Array): 包含文件二进制数据的 `Uint8Array`。

#### `dxstd.open(filename, flags)`
打开文件并返回文件描述符。
- **参数：**
  - `filename` (string): 文件的绝对路径。
  - `flags` (number): 文件打开标志的按位或（例如，`dxstd.O_RDWR | dxstd.O_CREAT`）。
- **返回值：** (number): 文件描述符句柄，或错误时 < 0 的值。

#### `dxstd.close(fd)`
关闭文件描述符。
- **参数：**
  - `fd` (number): 文件描述符句柄。
- **返回值：** (number): 成功时为 0，失败时为 -errno。

#### `dxstd.read(fd, buffer, offset, length)`
从文件描述符 `fd` 读取 `length` 字节到 `ArrayBuffer` 中。
- **参数：**
  - `fd` (number): 文件描述符句柄。
  - `buffer` (ArrayBuffer): 要读取到的 `ArrayBuffer`。
  - `offset` (number): 缓冲区中开始写入的偏移量。
  - `length` (number): 要读取的字节数。
- **返回值：** (number): 读取的字节数，或错误时 < 0 的值。

#### `dxstd.write(fd, buffer, offset, length)`
将 `ArrayBuffer` 中的 `length` 字节写入文件描述符。
- **参数：**
  - `fd` (number): 文件描述符句柄。
  - `buffer` (ArrayBuffer): 要写入的 `ArrayBuffer`。
  - `offset` (number): 缓冲区中开始读取的偏移量。
  - `length` (number): 要写入的字节数。
- **返回值：** (number): 写入的字节数，或错误时 < 0 的值。

#### `dxstd.seek(fd, offset, whence)`
在文件中查找位置。
- **参数：**
  - `fd` (number): 文件描述符句柄。
  - `offset` (number | bigint): 偏移量。
  - `whence` (number): 起始点：`dxstd.SEEK_SET`、`dxstd.SEEK_CUR` 或 `dxstd.SEEK_END`。
- **返回值：** (number | bigint): 从文件开头的新偏移量。

#### `dxstd.exist(filename)`
检查文件或目录是否存在。
- **参数：**
  - `filename` (string): 文件或目录名。
- **返回值：** (boolean): 路径存在时为 `true`，否则为 `false`。

#### `dxstd.stat(path)`
返回文件或目录的状态信息。
- **参数：**
  - `path` (string): 绝对路径。
- **返回值：** `[object, number]`: 数组 `[obj, err]`，其中 `obj` 是状态对象（`mode`、`size`、`mtime` 等），`err` 是错误代码。

#### `dxstd.lstat(path)`
与 `stat()` 相同，但如果路径是符号链接，则返回链接本身的信息。

#### `dxstd.isDir(filename)`
检查给定路径是否为目录。
- **参数：**
  - `filename` (string): 要检查的路径。
- **返回值：** (boolean): 路径是目录时为 `true`，否则为 `false`。

#### `dxstd.remove(filename)`
删除文件。
- **参数：**
  - `filename` (string): 文件的绝对路径。
- **返回值：** (number): 成功时为 0，失败时为 -errno。

#### `dxstd.rename(oldname, newname)`
重命名或移动文件。
- **参数：**
  - `oldname` (string): 旧绝对路径。
  - `newname` (string): 新绝对路径。
- **返回值：** (number): 成功时为 0，失败时为 -errno。

### 目录操作

#### `dxstd.mkdir(path)`
创建目录。
- **参数：**
  - `path` (string): 目录的绝对路径。
- **返回值：** (number): 成功时为 0，失败时为 -errno。

#### `dxstd.rmdir(dirname)`
删除空目录。
- **参数：**
  - `dirname` (string): 目录路径。
- **返回值：** (number): 底层 `rmdir` 命令的退出代码（成功时为 0）。

#### `dxstd.readdir(path)`
返回目录中文件的名称。
- **参数：**
  - `path` (string): 目录的绝对路径。
- **返回值：** `[string[], number]`: 数组 `[array, err]`，其中 `array` 是文件名数组，`err` 是错误代码。

#### `dxstd.ensurePathExists(filename)`
确保给定文件名的目录路径存在。如有必要则创建。
- **参数：**
  - `filename` (string): 文件的完整路径。
- **返回值：** `void`

#### `dxstd.getcwd()`
返回当前工作目录。
- **返回值：** `[string, number]`: 数组 `[str, err]`，其中 `str` 是当前工作目录，`err` 是错误代码。

#### `dxstd.chdir(path)`
更改当前工作目录。
- **参数：**
  - `path` (string): 目录路径。
- **返回值：** (number): 成功时为 0，失败时为 -errno。

### 环境变量

#### `dxstd.getenviron()`
返回包含所有环境变量键值对的对象。
- **返回值：** (object): 环境变量。

#### `dxstd.getenv(name)`
返回环境变量的值。
- **参数：**
  - `name` (string): 变量名。
- **返回值：** (string|undefined): 变量的值，如果未找到则为 `undefined`。

#### `dxstd.setenv(name, value)`
设置环境变量的值。
- **参数：**
  - `name` (string): 变量名。
  - `value` (string): 要设置的值。
- **返回值：** `void`

#### `dxstd.unsetenv(name)`
删除环境变量。
- **参数：**
  - `name` (string): 要删除的变量名。
- **返回值：** `void`

### 脚本

#### `dxstd.eval(str, async)`
将字符串作为 JavaScript 脚本执行。
- **参数：**
  - `str` (string): JavaScript 脚本字符串。
  - `async` (boolean, 可选, 默认: `false`): 如果为 `true`，脚本可以使用 `await` 并且函数返回 Promise。
- **返回值：** (any): 脚本评估的结果。

#### `dxstd.loadScript(filename)`
加载并执行文件内容作为全局作用域中的 JavaScript 脚本。
- **参数：**
  - `filename` (string): 脚本文件的绝对路径。
- **返回值：** (any): 脚本评估的结果。

#### `dxstd.parseExtJSON(str)`
使用 `JSON.parse` 的超集解析字符串。它支持注释、未引用的属性、尾随逗号等。
- **参数：**
  - `str` (string): 要解析的 JSON 字符串。
- **返回值：** (any): 解析的对象。

### 工作线程

#### `dxstd.Worker(module_filename)`
创建新线程（工作线程）。API 接近 WebWorkers API。
- **参数：**
  - `module_filename` (string): 在新线程中执行的模块文件名的绝对路径。
- **返回值：** (os.Worker): 新的 Worker 实例。

### 工具

#### `dxstd.genRandomStr(length)`
生成指定长度的随机字符串，由字母和数字组成。
- **参数：**
  - `length` (number, 可选, 默认: `6`): 字符串长度。
- **返回值：** (string): 生成的随机字符串。

#### `dxstd.platform()`
返回表示平台的字符串。
- **返回值：** (string): 平台标识符（"linux"、"darwin"、"win32" 或 "js"）。

## 7. 示例

```javascript
// --- 测试目录设置 ---
const testDir = "/app/data/dxStd_test";
dxStd.ensurePathExists(testDir + "/dummy.txt"); // ensurePathExists 本身在这里被测试

// --- 文件系统测试（文本）---
log.info("\n--- 测试文本文件 I/O ---");
const textFilePath = testDir + "/test.txt";
const textContent = "Hello, DejaOS! This is a test.\nLine 2.";

assert(dxStd.saveFile(textFilePath, textContent, false), "saveFile 应该返回 true");
log.info("saveFile 正常");

const loadedText = dxStd.loadFile(textFilePath);
assertEquals(loadedText, textContent, "loadFile 应该返回保存的内容");
log.info("loadFile 正常");

assert(dxStd.exist(textFilePath), "exist 对于现有文件应该返回 true");
log.info("exist 正常");

assert(!dxStd.isDir(textFilePath), "isDir 对于文件应该为 false");
log.info("isDir（文件）正常");

assert(dxStd.isDir(testDir), "isDir 对于目录应该为 true");
log.info("isDir（目录）正常");

// --- 文件系统测试（二进制）---
log.info("\n--- 测试二进制文件 I/O ---");
const binaryFilePath = testDir + "/test.bin";
// 创建示例缓冲区：[0, 1, 2, ..., 9]
const fullBuffer = new Uint8Array(10).map((_, i) => i);

// 1. 保存整个缓冲区
assert(dxStd.saveBinaryFile(binaryFilePath, fullBuffer), "saveBinaryFile（完整）应该返回 true");
log.info("saveBinaryFile（完整缓冲区）正常");

// 2. 加载整个缓冲区并验证
let loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertArraysEqual(loadedBuffer, fullBuffer, "loadBinaryFile（完整）应该匹配原始缓冲区");
log.info("loadBinaryFile（完整文件）正常");

// 3. 保存缓冲区的切片：[3, 4, 5, 6]
const sliceOffset = 3;
const sliceLength = 4;
const sliceBuffer = fullBuffer.subarray(sliceOffset, sliceOffset + sliceLength);
assert(dxStd.saveBinaryFile(binaryFilePath, fullBuffer, sliceOffset, sliceLength), "saveBinaryFile（切片）应该返回 true");
log.info("saveBinaryFile（切片）正常");

// 4. 加载整个文件以确认它现在只包含切片
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertArraysEqual(loadedBuffer, sliceBuffer, "文件内容现在应该是保存的切片");
assertEquals(loadedBuffer.length, sliceLength, "文件长度应该匹配切片长度");
log.info("验证保存的切片正常");

// 5. 从新文件加载子切片：[4, 5]（这是 [3, 4, 5, 6] 的中间 2 字节）
const subSliceOffset = 1;
const subSliceLength = 2;
const subSliceBuffer = sliceBuffer.subarray(subSliceOffset, subSliceOffset + subSliceLength);
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath, subSliceOffset, subSliceLength);
assertArraysEqual(loadedBuffer, subSliceBuffer, "loadBinaryFile（子切片）应该返回正确的部分数据");
log.info("loadBinaryFile（子切片）正常");

// 6. 测试零长度写入
dxStd.saveBinaryFile(binaryFilePath, new Uint8Array(0));
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertEquals(loadedBuffer.length, 0, "加载零字节文件应该导致零长度缓冲区");
log.info("零长度二进制 I/O 正常");

// --- 定时器测试 ---
log.info("\n--- 测试定时器 ---");
let timeoutFired = false;
let intervalCount = 0;
let intervalId = null;

// 最终检查将在此定时器内执行
const assertionTimer = dxStd.setTimeout(() => {
  log.info("--- 验证定时器断言 ---");
  try {
    assert(timeoutFired, "setTimeout 回调应该已被触发");
    assertEquals(intervalCount, 2, "setInterval 应该正好触发两次");
    log.info("定时器断言正常");
  } catch (e) {
    // 我们必须在这里捕获，否则错误在 setTimeout 中是静默的
    log.info(`\n!!!!!!!!!! 定时器测试失败 !!!!!!!!!!`);
    log.info(`错误: ${e.message}`);
    std.exit(1);
  }
}, 200); // 200ms 后运行断言

dxStd.setTimeout(() => {
  timeoutFired = true;
  log.info("setTimeout 正常");
}, 50);

intervalId = dxStd.setInterval(() => {
  intervalCount++;
  if (intervalCount === 1) {
    log.info("setInterval 触发一次正常");
  }
  if (intervalCount === 2) {
    dxStd.clearInterval(intervalId);
    log.info("setInterval 和 clearInterval 正常");
  }
}, 50);

log.info("定时器已设置。等待回调...");

// --- 工具测试 ---
log.info("\n--- 测试工具 ---");
const randomStr = dxStd.genRandomStr(10);
assertEquals(randomStr.length, 10, "genRandomStr 应该生成正确长度的字符串");
log.info(`genRandomStr 正常（生成: ${randomStr}）`);

// --- 清理 ---
log.info("\n--- 清理 ---");
log.info(dxStd.remove(textFilePath));
log.info(dxStd.remove(binaryFilePath));
// 注意：无法删除有内容的目录，所以我们先删除文件。
// 现在，我们假设目录在删除前是空的。
dxStd.rmdir(testDir);
assert(!dxStd.exist(testDir), "测试目录应该被删除");
log.info("清理正常");

// --- 高级/手动验证测试 ---
// 以下测试更难自动断言或修改全局状态。
// 它们在这里结构化用于手动验证或未来扩展。
log.info("\n--- 高级/手动验证 ---");

// 1. 脚本测试
log.info("--- 测试脚本 ---");
// 测试 parseExtJSON（仍然可以断言这个）
const jsonWithComments = `{'a':1, // comment\n 'b': 'c'}`;
const parsed = dxStd.parseExtJSON(jsonWithComments);
assertEquals(parsed.a, 1, "parseExtJSON 应该处理注释和单引号");
assertEquals(parsed.b, "c", "parseExtJSON 应该处理注释和单引号");
log.info("parseExtJSON 正常");

// 测试 eval（简单情况可以断言）
const evalResult = dxStd.eval("2 + 3");
assertEquals(evalResult, 5, "eval 应该计算表达式");
log.info("eval 正常");

// 测试 loadScript（需要文件）
const scriptPath = testDir + "/test_script.js";
dxStd.saveFile(scriptPath, "var testVar = 42; ");
dxStd.loadScript(scriptPath);
assertEquals(testVar, 42, "loadScript 应该执行脚本并设置全局变量");
log.info("loadScript 已执行（如果需要，手动检查控制台消息和 `testVar`）");
dxStd.remove(scriptPath); // 清理脚本文件

// 2. 环境和 CWD 测试（简化为手动验证的控制台日志）
log.info("\n--- 测试环境和 CWD ---");
const originalCwd = dxStd.getcwd()[0];
const originalEnv = dxStd.getenv("MY_TEST_VAR");

log.info('设置 MY_TEST_VAR 为 "hello"');
dxStd.setenv("MY_TEST_VAR", "hello");
log.info('getenv("MY_TEST_VAR"):', dxStd.getenv("MY_TEST_VAR"));

log.info("取消设置 MY_TEST_VAR");
dxStd.unsetenv("MY_TEST_VAR");
log.info("unset 后 getenv('MY_TEST_VAR'):", dxStd.getenv("MY_TEST_VAR"));

// 如果原始环境存在则恢复
if (originalEnv !== undefined) {
  dxStd.setenv("MY_TEST_VAR", originalEnv);
}

log.info(`原始 CWD: ${originalCwd}`);
dxStd.chdir(testDir);
log.info(`新 CWD: ${dxStd.getcwd()[0]}`);

dxStd.chdir(originalCwd); // 恢复 CWD
log.info(`恢复的 CWD: ${dxStd.getcwd()[0]}`);

// 3. 高级文件系统测试（简化为手动验证的控制台日志）
log.info("\n--- 测试高级文件系统 ---");
const readdirPath = testDir + "/readdir_test";
const file1 = readdirPath + "/f1.txt";
const file2 = readdirPath + "/f2.txt";
dxStd.ensurePathExists(file1);
dxStd.saveFile(file1, "1");
dxStd.saveFile(file2, "2");

const files = dxStd.readdir(readdirPath)[0];
log.info(`readdir("${readdirPath}"):`, files);

const renamedFile = readdirPath + "/f1_renamed.txt";
log.info(`将 "${file1}" 重命名为 "${renamedFile}"`);
dxStd.rename(file1, renamedFile);
log.info(`存在 "${renamedFile}":`, dxStd.exist(renamedFile));
log.info(`存在 "${file1}":`, dxStd.exist(file1));

// 清理此测试
dxStd.remove(renamedFile);
dxStd.remove(file2);
dxStd.remove(readdirPath);

// 4. 工作线程测试（手动观察）
log.info("\n--- 测试工作线程（手动观察）---");
log.info("启动工作线程...您应该在控制台中看到来自它的消息。");
dxStd.Worker("/app/code/src/worker2.js");
log.info("工作线程测试部分完成（检查控制台的工作线程输出）。");

log.info("\n----------- [dxStd] 所有测试通过！ -----------");
```