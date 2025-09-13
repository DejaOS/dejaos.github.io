# dxIconv

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于跨平台字符编码转换，用于解决不同字符编码系统之间的文本兼容性问题。此库支持常见的字符集，如 Unicode、ISO-8859 系列、GBK、Big5 等

主要功能包括：

- 实现从一种字符编码到另一种字符编码的转换。

## 2. 文件

- dxIconv.js

## 3. 依赖项

无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. 使用方法

### 字符编码转换

```javascript
// 将 UTF-8 编码的字符串转换为 GBK 编码的 arraybuffer
let res = iconv.convert(
  "utf-8",
  "gbk",
  "你好",
  iconv.DATA_TYPE.STRING,
  iconv.DATA_TYPE.ARRAY_BUFFER
);
log.info(
  "将 UTF-8 编码的字符串转换为 GBK 编码的 arraybuffer: " +
    common.arrayBufferToHexString(res)
);

// 将 GBK 编码的 arraybuffer 转换为 UTF-8 编码的字符串
res = iconv.convert(
  "gbk",
  "utf-8",
  res,
  iconv.DATA_TYPE.ARRAY_BUFFER,
  iconv.DATA_TYPE.STRING
);
log.info("将 GBK 编码的字符串转换为 UTF-8 编码的字符串: " + res);

// 将 UTF-8 编码的字符串转换为 ISO-8859-1 编码的 arraybuffer
res = iconv.convert(
  "utf-8",
  "iso-8859-1",
  "hello",
  iconv.DATA_TYPE.STRING,
  iconv.DATA_TYPE.ARRAY_BUFFER
);
log.info(
  "将 UTF-8 编码的字符串转换为 ISO-8859-1 编码的 arraybuffer: " +
    common.arrayBufferToHexString(res)
);

// 将 ISO-8859-1 编码的 arraybuffer 转换为 UTF-8 编码的字符串
res = iconv.convert(
  "iso-8859-1",
  "utf-8",
  res,
  iconv.DATA_TYPE.ARRAY_BUFFER,
  iconv.DATA_TYPE.STRING
);
log.info("将 ISO-8859-1 编码的字符串转换为 UTF-8 编码的字符串: " + res);
```

## 6. API 参考

### 初始化方法

- `iconv.convert(fromEncoding, toEncoding, data, fromType, toType)` - 转换字符编码
  - `fromEncoding`: 源字符编码
  - `toEncoding`: 目标字符编码
  - `data`: 要转换的数据
  - `fromType`: 源数据类型，默认 DATA_TYPE.STRING
  - `toType`: 目标数据类型，默认 DATA_TYPE.ARRAY_BUFFER

## 7. 相关模块

无

## 8. 示例

无
