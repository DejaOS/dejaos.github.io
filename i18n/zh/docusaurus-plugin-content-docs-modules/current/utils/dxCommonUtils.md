# dxCommonUtils

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于通用加密、编码和文件系统工具函数。它被设计为无状态、类似单例的工具库，提供按逻辑命名空间组织的工具集合。

它包含全面的工具功能：

- **crypto**: 哈希（MD5、HMAC-MD5）、对称加密（AES）和非对称加密（RSA）。
- **fs**: 文件系统操作，例如将文件转换为/从 Base64。
- **codec**: 数据编码和解码函数（Hex、Base64、UTF-8、Little Endian 等）。
- **random**: 生成加密安全的随机字节和简单随机字符串。

## 2. 文件

- `dxCommonUtils.js`
- `libvbar-m-dxcommonutils.so`

> - 确保这 2 个文件包含在您项目根目录下的 dxmodules 子目录中。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 基本用法

```javascript
import dxCommonUtils from "./dxmodules/dxCommonUtils.js";
import log from "./dxmodules/dxLogger.js";

// 1. 使用 crypto 命名空间进行哈希
const md5Hash = dxCommonUtils.crypto.md5("hello world");
log.info("MD5 哈希:", md5Hash); // 预期: 5eb63bbbe01eeed093cb22bb8f5acdc3

// 2. 使用 codec 命名空间进行编码/解码
const hexString = dxCommonUtils.codec.strToUtf8Hex("你好");
log.info("UTF-8 转 Hex:", hexString); // 预期: e4bda0e5a5bd
const originalString = dxCommonUtils.codec.utf8HexToStr(hexString);
log.info("Hex 转 UTF-8:", originalString); // 预期: 你好

// 3. 使用 random 命名空间生成随机数据
const randomBytes = dxCommonUtils.random.getBytes(8);
log.info("8 个随机字节（hex）:", randomBytes);

// 4. 使用 fs 命名空间进行文件操作
const text = "This is a test file.";
const base64Text = dxCommonUtils.codec.arrayBufferToBase64(
  dxCommonUtils.codec.hexToArrayBuffer(
    dxCommonUtils.codec.strToUtf8Hex(text)
  )
);
const filePath = "/tmp/test.txt";
dxCommonUtils.fs.base64ToFile(filePath, base64Text);
log.info(`写入到 ${filePath}`);
const readBase64 = dxCommonUtils.fs.fileToBase64(filePath);
log.info(`从 ${filePath} 读取: ${readBase64}`);
```

## 6. API 参考

### Crypto 命名空间（`dxCommonUtils.crypto`）

#### `crypto.md5(data)`
计算输入数据的 MD5 哈希。
- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要哈希的数据。如果提供字符串，将被视为 UTF-8。（必需）
- **返回值：** `string` - 十六进制格式的 MD5 哈希。

#### `crypto.hmacMd5(data, key)`
使用提供的密钥计算 HMAC-MD5 哈希。
- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要哈希的数据。（必需）
  - `key` (string | ArrayBuffer | Uint8Array): HMAC 的密钥。（必需）
  - *注意：如果提供字符串，将被视为 UTF-8。*
- **返回值：** `string` - 十六进制格式的 HMAC-MD5 哈希。

#### `crypto.aes.encrypt(data, key, options)`
使用 AES 加密数据。
- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要加密的数据。如果是字符串，视为 UTF-8。（必需）
  - `key` (string | ArrayBuffer | Uint8Array): 加密密钥。如果是字符串，必须是 Hex。（必需）
  - `options` (object): 加密选项：`{ mode: 'CBC', keySize: 256, iv: '...' }`。（可选）
- **返回值：** `string` - Base64 编码的加密数据。

#### `crypto.aes.decrypt(encryptedData, key, options)`
解密 AES 加密的数据。
- **参数：**
  - `encryptedData` (string): 要解密的 Base64 编码数据。（必需）
  - `key` (string | ArrayBuffer | Uint8Array): 解密密钥。如果是字符串，必须是 Hex。（必需）
  - `options` (object): 解密选项。（可选）
- **返回值：** `string` - 解密的数据作为 UTF-8 字符串。

#### `crypto.aes.encryptWithRandomIV(data, key)`
AES-256-CBC 加密的便利方法，自动生成安全的 16 字节 IV。
- **参数：**
  - `data` (string): 要加密的 UTF-8 数据。（必需）
  - `key` (string | ArrayBuffer | Uint8Array): 32 字节加密密钥。如果是字符串，必须是 Hex。（必需）
- **返回值：** `object` - 包含 Base64 加密数据和生成的 IV 作为十六进制字符串的对象 `{ encrypted: "...", iv: "..." }`。

