# dxCryptoES

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，提供全面的现代加密算法套件。它基于 **CryptoES** (https://github.com/entronad/crypto-es)，这是一个受流行的 CryptoJS 启发的纯 JavaScript 库，提供熟悉的 API，同时与 ES6 和现代 JavaScript 环境兼容。

它适用于需要广泛加密算法和灵活性的场景，其中纯 JavaScript 实现是可接受的。

包含丰富的加密功能：

- **哈希**：MD5、SHA-1、SHA-2（SHA-256、SHA-512 等）、SHA-3、RIPEMD-160。
- **HMAC**：使用任何支持的哈希函数进行基于密钥的哈希消息认证。
- **对称密码**：AES、TripleDES、Rabbit、RC4、Blowfish 用于加密和解密。
- **密钥派生**：PBKDF2 用于从密码派生加密密钥。
- **编码器**：用于在 Base64、Hex 和 Utf8 等格式之间转换数据的工具。

## 2. 文件

- `crypto-es` 目录，包含完整的库。
  - `crypto-es/index.js`（主模块入口点）

> 确保 `crypto-es` 目录包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- 无。

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 哈希
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

// 计算消息的 SHA-256 哈希
const message = "This is a test message";
const hash = CryptoES.SHA256(message);

// 输出是 WordArray 对象，使用 .toString() 获取十六进制字符串
log.info(hash.toString());
// 例如，"b23546a7862a5367527b469b6623c52a353d213a899a19c67644910a30e8c4d2"
```

### HMAC
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

const message = "Message for HMAC";
const key = "my-secret-key";

// 计算 HMAC-SHA256
const hmac = CryptoES.HmacSHA256(message, key);
log.info(hmac.toString());
```

### 对称加密（AES）
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

const plainText = "This is a secret message.";
const secretKey = "my-super-secret-key";

// 加密
const ciphertext = CryptoES.AES.encrypt(plainText, secretKey).toString();
log.info("加密:", ciphertext);

// 解密
const bytes = CryptoES.AES.decrypt(ciphertext, secretKey);
const decryptedText = bytes.toString(CryptoES.enc.Utf8);
log.info("解密:", decryptedText);
```

## 6. API 参考

### 哈希函数
- `CryptoES.MD5(message)`
- `CryptoES.SHA1(message)`
- `CryptoES.SHA256(message)`
- `CryptoES.SHA512(message)`
- `CryptoES.SHA3(message, config)`
- `CryptoES.RIPEMD160(message)`

### HMAC 函数
- `CryptoES.HmacMD5(message, key)`
- `CryptoES.HmacSHA1(message, key)`
- `CryptoES.HmacSHA256(message, key)`
- `CryptoES.HmacSHA512(message, key)`

### 密码函数
- `CryptoES.AES.encrypt(message, key, config)`
- `CryptoES.AES.decrypt(ciphertext, key, config)`
- `CryptoES.TripleDES.encrypt(message, key, config)`
- `CryptoES.TripleDES.decrypt(ciphertext, key, config)`
- `CryptoES.Rabbit.encrypt(message, key, config)`
- `CryptoES.Rabbit.decrypt(ciphertext, key, config)`
- 更多（RC4、Blowfish）。

### 密钥派生
- `CryptoES.PBKDF2(password, salt, options)`

### 编码器
- `CryptoES.enc.Hex`
- `CryptoES.enc.Base64`
- `CryptoES.enc.Utf8`

## 7. 相关模块

此模块与 `dxCommonUtils` 有功能重叠。主要区别是底层实现，这影响性能和功能集。根据您的具体需求选择合适的模块。

| 功能             | dxCryptoES（纯 JS）                  | dxCommonUtils（C/原生）            |
|---------------------|---------------------------------------|-------------------------------------|
| **性能**     | 较低                                 | **高（硬件加速）**     |
| **哈希**         | **广泛支持（SHA2/3 等）**       | 有限（仅 MD5）                  |
| **对称密码** | **广泛支持（AES、DES 等）**     | 仅 AES                            |
| **非对称（RSA）**  | 否                                    | **是**                             |
| **密钥派生**    | **是（PBKDF2）**                      | 否                                  |
| **安全性**        | 提供现代、安全的算法    | 提供快速但较旧的算法  |

## 8. 示例

```javascript
// =================================================================
// 1. 哈希算法
// =================================================================
log.info('--- 1. 哈希算法 ---');
const message = "Message";
log.info('MD5:', CryptoES.MD5(message).toString());
log.info('SHA1:', CryptoES.SHA1(message).toString());
log.info('SHA256:', CryptoES.SHA256(message).toString());
log.info('SHA512:', CryptoES.SHA512(message).toString());
log.info('SHA3 (512 位):', CryptoES.SHA3(message, { outputLength: 512 }).toString());
log.info('SHA3 (256 位):', CryptoES.SHA3(message, { outputLength: 256 }).toString());
log.info('RIPEMD160:', CryptoES.RIPEMD160(message).toString());

// =================================================================
// 2. 渐进式哈希（用于大数据）
// =================================================================
log.info('--- 2. 渐进式哈希 ---');
const sha256 = CryptoES.algo.SHA256.create();
sha256.update("Message Part 1");
sha256.update("Message Part 2");
sha256.update("Message Part 3");
const hash = sha256.finalize();
const expectedHash = CryptoES.SHA256("Message Part 1Message Part 2Message Part 3").toString();
log.info('渐进式 SHA256 哈希:', hash.toString());
assertEquals(expectedHash, hash.toString(), '渐进式哈希应该匹配一次性哈希');

// =================================================================
// 3. HMAC（基于哈希的消息认证码）
// =================================================================
log.info('--- 3. HMAC ---');
const hmacKey = 'my-secret-key';
const hmacMessage = 'This is a message to authenticate.';
log.info('HMAC-SHA256:', CryptoES.HmacSHA256(hmacMessage, hmacKey).toString());
log.info('HMAC-MD5:', CryptoES.HmacMD5(hmacMessage, hmacKey).toString());

// =================================================================
// 4. 对称加密 - AES
// =================================================================
log.info('--- 4. 对称加密（AES）---');
const aesKey = 'my-super-secret-key-123';
const plainText = 'This is a top secret message.';

// 加密
const ciphertext = CryptoES.AES.encrypt(plainText, aesKey);
log.info('AES 加密（Base64）:', ciphertext.toString());

// 解密
const bytes = CryptoES.AES.decrypt(ciphertext.toString(), aesKey);
const decryptedText = bytes.toString(CryptoES.enc.Utf8);
log.info('AES 解密:', decryptedText);
assertEquals(plainText, decryptedText, "AES 解密应该匹配原始明文");

// =================================================================
// 5. 密钥派生 - PBKDF2
// =================================================================
log.info('--- 5. 密钥派生（PBKDF2）---');
const password = 'my-secure-password';
const salt = CryptoES.lib.WordArray.random(128 / 8); // 128 位盐

const derivedKey = CryptoES.PBKDF2(password, salt, {
    keySize: 512 / 32, // 512 位
    iterations: 100 // 为更快测试而降低
});
log.info('PBKDF2 盐（十六进制）:', salt.toString());
log.info('PBKDF2 派生密钥（十六进制）:', derivedKey.toString());
assertEquals(512 / 8, derivedKey.sigBytes, '派生密钥应该是 64 字节（512 位）');

// =================================================================
// 6. 编码
// =================================================================
log.info('--- 6. 编码 ---');
const originalText = 'Hello, World!';
const words = CryptoES.enc.Utf8.parse(originalText);
log.info('原始文本:', originalText);

const base64 = CryptoES.enc.Base64.stringify(words);
log.info('编码 Base64:', base64);
const base64Decoded = CryptoES.enc.Base64.parse(base64).toString(CryptoES.enc.Utf8);
assertEquals(originalText, base64Decoded, 'Base64 编码往返应该成功');

const hex = CryptoES.enc.Hex.stringify(words);
log.info('编码十六进制:', hex);
const hexDecoded = CryptoES.enc.Hex.parse(hex).toString(CryptoES.enc.Utf8);
assertEquals(originalText, hexDecoded, '十六进制编码往返应该成功');

// =================================================================
// 7. 高级密码用法（带自定义选项的 AES）
// =================================================================
log.info('--- 7. 高级密码用法（带自定义选项的 AES）---');
const keyHex = '000102030405060708090a0b0c0d0e0f';
const ivHex = '101112131415161718191a1b1c1d1e1f';
const customKey = CryptoES.enc.Hex.parse(keyHex);
const customIv = CryptoES.enc.Hex.parse(ivHex);

// 使用自定义密钥和 IV 测试
const encryptedWithCustoms = CryptoES.AES.encrypt(plainText, customKey, { iv: customIv });
const decryptedWithCustoms = CryptoES.AES.decrypt(encryptedWithCustoms, customKey, { iv: customIv });
assertEquals(plainText, decryptedWithCustoms.toString(CryptoES.enc.Utf8), '带自定义密钥/IV 的 AES 应该工作');

// 使用不同块模式和填充测试
const encryptedWithMode = CryptoES.AES.encrypt(plainText, aesKey, {
    mode: CryptoES.mode.CFB,
    padding: CryptoES.pad.AnsiX923
});
const decryptedWithMode = CryptoES.AES.decrypt(encryptedWithMode, aesKey, {
    mode: CryptoES.mode.CFB,
    padding: CryptoES.pad.AnsiX923
});
assertEquals(plainText, decryptedWithMode.toString(CryptoES.enc.Utf8), '带自定义模式/填充的 AES 应该工作');

// =================================================================
// 8. 其他密码算法
// =================================================================
log.info('--- 8. 其他密码算法 ---');
// TripleDES
const tripleDesEnc = CryptoES.TripleDES.encrypt(plainText, aesKey);
const tripleDesDec = CryptoES.TripleDES.decrypt(tripleDesEnc, aesKey);
assertEquals(plainText, tripleDesDec.toString(CryptoES.enc.Utf8), 'TripleDES 加密往返应该成功');

// Rabbit 流密码
const rabbitEnc = CryptoES.Rabbit.encrypt(plainText, aesKey);
const rabbitDec = CryptoES.Rabbit.decrypt(rabbitEnc, aesKey);
assertEquals(plainText, rabbitDec.toString(CryptoES.enc.Utf8), 'Rabbit 加密往返应该成功');

// =================================================================
// 9. 渐进式 HMAC
// =================================================================
log.info('--- 9. 渐进式 HMAC ---');
const progressiveHmac = CryptoES.algo.HMAC.create(CryptoES.algo.SHA256, hmacKey);
progressiveHmac.update("Message Part 1");
progressiveHmac.update("Message Part 2");
const hmacResult = progressiveHmac.finalize();
const expectedHmac = CryptoES.HmacSHA256("Message Part 1Message Part 2", hmacKey).toString();
assertEquals(expectedHmac, hmacResult.toString(), '渐进式 HMAC 应该匹配一次性 HMAC');

// =================================================================
// 10. 处理二进制数据（ArrayBuffer/Uint8Array）
// =================================================================
log.info('--- 10. 处理二进制数据（ArrayBuffer/Uint8Array）---');
const binaryData = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 255, 254, 253]);
const wordArray = CryptoES.lib.WordArray.create(binaryData.buffer);

const encryptedBinary = CryptoES.AES.encrypt(wordArray, aesKey);
const decryptedBinaryCipherParams = CryptoES.AES.decrypt(encryptedBinary, aesKey);

// 将 WordArray 转换回 Uint8Array
const decryptedBinary = wordA_to_u8a(decryptedBinaryCipherParams);
assertArraysEqual(binaryData, decryptedBinary, "二进制数据加密往返应该成功");
```