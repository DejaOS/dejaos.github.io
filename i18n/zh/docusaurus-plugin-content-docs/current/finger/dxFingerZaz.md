# dxFingerZaz 指纹模块文档

## 目录

- [模块介绍](#模块介绍)
- [快速开始](#快速开始)
- [接口调用流程](#接口调用流程)
- [接口文档](#接口文档)
  - [初始化](#初始化)
  - [测试连接](#测试连接)
  - [管理功能](#管理功能)
  - [图像处理](#图像处理)
  - [模板操作](#模板操作)
  - [存储管理](#存储管理)
  - [搜索功能](#搜索功能)
  - [系统配置](#系统配置)

---

## 模块介绍

`dxFingerZaz` 是一个用于与 Zaz 指纹识别模块通信的 JavaScript 模块。该模块通过 UART（串口）与指纹识别硬件进行通信，提供了完整的指纹管理功能，包括指纹录入、验证、存储和管理等操作。

### 主要特性

- **连接测试**：验证与指纹模块的连接状态
- **指纹管理**：获取空ID、查询注册状态、删除指纹模板、统计注册数量
- **图像采集**：捕获指纹图像、检测手指是否放置
- **模板生成**：从图像生成指纹模板、合并多个模板
- **存储操作**：存储、加载、上传、下载指纹模板
- **搜索匹配**：在指纹库中搜索匹配的指纹
- **系统配置**：读取和设置模块参数、获取设备信息

### 技术规格

- **通信方式**：UART 串口通信
- **默认波特率**：115200-8-N-1
- **指纹容量**：默认 5000 个（可配置）
- **缓冲区数量**：3 个 RAM 缓冲区（Buffer 0-2）
- **超时时间**：默认 500ms（可配置）

### 依赖模块

- `dxStd.js` - 标准库（用于 sleep 等操作）
- `dxUart.js` - UART 串口通信模块
- `dxCommon.js` - 通用工具函数
- `dxLogger.js` - 日志记录模块

---

## 快速开始

### 1. 导入模块

```javascript
import dxFingerZaz from './js/dxFingerZaz.js';
```

### 2. 初始化模块

在使用任何功能之前，必须先初始化模块，配置串口参数：

```javascript
dxFingerZaz.init({
    id: 'fingerUart',              // 连接ID，默认 'fingerUart'
    type: '3',                     // UART类型，默认 '3'
    path: '/dev/ttySLB1',          // 串口路径，默认 '/dev/ttySLB1'
    baudrate: '115200-8-N-1',     // 波特率配置，默认 '115200-8-N-1'
    total: 5000,                   // 指纹总容量，默认 5000
    timeout: 500                   // 超时时间（毫秒），默认 500
});
```

### 3. 测试连接

```javascript
if (dxFingerZaz.test()) {
    console.log("指纹模块连接成功");
} else {
    console.error("指纹模块连接失败");
}
```

### 4. 基本使用示例

#### 录入指纹

```javascript
// 1. 获取一个空的指纹ID
const emptyId = dxFingerZaz.getEmptyId(1, 5000);
if (!emptyId) {
    console.error("未找到可用的指纹ID");
    return;
}

// 2. 检测手指是否放置
if (!dxFingerZaz.fingerDetect()) {
    console.log("请放置手指");
    return;
}

// 3. 采集指纹图像（第一次）
if (!dxFingerZaz.getImage()) {
    console.error("采集指纹图像失败");
    return;
}

// 4. 生成模板到 Buffer 0
if (!dxFingerZaz.generate(0)) {
    console.error("生成模板失败");
    return;
}

// 5. 提示用户再次放置手指
console.log("请再次放置手指");

// 6. 采集指纹图像（第二次）
if (!dxFingerZaz.getImage()) {
    console.error("采集指纹图像失败");
    return;
}

// 7. 生成模板到 Buffer 1
if (!dxFingerZaz.generate(1)) {
    console.error("生成模板失败");
    return;
}

// 8. 合并两个模板到 Buffer 0
if (!dxFingerZaz.merge(2, 0)) {
    console.error("合并模板失败");
    return;
}

// 9. 存储指纹模板
if (dxFingerZaz.storeChar(emptyId, 0)) {
    console.log(`指纹录入成功，ID: ${emptyId}`);
} else {
    console.error("存储指纹失败");
}
```

#### 验证指纹

```javascript
// 1. 检测手指
if (!dxFingerZaz.fingerDetect()) {
    console.log("请放置手指");
    return;
}

// 2. 采集指纹图像
if (!dxFingerZaz.getImage()) {
    console.error("采集指纹图像失败");
    return;
}

// 3. 生成模板
if (!dxFingerZaz.generate(0)) {
    console.error("生成模板失败");
    return;
}

// 4. 在指纹库中搜索匹配
const matchedId = dxFingerZaz.search(0, 1, 5000);
if (matchedId) {
    console.log(`指纹匹配成功，ID: ${matchedId}`);
} else {
    console.log("未找到匹配的指纹");
}
```

---

## 接口调用流程

### 注册指纹
采集指纹并录入，模块支持合并多次采集，用于提高识别成功率，建议采集次数1~3次，接口调用流程如下（支持直接保存特征值）：

![detect](/img/finger/register.png)

### 识别指纹

![detect](/img/finger/recognize.png)

### 上传特征
![detect](/img/finger/upload.png)

### 特征值采集并下发多设备
![detect](/img/finger/multipleDevices.png)


### 下载模板（从主机到模块）

```
开始
  ↓
读取模板数据（十六进制字符串）
  ↓
下载模板到缓冲区 (downChar)
  ↓
存储模板 (storeChar)
  ↓
结束
```

---

## 接口文档

### 初始化

#### `init(params)`

初始化指纹模块，配置串口连接参数。

**参数：**

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `params.id` | string | 否 | `'fingerUart'` | 连接ID标识 |
| `params.type` | string | 否 | `'3'` | UART类型 |
| `params.path` | string | 否 | `'/dev/ttySLB1'` | 串口设备路径 |
| `params.baudrate` | string | 否 | `'115200-8-N-1'` | 波特率配置 |
| `params.total` | number | 否 | `5000` | 指纹总容量 |
| `params.timeout` | number | 否 | `500` | 超时时间（毫秒） |

**返回值：** 无

**示例：**

```javascript
dxFingerZaz.init({
    path: '/dev/ttyUSB0',
    baudrate: '9600-8-N-1',
    timeout: 1000
});
```

---

### 测试连接

#### `test()`

测试与指纹模块的连接是否正常。

**参数：** 无

**返回值：**

- `true` - 连接成功
- `false` - 连接失败

**示例：**

```javascript
if (dxFingerZaz.test()) {
    console.log("模块连接正常");
}
```

---

### 管理功能

#### `getEmptyId(startId, endId)`

获取指定范围内的第一个空指纹ID。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `startId` | number | 是 | 起始ID（1 到 total） |
| `endId` | number | 是 | 结束ID（1 到 total） |

**返回值：**

- `number` - 第一个空指纹ID
- `false` - 操作失败

**示例：**

```javascript
const emptyId = dxFingerZaz.getEmptyId(1, 5000);
if (emptyId) {
    console.log(`找到空ID: ${emptyId}`);
}
```

#### `getStatus(keyId)`

查询指定ID的指纹注册状态。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `keyId` | number | 是 | 要查询的指纹ID |

**返回值：**

- `0` - 未注册
- `1` - 已注册
- `false` - 操作失败

**示例：**

```javascript
const status = dxFingerZaz.getStatus(100);
if (status === 1) {
    console.log("该ID已注册指纹");
} else if (status === 0) {
    console.log("该ID未注册指纹");
}
```

#### `delChar(startId, endId)`

删除指定范围内的指纹模板。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `startId` | number | 是 | 起始ID（1 到 total） |
| `endId` | number | 是 | 结束ID（1 到 total） |

**返回值：**

- `true` - 删除成功
- `false` - 删除失败

**示例：**

```javascript
// 删除单个指纹
if (dxFingerZaz.delChar(100, 100)) {
    console.log("删除成功");
}

// 删除范围内的所有指纹
if (dxFingerZaz.delChar(1, 100)) {
    console.log("批量删除成功");
}
```

#### `getEnrollCount(startId, endId)`

获取指定范围内已注册的指纹数量。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `startId` | number | 是 | 起始ID（1 到 total） |
| `endId` | number | 是 | 结束ID（1 到 total） |

**返回值：**

- `number` - 已注册的指纹数量
- `false` - 操作失败

**示例：**

```javascript
const count = dxFingerZaz.getEnrollCount(1, 5000);
if (count !== false) {
    console.log(`已注册指纹数量: ${count}`);
}
```

#### `getEnrolledIdList()`

获取所有已注册的指纹ID列表。

**参数：** 无

**返回值：**

- `Array` - 已注册ID的数据数组
- `false` - 操作失败

**示例：**

```javascript
const idList = dxFingerZaz.getEnrolledIdList();
if (idList) {
    console.log("已注册的ID列表:", idList);
}
```

---

### 图像处理

#### `fingerDetect()`

检测手指是否放置在传感器上。

**参数：** 无

**返回值：**

- `1` - 检测到手指
- `0` - 未检测到手指
- `false` - 操作失败

**示例：**

```javascript
if (dxFingerZaz.fingerDetect() === 1) {
    console.log("手指已放置");
} else {
    console.log("请放置手指");
}
```

#### `getImage()`

从传感器采集指纹图像。

**参数：** 无

**返回值：**

- `true` - 采集成功
- `false` - 采集失败

**示例：**

```javascript
if (dxFingerZaz.getImage()) {
    console.log("图像采集成功");
} else {
    console.error("图像采集失败，请重新放置手指");
}
```

---

### 模板操作

#### `generate(bufferNum)`

从图像缓冲区生成指纹模板。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `bufferNum` | number | 是 | 缓冲区编号（0-2） |

**返回值：**

- `true` - 生成成功
- `false` - 生成失败

**示例：**

```javascript
// 生成模板到 Buffer 0
if (dxFingerZaz.generate(0)) {
    console.log("模板生成成功");
}
```

#### `merge(mergeCount, bufferNum)`

合并多个指纹模板。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `mergeCount` | number | 是 | 合并数量（2 或 3）<br />2: 合并 Buffer 0 和 Buffer 1<br />3: 合并 Buffer 0、Buffer 1 和 Buffer 2 |
| `bufferNum` | number | 是 | 存储合并结果的缓冲区编号（0-2） |

**返回值：**

- `true` - 合并成功
- `false` - 合并失败

**示例：**

```javascript
// 合并 Buffer 0 和 Buffer 1 到 Buffer 0
if (dxFingerZaz.merge(2, 0)) {
    console.log("模板合并成功");
}
```

---

### 存储管理

#### `storeChar(keyId, bufferNum, overwrite)`

将缓冲区中的模板存储到指纹库。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `keyId` | number | 是 | 指纹ID |
| `bufferNum` | number | 是 | 缓冲区编号（0-2） |
| `overwrite` | boolean | 否 | 是否覆盖已存在的指纹（默认 false） |

**返回值：**

- `true` - 存储成功
- `false` - 存储失败

**示例：**

```javascript
// 存储模板，不覆盖
if (dxFingerZaz.storeChar(100, 0)) {
    console.log("存储成功");
}

// 存储模板，覆盖已存在的
if (dxFingerZaz.storeChar(100, 0, true)) {
    console.log("存储并覆盖成功");
}
```

#### `loadChar(keyId, bufferNum)`

从指纹库加载模板到缓冲区。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `keyId` | number | 是 | 要加载的指纹ID |
| `bufferNum` | number | 是 | 目标缓冲区编号（0-2） |

**返回值：**

- `true` - 加载成功
- `false` - 加载失败

**示例：**

```javascript
// 加载ID为100的指纹到 Buffer 0
if (dxFingerZaz.loadChar(100, 0)) {
    console.log("加载成功");
}
```

#### `upChar(bufferNum)`

从缓冲区上传模板到主机。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `bufferNum` | number | 是 | 缓冲区编号（0-2） |

**返回值：**

- `string` - 模板数据（十六进制字符串）
- `false` - 上传失败

**示例：**

```javascript
const template = dxFingerZaz.upChar(0);
if (template) {
    console.log("模板数据:", template);
    // 可以将模板保存到文件或数据库
}
```

#### `downChar(bufferNum, template)`

从主机下载模板到缓冲区。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `bufferNum` | number | 是 | 缓冲区编号（0-2） |
| `template` | string | 是 | 模板数据（十六进制字符串） |

**返回值：**

- `true` - 下载成功
- `false` - 下载失败

**示例：**

```javascript
const templateData = "a1b2c3d4..."; // 从文件或数据库读取的模板数据
if (dxFingerZaz.downChar(0, templateData)) {
    console.log("下载成功");
    // 然后可以使用 storeChar 存储到指纹库
}
```

---

### 搜索功能

#### `search(bufferNum, startId, endId)`

在指纹库中搜索匹配的指纹。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `bufferNum` | number | 是 | 包含待匹配模板的缓冲区编号（0-2） |
| `startId` | number | 是 | 搜索起始ID（1 到 total） |
| `endId` | number | 是 | 搜索结束ID（1 到 total） |

**返回值：**

- `number` - 匹配的指纹ID
- `false` - 未找到匹配或操作失败

**示例：**

```javascript
// 在 Buffer 0 中搜索，范围 1-5000
const matchedId = dxFingerZaz.search(0, 1, 5000);
if (matchedId) {
    console.log(`找到匹配的指纹，ID: ${matchedId}`);
} else {
    console.log("未找到匹配的指纹");
}
```

---

### 系统配置

#### `getParam(paramType)`

获取模块参数值。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `paramType` | number | 是 | 参数类型（0-4）<br />0: 设备ID [1-255]<br />1: 安全等级 [1-5]<br />2: 重复检查 [0/1]<br />3: 波特率 [1:9600 ... 8:921600]<br />4: 自动学习 [0/1] |

**返回值：**

- `number` - 参数值
- `false` - 操作失败

**示例：**

```javascript
// 获取安全等级
const securityLevel = dxFingerZaz.getParam(1);
if (securityLevel !== false) {
    console.log(`安全等级: ${securityLevel}`);
}
```

#### `setParam(paramType, paramValue)`

设置模块参数值。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `paramType` | number | 是 | 参数类型（0-4） |
| `paramValue` | number | 是 | 参数值（0-255） |

**返回值：**

- `true` - 设置成功
- `false` - 设置失败

**示例：**

```javascript
// 设置安全等级为 3
if (dxFingerZaz.setParam(1, 3)) {
    console.log("安全等级设置成功");
}
```

#### `getDeviceInfo()`

获取设备信息。

**参数：** 无

**返回值：**

- `string` - 设备信息字符串
- `false` - 操作失败

**示例：**

```javascript
const deviceInfo = dxFingerZaz.getDeviceInfo();
if (deviceInfo) {
    console.log("设备信息:", deviceInfo);
}
```

---

## 错误处理

所有接口在操作失败时都会返回 `false`，并记录错误日志。建议在使用时进行错误检查：

```javascript
const result = dxFingerZaz.someFunction();
if (result === false) {
    console.error("操作失败，请检查日志");
    // 查看日志获取详细错误信息
}
```

## 注意事项

1. **初始化顺序**：使用任何功能前必须先调用 `init()` 初始化模块
2. **缓冲区使用**：模块有 3 个 RAM 缓冲区（0-2），注意不要覆盖正在使用的缓冲区
3. **指纹录入**：建议采集 2-3 次指纹图像并合并，以提高识别准确率
4. **ID 范围**：所有 ID 相关操作必须在 1 到 `total`（默认 5000）范围内
5. **超时设置**：如果模块响应较慢，可以增加 `timeout` 参数值
6. **错误重试**：接收数据时会自动重试 5 次，避免因模块响应慢而失败

## 常见问题

### Q: 为什么 `getImage()` 总是失败？

A: 可能的原因：
- 手指未正确放置在传感器上
- 手指太干或太湿
- 传感器脏污，需要清洁
- 建议先调用 `fingerDetect()` 确认手指已放置

### Q: 如何提高指纹识别准确率？

A: 
- 录入时采集 2-3 次指纹并合并
- 适当提高安全等级（使用 `setParam(1, value)`）
- 确保手指清洁且正确放置

### Q: 如何批量删除指纹？

A: 使用 `delChar(startId, endId)` 指定范围即可批量删除。

### Q: 模板数据如何保存？

A: 使用 `upChar()` 获取模板的十六进制字符串，可以保存到文件或数据库。需要时使用 `downChar()` 恢复。

---

## Demo 示例

完整的示例项目请参考 [vf105_v12_finger_demo](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/finger_zaz_demo) 演示项目。