#### `crypto.rsa.generateKeyPair(bits)`
生成新的 RSA 密钥对。
- **参数：**
  - `bits` (number): 密钥大小（位）。必须是 `1024`、`2048`、`4096` 之一。默认为 `2048`。（可选）
- **返回值：** `object` - 包含 PEM 格式密钥的对象 `{ privateKey: "...", publicKey: "..." }`。

#### `crypto.rsa.encrypt(data, publicKey)`
使用 RSA 公钥加密数据。
- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要加密的数据。如果是字符串，视为 UTF-8。（必需）
  - `publicKey` (string): PEM 格式的 RSA 公钥。（必需）
- **返回值：** `string` - Base64 编码的加密数据。

#### `crypto.rsa.decrypt(encryptedData, privateKey)`
使用私钥解密 RSA 加密的数据。
- **参数：**
  - `encryptedData` (string): Base64 编码的加密数据。（必需）
  - `privateKey` (string): PEM 格式的 RSA 私钥。（必需）
- **返回值：** `string` - 解密的数据作为 UTF-8 字符串。

### FS 命名空间（`dxCommonUtils.fs`）

#### `fs.fileToBase64(filePath)`
读取文件的全部内容并作为 Base64 编码字符串返回。
- **参数：**
  - `filePath` (string): 文件的绝对路径。（必需）
- **返回值：** `string` - 文件的 Base64 编码内容。

#### `fs.base64ToFile(filePath, base64String)`
解码 Base64 字符串并将二进制数据写入文件。如果文件已存在，将覆盖它。
- **参数：**
  - `filePath` (string): 要写入的文件的绝对路径。（必需）
  - `base64String` (string): Base64 编码的数据。（必需）
- **返回值：** `boolean` - 成功时为 `true`。

### Random 命名空间（`dxCommonUtils.random`）

#### `random.getBytes(length)`
使用底层 OpenSSL 引擎生成加密安全的随机字节。
- **参数：**
  - `length` (number): 要生成的字节数。（必需）
- **返回值：** `string` - 随机字节表示为十六进制字符串。

#### `random.getStr(length, charset)`
使用 `Math.random()` 从给定字符集生成非加密安全的随机字符串。
- **参数：**
  - `length` (number): 要生成的字符串长度。（必需）
  - `charset` (string): 要使用的字符集。默认为字母数字。（可选）
- **返回值：** `string` - 生成的随机字符串。

### Codec 命名空间（`dxCommonUtils.codec`）
此命名空间包含用于在不同格式之间转换数据的各种函数。

**Hex `<->` 字节/字符串：**
- `codec.hexToBytes(hexString)`: 将十六进制字符串转换为字节数字数组。
- `codec.bytesToHex(byteArray)`: 将字节数字数组转换为十六进制字符串。
- `codec.hexToStr(hexString)`: 将十六进制字符串转换为单字节字符字符串（例如，ASCII）。
- `codec.strToHex(string)`: 将单字节字符字符串转换为十六进制字符串。
- `codec.strToUtf8Hex(string)`: 将任何字符串（包括多字节字符）转换为 UTF-8 十六进制字符串。
- `codec.utf8HexToStr(hexString)`: 将 UTF-8 十六进制字符串转换回字符串。

**Hex `<->` ArrayBuffer/Uint8Array：**
- `codec.hexToArrayBuffer(hexString)`: 将十六进制字符串转换为 `ArrayBuffer`。
- `codec.hexToUint8Array(hexString)`: 将十六进制字符串转换为 `Uint8Array`。
- `codec.arrayBufferToHex(arrayBuffer)`: 将 `ArrayBuffer` 转换为十六进制字符串。
- `codec.uint8ArrayToHex(uint8Array)`: 将 `Uint8Array` 转换为十六进制字符串。

**Base64 `<->` ArrayBuffer：**
- `codec.base64ToArrayBuffer(base64String)`: 将 Base64 字符串解码为 `ArrayBuffer`。
- `codec.arrayBufferToBase64(arrayBuffer)`: 将 `ArrayBuffer` 编码为 Base64 字符串。

**Little Endian `<->` 十进制：**
- `codec.leToDecimal(hexString)`: 将小端十六进制字符串转换为十进制数字。
- `codec.decimalToLeHex(decimalNumber, byteSize)`: 将十进制数字转换为指定字节大小的小端十六进制字符串。

**BCC**
- `codec.bcc(data)`: 计算输入数据的 BCC（块校验字符/XOR 校验和）。
- **返回值：** 计算的 8 位 BCC 值（0-255）。

## 7. 常量

