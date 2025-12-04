# dxFingerMz 指纹识别模块文档

## 目录
- [概述](#概述)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [API 接口文档](#api-接口文档)
  - [初始化](#初始化)
  - [图像捕获](#图像捕获)
  - [特征生成](#特征生成)
  - [指纹匹配](#指纹匹配)
  - [指纹注册](#指纹注册)
  - [模板存储管理](#模板存储管理)
  - [系统功能](#系统功能)
  - [其他功能](#其他功能)
- [返回码说明](#返回码说明)
- [使用示例](#使用示例)

---

## 概述

`dxFingerMz` 是一个用于与 MZ 指纹识别模块进行通信的 JavaScript 接口库。该模块通过 UART 串口与指纹识别硬件进行通信，支持指纹图像的采集、特征提取、模板生成、指纹匹配、存储管理等完整功能。

### 通信方式
- **接口类型**: UART 串口通信
- **默认波特率**: 57600-8-N-2
- **默认设备路径**: `/dev/ttySLB0`
- **默认超时时间**: 500ms

---

## 功能特性

### 核心功能
- **图像捕获**: 支持验证和注册两种模式的指纹图像采集
- **特征提取**: 从指纹图像生成特征文件
- **指纹匹配**: 
  - 一对一匹配 (1:1)
  - 一对多搜索 (1:N)
- **指纹注册**: 支持手动注册和自动注册两种方式
- **存储管理**: 完整的模板存储、加载、删除、清空功能
- **系统配置**: 读取系统参数、配置模块参数

### 高级功能
- **自动注册**: 一键完成指纹采集、特征生成、模板合并、存储的完整流程
- **自动识别**: 自动完成图像采集、特征提取、库内搜索的完整流程
- **模板传输**: 支持模板的上传和下载，便于备份和迁移
- **索引管理**: 支持读取索引表，快速查询已注册的模板

---

## 快速开始

### 导入模块
```javascript
import dxFingerMz from './dxFingerMz.js';
```

### 初始化
```javascript
dxFingerMz.init({
    id: 'fingerUart',           // 连接ID
    path: '/dev/ttySLB0',       // UART设备路径
    baudrate: '57600-8-N-2',    // 波特率配置
    timeout: 500,                // 超时时间(ms)
    total: 5000,                 // 指纹库总容量
    type: '3'                    // UART类型
});
```

### 基本使用示例
```javascript
// 1. 获取指纹图像
const result = dxFingerMz.getImage();
if (result === 0) {
    console.log('指纹图像采集成功');
}

// 2. 生成特征文件
const genResult = dxFingerMz.genChar(1);
if (genResult === 0) {
    console.log('特征文件生成成功');
}

// 3. 搜索指纹库
const searchResult = dxFingerMz.search(1, 0, 100);
if (searchResult && searchResult.code === 0) {
    console.log(`找到匹配指纹，索引: ${searchResult.pageIndex}, 分数: ${searchResult.score}`);
}
```

---

## API 接口文档

### 初始化

#### `init(params)`
初始化指纹识别模块，配置 UART 连接参数。

**参数:**
- `params` `{Object}` - 初始化参数对象
  - `id` `{string}` [可选] - 连接ID，默认: `'fingerUart'`
  - `path` `{string}` [可选] - UART设备路径，默认: `'/dev/ttySLB0'`
  - `baudrate` `{string}` [可选] - 波特率配置，默认: `'57600-8-N-2'`
  - `timeout` `{number}` [可选] - 超时时间(毫秒)，默认: `500`
  - `total` `{number}` [可选] - 指纹库总容量，默认: `5000`
  - `type` `{string}` [可选] - UART类型，默认: `'3'`

**返回值:**
- 无返回值

**示例:**
```javascript
dxFingerMz.init({
    id: 'fingerUart',
    path: '/dev/ttySLB0',
    baudrate: '57600-8-N-2'
});
```

---

### 图像捕获

#### `getImage()`
检测手指并采集指纹图像（用于验证模式）。将指纹图像存储在图像缓冲区中。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败（具体错误码参考返回码说明）
  - `-1`: 通信失败或超时

**示例:**
```javascript
const result = dxFingerMz.getImage();
if (result === 0) {
    console.log('指纹图像采集成功');
} else {
    console.log('指纹图像采集失败，错误码:', result);
}
```

#### `getEnrollImage()`
检测手指并采集指纹图像（用于注册模式）。将指纹图像存储在图像缓冲区中。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
const result = dxFingerMz.getEnrollImage();
if (result === 0) {
    console.log('注册用指纹图像采集成功');
}
```

---

### 特征生成

#### `genChar(bufferId)`
从图像缓冲区中的指纹图像生成特征文件，并存储到特征缓冲区中。

**参数:**
- `bufferId` `{number}` - 缓冲区ID，可选值: `1` 或 `2`

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 生成特征文件到缓冲区1
const result = dxFingerMz.genChar(1);
if (result === 0) {
    console.log('特征文件生成成功');
}
```

---

### 指纹匹配

#### `match()`
精确匹配。比较缓冲区中的特征文件或模板。

**参数:**
- 无

**返回值:**
- `{Object|null}` - 匹配结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示成功
  - `score` `{number}` - 匹配分数（数值越大匹配度越高）

**示例:**
```javascript
const result = dxFingerMz.match();
if (result && result.code === 0) {
    console.log(`匹配成功，分数: ${result.score}`);
} else {
    console.log('匹配失败');
}
```

#### `search(bufferId, startPage, pageNum)`
搜索指纹库。使用缓冲区中的特征文件在指纹库中搜索（支持全库或部分范围搜索）。

**参数:**
- `bufferId` `{number}` - 特征缓冲区ID，默认使用 `1`
- `startPage` `{number}` - 起始页索引
- `pageNum` `{number}` - 要搜索的页数

**返回值:**
- `{Object|null}` - 搜索结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示找到匹配
  - `pageIndex` `{number}` - 找到的页索引
  - `score` `{number}` - 匹配分数

**示例:**
```javascript
// 在索引0-99范围内搜索
const result = dxFingerMz.search(1, 0, 100);
if (result && result.code === 0) {
    console.log(`找到匹配指纹，索引: ${result.pageIndex}, 分数: ${result.score}`);
} else {
    console.log('未找到匹配指纹');
}
```

#### `searchNow(startPage, pageNum)`
使用最近提取的特征在指纹库中搜索。

**参数:**
- `startPage` `{number}` - 起始页索引
- `pageNum` `{number}` - 要搜索的页数

**返回值:**
- `{Object|null}` - 搜索结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示找到匹配
  - `pageIndex` `{number}` - 找到的页索引
  - `score` `{number}` - 匹配分数

**示例:**
```javascript
const result = dxFingerMz.searchNow(0, 100);
if (result && result.code === 0) {
    console.log(`找到匹配，索引: ${result.pageIndex}`);
}
```

---

### 指纹注册

#### `regModel()`
注册模型（合并特征文件）。将特征文件合并生成模板，并存储到特征缓冲区中。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**说明:**
- 此函数需要先在缓冲区1和缓冲区2中分别生成特征文件
- 通常用于手动注册流程：采集两次指纹图像，分别生成特征文件，然后合并

**示例:**
```javascript
// 手动注册流程示例
// 1. 第一次采集
dxFingerMz.getEnrollImage();
dxFingerMz.genChar(1);

// 2. 第二次采集
dxFingerMz.getEnrollImage();
dxFingerMz.genChar(2);

// 3. 合并特征文件生成模板
const result = dxFingerMz.regModel();
if (result === 0) {
    console.log('模板生成成功');
}
```

#### `autoRegister(pageIndex, count, timeout, config)`
自动注册。一键完成指纹注册的完整流程，包括图像采集、特征生成、模板合并和存储。

**参数:**
- `pageIndex` `{number}` - 存储的页索引
- `count` `{number}` - 需要按压手指的次数（通常为2-3次）
- `timeout` `{number}` [可选] - 超时时间（秒），默认: `60`
- `config` `{number}` [可选] - 配置标志，默认: `0`

**返回值:**
- `{ArrayBuffer|null}` - 结果数据，失败或超时返回 `null`

**说明:**
- 此函数会自动处理多次按压、特征合并、重复检查等流程
- 每次按压会产生多个响应（状态、合并结果、重复检查、存储结果）

**示例:**
```javascript
// 自动注册，需要按压2次，存储到索引10
const result = dxFingerMz.autoRegister(10, 2, 60, 0);
if (result) {
    console.log('自动注册成功');
} else {
    console.log('自动注册失败或超时');
}
```

---

### 模板存储管理

#### `storeChar(bufferId, pageIndex)`
存储模板。将缓冲区中的模板文件存储到闪存数据库的指定页索引位置。

**参数:**
- `bufferId` `{number}` - 特征缓冲区ID，默认使用 `1`
- `pageIndex` `{number}` - 指纹库位置索引

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 将缓冲区1中的模板存储到索引5
const result = dxFingerMz.storeChar(1, 5);
if (result === 0) {
    console.log('模板存储成功');
}
```

#### `loadChar(bufferId, pageIndex)`
加载模板。从闪存数据库的指定页索引读取指纹模板到缓冲区。

**参数:**
- `bufferId` `{number}` - 特征缓冲区ID，默认使用 `2`
- `pageIndex` `{number}` - 指纹库位置索引

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 从索引5加载模板到缓冲区2
const result = dxFingerMz.loadChar(2, 5);
if (result === 0) {
    console.log('模板加载成功');
}
```

#### `upChar(bufferId)`
上传模板。将缓冲区中的模板文件上传到主机。

**参数:**
- `bufferId` `{number}` - 特征缓冲区ID，默认使用 `2`

**返回值:**
- `{ArrayBuffer|null}` - 模板数据，失败返回 `null`

**示例:**
```javascript
// 从缓冲区2上传模板
const templateData = dxFingerMz.upChar(2);
if (templateData) {
    console.log('模板上传成功，数据长度:', templateData.byteLength);
    // 可以保存到文件或数据库
}
```

#### `downChar(bufferId, char)`
下载模板。将模板从主机下载到模块的缓冲区。

**参数:**
- `bufferId` `{number}` - 特征缓冲区ID，默认使用 `1`
- `char` `{ArrayBuffer}` - 模板数据

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 从文件或数据库读取模板数据
const templateData = readTemplateFromFile();

// 下载到缓冲区1
const result = dxFingerMz.downChar(1, templateData);
if (result === 0) {
    console.log('模板下载成功');
}
```

#### `deletChar(pageIndex, num)`
删除模板。从闪存数据库中删除从指定页索引开始的N个指纹模板。

**参数:**
- `pageIndex` `{number}` - 起始索引
- `num` `{number}` - 要删除的模板数量

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 删除从索引5开始的3个模板
const result = dxFingerMz.deletChar(5, 3);
if (result === 0) {
    console.log('模板删除成功');
}
```

#### `clearChar()`
清空指纹库。删除闪存数据库中的所有指纹模板。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**警告:**
- 此操作不可逆，请谨慎使用

**示例:**
```javascript
const result = dxFingerMz.clearChar();
if (result === 0) {
    console.log('指纹库已清空');
}
```

---

### 系统功能

#### `readSysPara()`
读取系统参数。读取模块的基本参数（波特率、数据包大小等）。

**参数:**
- 无

**返回值:**
- `{Object|null}` - 系统参数对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示成功
  - `data` `{Uint8Array}` - 系统参数数据

**示例:**
```javascript
const result = dxFingerMz.readSysPara();
if (result && result.code === 0) {
    console.log('系统参数读取成功');
    // 解析 result.data 获取具体参数
}
```

#### `writeReg(regId, context)`
写入系统寄存器。向模块寄存器写入数据。

**参数:**
- `regId` `{number}` - 寄存器ID
- `context` `{number}` - 要写入的内容

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
const result = dxFingerMz.writeReg(0x01, 0x05);
if (result === 0) {
    console.log('寄存器写入成功');
}
```

#### `getValidTemplateNum()`
获取有效模板数量。读取已注册的有效模板数量。

**参数:**
- 无

**返回值:**
- `{Object|null}` - 结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示成功
  - `validNum` `{number}` - 有效模板数量

**示例:**
```javascript
const result = dxFingerMz.getValidTemplateNum();
if (result && result.code === 0) {
    console.log(`当前有效模板数量: ${result.validNum}`);
}
```

#### `readIndexTable(indexPage)`
读取索引表。读取已注册模板的索引表。

**参数:**
- `indexPage` `{number}` - 索引表页号（0, 1, 2, 3...）
  - 每页对应一个模板范围（0-255, 256-511, 512-767...）
  - 每个位代表一个模板：1表示已注册，0表示未注册

**返回值:**
- `{Object|null}` - 结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示成功
  - `indexTable` `{Uint8Array}` - 索引表数据

**示例:**
```javascript
// 读取第0页索引表（对应索引0-255）
const result = dxFingerMz.readIndexTable(0);
if (result && result.code === 0) {
    console.log('索引表读取成功');
    // 解析 result.indexTable 判断哪些索引已注册
}
```

#### `restSetting()`
恢复出厂设置。清除内部数据（如果已注册）并删除内部密钥。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**警告:**
- 此操作会清除所有已注册的指纹数据，请谨慎使用

**示例:**
```javascript
const result = dxFingerMz.restSetting();
if (result === 0) {
    console.log('已恢复出厂设置');
}
```

---

### 其他功能

#### `autoCompare(pageIndex, scoreLevel, config)`
自动比对。自动完成指纹验证流程，包括图像采集、特征生成和搜索。

**参数:**
- `pageIndex` `{number}` - 模板索引
  - 指定索引: 进行1:1匹配
  - `0xFFFF`: 进行1:N搜索
- `scoreLevel` `{number}` - 安全级别（1-5，默认推荐3）
- `config` `{number}` - 配置标志

**返回值:**
- `{Object|null}` - 比对结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示匹配成功
  - `index` `{number}` - 匹配的索引
  - `score` `{number}` - 匹配分数

**示例:**
```javascript
// 1:1匹配（与索引10的模板比对）
const result1 = dxFingerMz.autoCompare(10, 3, 0);
if (result1 && result1.code === 0) {
    console.log(`匹配成功，分数: ${result1.score}`);
}

// 1:N搜索（在整个库中搜索）
const result2 = dxFingerMz.autoCompare(0xFFFF, 3, 0);
if (result2 && result2.code === 0) {
    console.log(`找到匹配，索引: ${result2.index}, 分数: ${result2.score}`);
}
```

#### `getChipSN()`
获取芯片序列号。读取芯片的唯一序列号。

**参数:**
- 无

**返回值:**
- `{Object|null}` - 结果对象，失败返回 `null`
  - `code` `{number}` - 确认码，`0` 表示成功
  - `sn` `{Uint8Array}` - 序列号数据

**示例:**
```javascript
const result = dxFingerMz.getChipSN();
if (result && result.code === 0) {
    console.log('芯片序列号:', result.sn);
}
```

#### `sleep()`
进入睡眠模式。设置传感器进入睡眠模式以节省功耗。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
const result = dxFingerMz.sleep();
if (result === 0) {
    console.log('已进入睡眠模式');
}
```

#### `cancel()`
取消操作。取消自动注册或自动验证操作。

**参数:**
- 无

**返回值:**
- `{number}` - 确认码
  - `0`: 成功
  - 其他值: 失败
  - `-1`: 通信失败或超时

**示例:**
```javascript
// 在自动注册过程中取消
const result = dxFingerMz.cancel();
if (result === 0) {
    console.log('操作已取消');
}
```

#### `setChipAddr(startId, endId)`
设置设备地址。设置设备地址（默认为 0xFFFFFFFF）。

**参数:**
- `startId` `{number}` - 起始ID
- `endId` `{number}` - 结束ID

**返回值:**
- `{number|boolean}` - 可用的指纹ID，失败返回 `false`

**注意:**
- 此函数当前未实现完整功能

---

## 返回码说明

### 通用返回码
- `0`: 操作成功
- `-1`: 通信失败或超时

### 常见错误码（参考MZ模块协议）
- `0x00`: 成功
- `0x01`: 数据包接收错误
- `0x02`: 传感器上没有手指
- `0x03`: 录入指纹图像失败
- `0x06`: 指纹图像太乱
- `0x07`: 指纹图像太正常
- `0x08`: 指纹图像不匹配
- `0x09`: 未找到匹配指纹
- `0x0A`: 特征合并失败
- `0x0B`: 访问指纹库时地址超出范围
- `0x0C`: 从指纹库读取模板错误或无效
- `0x0D`: 上传特征失败
- `0x0E`: 模块无法接收后续数据包
- `0x0F`: 上传图像失败
- `0x10`: 删除模板失败
- `0x11`: 清空指纹库失败
- `0x15`: 无效的寄存器号
- `0x18`: 指纹库中无有效模板
- `0x19`: 模板已存在（重复注册）

**注意:** 具体错误码可能因模块型号而异，请参考硬件厂商提供的协议文档。

---

## 使用示例

### 完整注册流程示例

```javascript
import dxFingerMz from './dxFingerMz.js';

// 1. 初始化
dxFingerMz.init({
    id: 'fingerUart',
    path: '/dev/ttySLB0',
    baudrate: '57600-8-N-2'
});

// 2. 方式一：自动注册（推荐）
function autoEnroll(pageIndex) {
    const result = dxFingerMz.autoRegister(pageIndex, 2, 60, 0);
    if (result) {
        console.log('自动注册成功');
        return true;
    } else {
        console.log('自动注册失败');
        return false;
    }
}

// 3. 方式二：手动注册
function manualEnroll(pageIndex) {
    // 第一次采集
    if (dxFingerMz.getEnrollImage() !== 0) {
        console.log('第一次采集失败');
        return false;
    }
    if (dxFingerMz.genChar(1) !== 0) {
        console.log('第一次特征生成失败');
        return false;
    }
    
    // 第二次采集
    if (dxFingerMz.getEnrollImage() !== 0) {
        console.log('第二次采集失败');
        return false;
    }
    if (dxFingerMz.genChar(2) !== 0) {
        console.log('第二次特征生成失败');
        return false;
    }
    
    // 合并特征并存储
    if (dxFingerMz.regModel() !== 0) {
        console.log('模板生成失败');
        return false;
    }
    if (dxFingerMz.storeChar(1, pageIndex) !== 0) {
        console.log('模板存储失败');
        return false;
    }
    
    console.log('手动注册成功');
    return true;
}

// 使用示例
autoEnroll(1);  // 注册到索引1
```

### 完整验证流程示例

```javascript
// 方式一：自动验证（推荐）
function autoVerify(pageIndex) {
    // 1:1匹配
    const result = dxFingerMz.autoCompare(pageIndex, 3, 0);
    if (result && result.code === 0) {
        console.log(`验证成功，分数: ${result.score}`);
        return true;
    } else {
        console.log('验证失败');
        return false;
    }
}

// 方式二：1:N搜索
function searchFingerprint() {
    const result = dxFingerMz.autoCompare(0xFFFF, 3, 0);
    if (result && result.code === 0) {
        console.log(`找到匹配，索引: ${result.index}, 分数: ${result.score}`);
        return result.index;
    } else {
        console.log('未找到匹配指纹');
        return -1;
    }
}

// 方式三：手动验证流程
function manualVerify() {
    // 采集图像
    if (dxFingerMz.getImage() !== 0) {
        console.log('图像采集失败');
        return false;
    }
    
    // 生成特征
    if (dxFingerMz.genChar(1) !== 0) {
        console.log('特征生成失败');
        return false;
    }
    
    // 搜索指纹库
    const result = dxFingerMz.search(1, 0, 100);
    if (result && result.code === 0) {
        console.log(`找到匹配，索引: ${result.pageIndex}, 分数: ${result.score}`);
        return true;
    } else {
        console.log('未找到匹配指纹');
        return false;
    }
}

// 使用示例
searchFingerprint();  // 在库中搜索
```

### 模板管理示例

```javascript
// 备份模板
function backupTemplate(pageIndex) {
    // 加载模板到缓冲区
    if (dxFingerMz.loadChar(2, pageIndex) !== 0) {
        console.log('模板加载失败');
        return null;
    }
    
    // 上传模板
    const templateData = dxFingerMz.upChar(2);
    if (templateData) {
        console.log('模板备份成功，数据长度:', templateData.byteLength);
        // 保存到文件或数据库
        return templateData;
    } else {
        console.log('模板备份失败');
        return null;
    }
}

// 恢复模板
function restoreTemplate(pageIndex, templateData) {
    // 下载模板到缓冲区
    if (dxFingerMz.downChar(1, templateData) !== 0) {
        console.log('模板下载失败');
        return false;
    }
    
    // 存储模板
    if (dxFingerMz.storeChar(1, pageIndex) !== 0) {
        console.log('模板存储失败');
        return false;
    }
    
    console.log('模板恢复成功');
    return true;
}

// 查询已注册模板
function getEnrolledTemplates() {
    const enrolled = [];
    
    // 获取有效模板数量
    const countResult = dxFingerMz.getValidTemplateNum();
    if (!countResult || countResult.code !== 0) {
        console.log('获取模板数量失败');
        return enrolled;
    }
    console.log(`总有效模板数: ${countResult.validNum}`);
    
    // 读取索引表（假设最多5000个模板，需要读取约20页）
    for (let page = 0; page < 20; page++) {
        const result = dxFingerMz.readIndexTable(page);
        if (result && result.code === 0) {
            // 解析索引表，找出已注册的索引
            const table = result.indexTable;
            for (let byteIdx = 0; byteIdx < table.length; byteIdx++) {
                const byte = table[byteIdx];
                for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
                    if ((byte >> bitIdx) & 1) {
                        const index = page * 256 + byteIdx * 8 + bitIdx;
                        enrolled.push(index);
                    }
                }
            }
        }
    }
    
    return enrolled;
}
```

### 系统信息查询示例

```javascript
// 获取系统信息
function getSystemInfo() {
    // 读取系统参数
    const sysPara = dxFingerMz.readSysPara();
    if (sysPara && sysPara.code === 0) {
        console.log('系统参数读取成功');
        // 解析 sysPara.data 获取具体参数
    }
    
    // 获取芯片序列号
    const snResult = dxFingerMz.getChipSN();
    if (snResult && snResult.code === 0) {
        console.log('芯片序列号:', snResult.sn);
    }
    
    // 获取有效模板数量
    const countResult = dxFingerMz.getValidTemplateNum();
    if (countResult && countResult.code === 0) {
        console.log(`有效模板数量: ${countResult.validNum}`);
    }
}
```

---

## 注意事项

1. **初始化顺序**: 使用任何功能前必须先调用 `init()` 进行初始化
2. **缓冲区使用**: 
   - 缓冲区1和缓冲区2可以独立使用
   - 注册时需要两个缓冲区分别存储两次采集的特征
3. **错误处理**: 建议对所有API调用进行错误检查，根据返回码进行相应处理
4. **超时设置**: 根据实际应用场景调整 `timeout` 参数，图像采集可能需要更长时间
5. **并发操作**: 避免同时进行多个操作，建议串行执行
6. **数据备份**: 重要模板建议使用 `upChar()` 进行备份
7. **睡眠模式**: 使用 `sleep()` 可以降低功耗，唤醒后需要重新初始化

---


## 技术支持

如有问题或建议，请联系技术支持团队。

