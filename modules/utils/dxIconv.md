# dxIconv

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), ross platform character encoding conversion, used to solve text compatibility issues between different character encoding systems. This library supports common character sets such as Unicode, ISO-8859 series, GBK, Big5, etc

Main features include:

- Implement the conversion from one character encoding to another character encoding.

## 2. Files

- dxIconv.js

## 3. Dependencies

None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. Usage

### Character encoding conversion

```javascript
// Convert UTF-8 encoded string to GBK encoded arraybuffer
let res = iconv.convert("utf-8", "gbk", "你好", iconv.DATA_TYPE.STRING, iconv.DATA_TYPE.ARRAY_BUFFER)
log.info("Convert UTF-8 encoded string to GBK encoded arraybuffer: " + common.arrayBufferToHexString(res))

// Convert GBK encoded arraybuffer to UTF-8 encoded string
res = iconv.convert("gbk", "utf-8", res, iconv.DATA_TYPE.ARRAY_BUFFER, iconv.DATA_TYPE.STRING)
log.info("Convert GBK encoded string to UTF-8 encoded string: " + res)

// Convert UTF-8 encoded string to ISO-8859-1 encoded arraybuffer
res = iconv.convert("utf-8", "iso-8859-1", "hello", iconv.DATA_TYPE.STRING, iconv.DATA_TYPE.ARRAY_BUFFER)
log.info("Convert UTF-8 encoded string to ISO-8859-1 encoded arraybuffer: " + common.arrayBufferToHexString(res))

// Convert ISO-8859-1 encoded arraybuffer to UTF-8 encoded string
res = iconv.convert("iso-8859-1", "utf-8", res, iconv.DATA_TYPE.ARRAY_BUFFER, iconv.DATA_TYPE.STRING)
log.info("Convert ISO-8859-1 encoded string to UTF-8 encoded string: " + res)
```

## 6. API Reference

### Initialization Methods

- `iconv.convert(fromEncoding, toEncoding, data, fromType, toType)` - Convert character encoding
  - `fromEncoding`: Source character encoding
  - `toEncoding`: Target character encoding
  - `data`: Data to be converted
  - `fromType`: Source data type, default DATA_TYPE.STRING
  - `toType`: Target data type, default DATA_TYPE.ARRAY_BUFFER

## 7. Related Modules

None

## 8. Examples

None