### AES 常量
```javascript
dxCommonUtils.AES_MODE = {
    ECB: 'ECB',
    CBC: 'CBC',
    CFB: 'CFB',
    OFB: 'OFB',
    CTR: 'CTR'
};

dxCommonUtils.AES_KEY_SIZE = {
    BITS_128: 128,
    BITS_192: 192,
    BITS_256: 256
};
```

### RSA 常量
```javascript
dxCommonUtils.RSA_KEY_SIZE = {
    BITS_1024: 1024,
    BITS_2048: 2048,
    BITS_4096: 4096
};
```

## 8. 相关模块

- **dxCommon:** 已弃用。被 dxOs 和 dxCommonUtils 替代。
- **dxCryptoES**
此模块与 `dxCommonUtils` 有功能重叠。主要区别是底层实现，这影响性能和功能集。根据您的具体需求选择合适的模块。

| 功能             | dxCryptoES（纯 JS）                  | dxCommonUtils（C/原生）            |
|---------------------|---------------------------------------|-------------------------------------|
| **性能**     | 较低                                 | **高（硬件加速）**     |
| **哈希**         | **广泛支持（SHA2/3 等）**       | 有限（仅 MD5）                  |
| **对称密码** | **广泛支持（AES、DES 等）**     | 仅 AES                            |
| **非对称（RSA）**  | 否                                    | **是**                             |
| **密钥派生**    | **是（PBKDF2）**                      | 否                                  |
| **安全性**        | 提供现代、安全的算法    | 提供快速但较旧的算法  |

## 9. 示例

```javascript
function testCrypto() {
  log.info('--- 测试 Crypto 命名空间 ---');

  // --- MD5 ---
  const md5Input = "hello world";
  const md5Expected = "5eb63bbbe01eeed093cb22bb8f5acdc3";
  assert(dxCommonUtils.crypto.md5(md5Input), md5Expected, "crypto.md5 (字符串)");
  const md5InputBuffer = dxCommonUtils.codec.hexToArrayBuffer("68656c6c6f20776f726c64"); // "hello world"
  assert(dxCommonUtils.crypto.md5(md5InputBuffer), md5Expected, "crypto.md5 (ArrayBuffer)");
  assert(dxCommonUtils.crypto.md5(new Uint8Array(md5InputBuffer)), md5Expected, "crypto.md5 (Uint8Array)");

  // --- HMAC-MD5 ---
  const hmacInput = "hello world";
  const hmacKey = "secret";
  const hmacExpected = "78d6997b1230f38e59b6d1642dfaa3a4";
  assert(dxCommonUtils.crypto.hmacMd5(hmacInput, hmacKey), hmacExpected, "crypto.hmacMd5 (字符串)");
  const hmacInputBuffer = dxCommonUtils.codec.hexToArrayBuffer("68656c6c6f20776f726c64"); // "hello world"
  const hmacKeyBuffer = dxCommonUtils.codec.hexToArrayBuffer("736563726574"); // "secret"
  assert(dxCommonUtils.crypto.hmacMd5(hmacInputBuffer, hmacKeyBuffer), hmacExpected, "crypto.hmacMd5 (ArrayBuffer)");

  // --- AES ---
  const aesKeyHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // 64 个十六进制字符 = 32 字节用于 AES-256
  const aesIvHex = "fedcba9876543210fedcba9876543210"; // 32 个十六进制字符 = 16 字节
  const aesPlaintext = "This is a secret message.";

  // 使用十六进制字符串输入测试密钥/IV
  const encrypted = dxCommonUtils.crypto.aes.encrypt(aesPlaintext, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesIvHex
  });
  const encryptedExpected = "qKKzNoy1wAZv7hdMAa2Cane6faYMXvlybqJZ50cFVTU=";
  assert(encrypted, encryptedExpected, "crypto.aes.encrypt (字符串输入)");
  const decrypted = dxCommonUtils.crypto.aes.decrypt(encrypted, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesIvHex
  });
  assert(decrypted, aesPlaintext, "crypto.aes.encrypt/decrypt (字符串输入)");

  // 使用 ArrayBuffer 输入测试密钥/IV
  const aesKeyBuffer = dxCommonUtils.codec.hexToArrayBuffer(aesKeyHex);
  const aesIvBuffer = dxCommonUtils.codec.hexToArrayBuffer(aesIvHex);
  const encryptedWithBuffer = dxCommonUtils.crypto.aes.encrypt(aesPlaintext, aesKeyBuffer, {
    iv: aesIvBuffer
  });
  const decryptedWithBuffer = dxCommonUtils.crypto.aes.decrypt(encryptedWithBuffer, aesKeyBuffer, {
    iv: aesIvBuffer
  });
  assert(decryptedWithBuffer, aesPlaintext, "crypto.aes.encrypt/decrypt (ArrayBuffer 输入)");

  // --- 带随机 IV 的 AES ---
  const aesRandIvResult = dxCommonUtils.crypto.aes.encryptWithRandomIV(aesPlaintext, aesKeyHex);
  assert(typeof aesRandIvResult.encrypted, 'string', "crypto.aes.encryptWithRandomIV 返回加密字符串");
  assert(/^[0-9a-fA-F]{32}$/.test(aesRandIvResult.iv), true, "crypto.aes.encryptWithRandomIV 返回 32 字符十六进制 IV");
  const decryptedRand = dxCommonUtils.crypto.aes.decrypt(aesRandIvResult.encrypted, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesRandIvResult.iv
  });
  assert(decryptedRand, aesPlaintext, "crypto.aes.encryptWithRandomIV (解密)");

  // --- RSA ---
  const rsaPlaintext = "Big secret stored here.";
  const keyPair = dxCommonUtils.crypto.rsa.generateKeyPair(dxCommonUtils.RSA_KEY_SIZE.BITS_1024); // 在测试中使用 1024 以提高速度
  assert(keyPair.privateKey.includes("-----BEGIN PRIVATE KEY-----"), true, "crypto.rsa.generateKeyPair (私钥)");
  assert(keyPair.publicKey.includes("-----BEGIN PUBLIC KEY-----"), true, "crypto.rsa.generateKeyPair (公钥)");

  // 使用字符串明文测试
  const rsaEncrypted = dxCommonUtils.crypto.rsa.encrypt(rsaPlaintext, keyPair.publicKey);
  const rsaDecrypted = dxCommonUtils.crypto.rsa.decrypt(rsaEncrypted, keyPair.privateKey);
  assert(rsaDecrypted, rsaPlaintext, "crypto.rsa.encrypt/decrypt (字符串)");

  // 使用 ArrayBuffer 明文测试
  const rsaPlaintextBuffer = dxCommonUtils.codec.hexToArrayBuffer(dxCommonUtils.codec.strToUtf8Hex(rsaPlaintext));
  const rsaEncryptedBuffer = dxCommonUtils.crypto.rsa.encrypt(rsaPlaintextBuffer, keyPair.publicKey);
  const rsaDecryptedBuffer = dxCommonUtils.crypto.rsa.decrypt(rsaEncryptedBuffer, keyPair.privateKey);
  assert(rsaDecryptedBuffer, rsaPlaintext, "crypto.rsa.encrypt/decrypt (ArrayBuffer)");
}

function testCodec() {
  log.info('--- 测试 Codec 命名空间 ---');

  const bytes = [72, 101, 108, 108, 111, 32, 228, 189, 160, 229, 165, 189]; // "Hello 你好"
  const hex = "48656c6c6f20e4bda0e5a5bd";
  const strAscii = "Hello World";
  const hexAscii = "48656c6c6f20576f726c64";
  const strUtf8 = "你好世界";
  const hexUtf8 = "e4bda0e5a5bd_e4b896e7958c"; // 使用 _ 提高可读性

  // 字节 <-> Hex
  assert(dxCommonUtils.codec.bytesToHex(bytes), hex.toLowerCase(), "codec.bytesToHex");
  assert(dxCommonUtils.codec.hexToBytes(hex), bytes, "codec.hexToBytes");

  // 原始字符串（ASCII）<-> Hex
  const strWithLowAscii = "\tHello\n"; // \t=9, \n=10
  const hexWithLowAscii = "0948656c6c6f0a";
  assert(dxCommonUtils.codec.strToHex(strWithLowAscii), hexWithLowAscii, "codec.strToHex (带低 ASCII)");
  assert(dxCommonUtils.codec.hexToStr(hexWithLowAscii), strWithLowAscii, "codec.hexToStr (带低 ASCII)");
  assert(dxCommonUtils.codec.strToHex(strAscii), hexAscii.toLowerCase(), "codec.strToHex (ASCII)");
  assert(dxCommonUtils.codec.hexToStr(hexAscii), strAscii, "codec.hexToStr (ASCII)");

  // UTF8 字符串 <-> Hex
  assert(dxCommonUtils.codec.strToUtf8Hex(strUtf8), hexUtf8.replace(/_/g, ''), "codec.strToUtf8Hex (UTF8)");
  assert(dxCommonUtils.codec.utf8HexToStr(hexUtf8.replace(/_/g, '')), strUtf8, "codec.utf8HexToStr (UTF8)");

  // ArrayBuffer 和 Uint8Array <-> Hex
  const uint8 = dxCommonUtils.codec.hexToUint8Array(hex);
  const buffer = uint8.buffer;
  assert(dxCommonUtils.codec.arrayBufferToHex(buffer), hex.toLowerCase(), "codec.arrayBufferToHex");
  assert(dxCommonUtils.codec.uint8ArrayToHex(uint8), hex.toLowerCase(), "codec.uint8ArrayToHex");

  // 小端
  assert(dxCommonUtils.codec.decimalToLeHex(300, 2), "2c01", "codec.decimalToLeHex");
  assert(dxCommonUtils.codec.leToDecimal("2c01"), 300, "codec.leToDecimal");

  // 验证
  try {
    dxCommonUtils.codec.hexToBytes("123"); // 奇数长度
    assert(false, true, "codec.hexToBytes 应该在奇数长度时抛出");
  } catch (e) {
    assert(e.message.includes("even length"), true, "codec.hexToBytes 在奇数长度时抛出");
  }
  try {
    dxCommonUtils.codec.hexToBytes("123g"); // 无效字符
    assert(false, true, "codec.hexToBytes 应该在无效字符时抛出");
  } catch (e) {
    assert(e.message.includes("valid hex string"), true, "codec.hexToBytes 在无效字符时抛出");
  }

  // BCC（XOR 校验和）
  const bccStr = "12345"; // ASCII: 0x31, 0x32, 0x33, 0x34, 0x35
  // 0x31^0x32^0x33^0x34^0x35 = 49 (0x31)
  assert(dxCommonUtils.codec.bcc(bccStr), 49, "codec.bcc (ASCII 字符串)");
  const bccUtf8 = "你好"; // UTF-8 Hex: e4 bd a0 e5 a5 bd
  // 0xe4 ^ 0xbd ^ 0xa0 ^ 0xe5 ^ 0xa5 ^ 0xbd = 4
  assert(dxCommonUtils.codec.bcc(bccUtf8), 4, "codec.bcc (UTF-8 字符串)");
  const bccBuffer = dxCommonUtils.codec.hexToArrayBuffer("01020304");
  // 1 ^ 2 ^ 3 ^ 4 = 4
  assert(dxCommonUtils.codec.bcc(bccBuffer), 4, "codec.bcc (ArrayBuffer)");
}

function testRandom() {
  log.info('--- 测试 Random 命名空间 ---');

  // 安全随机字节
  const randomBytesHex = dxCommonUtils.random.getBytes(16);
  assert(randomBytesHex.length, 32, "random.getBytes 返回正确的十六进制字符串长度");
  assert(/^[0-9a-fA-F]{32}$/.test(randomBytesHex), true, "random.getBytes 返回有效的十六进制字符串");

  // 非安全随机字符串
  const randomStr = dxCommonUtils.random.getStr(10);
  assert(randomStr.length, 10, "random.getStr 返回正确长度");
  const customCharset = "abc";
  const randomStrCustom = dxCommonUtils.random.getStr(5, customCharset);
  assert([...randomStrCustom].every(c => customCharset.includes(c)), true, "random.getStr 使用自定义字符集");
}

function testFs() {
  log.info('--- 测试 FS 命名空间 ---');

  const testString = "Hello, file system!";
  const testBase64 = "SGVsbG8sIGZpbGUgc3lzdGVtIQ=="; // "Hello, file system!"
  const testFilePath = "/tmp/dxCommonUtils_test.txt";

  // 1. 将 Base64 写入文件
  const writeResult = dxCommonUtils.fs.base64ToFile(testFilePath, testBase64);
  assert(writeResult, true, "fs.base64ToFile 成功时返回 true");

  // 2. 将文件读回 Base64
  const readBase64 = dxCommonUtils.fs.fileToBase64(testFilePath);
  assert(readBase64, testBase64, "fs.fileToBase64 读回正确内容");

  // 3. 测试空文件情况（通过写入空字符串）
  dxCommonUtils.fs.base64ToFile(testFilePath, "");
  const emptyRead = dxCommonUtils.fs.fileToBase64(testFilePath);
  assert(emptyRead, "", "fs.fileToBase64 处理空文件");

  // 4. 测试读取不存在的文件（应该抛出）
  try {
    dxCommonUtils.fs.fileToBase64("/tmp/non_existent_file_12345.txt");
    assert(false, true, "fs.fileToBase64 在不存在的文件上应该抛出");
  } catch (e) {
    assert(e.message.includes("Failed to open file"), true, "fs.fileToBase64 在不存在的文件上抛出正确错误");
  }
}
```