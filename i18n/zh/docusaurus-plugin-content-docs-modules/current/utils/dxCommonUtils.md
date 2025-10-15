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
  dxCommonUtils.codec.hexToArrayBuffer(dxCommonUtils.codec.strToUtf8Hex(text))
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
  - `data` (string | ArrayBuffer | Uint8Array): 要哈希的数据。如果提供字符串,将被视为 UTF-8。（必需）
- **返回值：** `string` - 十六进制格式的 MD5 哈希。

#### `crypto.hmacMd5(data, key)`

使用提供的密钥计算 HMAC-MD5 哈希。

- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要哈希的数据。（必需）
  - `key` (string | ArrayBuffer | Uint8Array): HMAC 的密钥。（必需）
  - _注意：如果提供字符串，将被视为 UTF-8。_
- **返回值：** `string` - 十六进制格式的 HMAC-MD5 哈希。

#### `crypto.hash(data, hashAlgorithm)`

使用指定算法计算输入数据的哈希。

- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要哈希的数据。如果提供字符串，将被视为 UTF-8。（必需）
  - `hashAlgorithm` (string): 要使用的哈希算法（例如 'SHA-256'、'MD5'、'SHA1'、'SHA-384'、'SHA-512'）。默认为 'SHA-256'。（可选）
- **返回值：** `string` - 十六进制格式的哈希值。

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
- **返回值：** `ArrayBuffer|null` - 解密的数据作为 ArrayBuffer。解密失败时返回 null。

#### `crypto.rsa.sign(data, privateKey, hashAlgorithm)`

使用 RSA 私钥为数据创建数字签名。这是 JWT (RS256/RS384/RS512) 等标准所需的核心函数。

- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 要签名的数据。如果是字符串，将被视为 UTF-8。（必需）
  - `privateKey` (string): PEM 格式的 RSA 私钥。（必需）
  - `hashAlgorithm` (string): 要使用的哈希算法（例如 'SHA-256'、'SHA-384'、'SHA-512'）。默认为 'SHA-256'。（可选）
- **返回值：** `string` - Base64 编码的签名字符串。

#### `crypto.rsa.verify(data, signature, publicKey, hashAlgorithm)`

使用 RSA 公钥验证数字签名。这是 `rsa.sign` 的对应函数，用于验证 JWT 等签名。

- **参数：**
  - `data` (string | ArrayBuffer | Uint8Array): 原始的未签名数据。（必需）
  - `signature` (string | ArrayBuffer | Uint8Array): 要验证的签名。如果是字符串，必须是 Base64 编码。（必需）
  - `publicKey` (string): PEM 格式的 RSA 公钥。（必需）
  - `hashAlgorithm` (string): 签名时使用的哈希算法（例如 'SHA-256'、'SHA-384'、'SHA-512'）。默认为 'SHA-256'。（可选）
- **返回值：** `boolean` - 如果签名有效则返回 true，否则返回 false。

#### `crypto.parsePEM(pemString)`

解析 PEM 格式的 X.509 证书并返回其详细信息。

- **参数：**
  - `pemString` (string): PEM 格式的证书内容。（必需）
- **返回值：** `object` - 包含证书详细信息的对象：
  - `serialNumber` (string): 证书序列号。
  - `issuer` (string): 证书颁发者。
  - `subject` (string): 证书主题。
  - `validFrom` (string): 证书有效期开始日期。
  - `validTo` (string): 证书有效期结束日期。
  - `publicKey` (string): PEM 格式的公钥。

#### `crypto.verifyCertificate(certPEM, caCertPEM)`

验证证书是否由给定的证书颁发机构 (CA) 签名。

- **参数：**
  - `certPEM` (string): 要验证的证书，PEM 格式。（必需）
  - `caCertPEM` (string): CA 的证书，PEM 格式。（必需）
- **返回值：** `boolean` - 如果证书由 CA 签名则返回 true。
- **抛出：** `Error` - 如果由于解析错误或签名不匹配导致原生验证失败。

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
  ECB: "ECB",
  CBC: "CBC",
  CFB: "CFB",
  OFB: "OFB",
  CTR: "CTR",
};

dxCommonUtils.AES_KEY_SIZE = {
  BITS_128: 128,
  BITS_192: 192,
  BITS_256: 256,
};
```

### RSA 常量

```javascript
dxCommonUtils.RSA_KEY_SIZE = {
  BITS_1024: 1024,
  BITS_2048: 2048,
  BITS_4096: 4096,
};
```

## 8. 相关模块

- **dxCommon:** 已弃用。被 dxOs 和 dxCommonUtils 替代。
- **dxCryptoES**
  此模块与 `dxCommonUtils` 有功能重叠。主要区别是底层实现，这影响性能和功能集。根据您的具体需求选择合适的模块。

| 功能              | dxCryptoES（纯 JS）         | dxCommonUtils（C/原生） |
| ----------------- | --------------------------- | ----------------------- |
| **性能**          | 较低                        | **高（硬件加速）**      |
| **哈希**          |   广泛支持                  |  广泛支持               |
| **对称密码**      | **广泛支持（AES、DES 等）** | 仅 AES                  |
| **非对称（RSA）** | 否                          | **是**                  |
| **密钥派生**      | **是（PBKDF2）**            | 否                      |
| **安全性**        | 提供现代、安全的算法        | 提供快速但较旧的算法    |

## 9. 示例

```javascript
function testCrypto() {
  log.info('--- Testing Crypto Namespace ---');

  // --- MD5 ---
  const md5Input = "hello world";
  const md5Expected = "5eb63bbbe01eeed093cb22bb8f5acdc3";
  assert(dxCommonUtils.crypto.md5(md5Input), md5Expected, "crypto.md5 (string)");
  const md5InputBuffer = dxCommonUtils.codec.hexToArrayBuffer("68656c6c6f20776f726c64"); // "hello world"
  assert(dxCommonUtils.crypto.md5(md5InputBuffer), md5Expected, "crypto.md5 (ArrayBuffer)");
  assert(dxCommonUtils.crypto.md5(new Uint8Array(md5InputBuffer)), md5Expected, "crypto.md5 (Uint8Array)");

  // --- HMAC-MD5 ---
  const hmacInput = "hello world";
  const hmacKey = "secret";
  const hmacExpected = "78d6997b1230f38e59b6d1642dfaa3a4";
  assert(dxCommonUtils.crypto.hmacMd5(hmacInput, hmacKey), hmacExpected, "crypto.hmacMd5 (string)");
  const hmacInputBuffer = dxCommonUtils.codec.hexToArrayBuffer("68656c6c6f20776f726c64"); // "hello world"
  const hmacKeyBuffer = dxCommonUtils.codec.hexToArrayBuffer("736563726574"); // "secret"
  assert(dxCommonUtils.crypto.hmacMd5(hmacInputBuffer, hmacKeyBuffer), hmacExpected, "crypto.hmacMd5 (ArrayBuffer)");

  // --- Hash ---
  const hashInput = "hello world";
  const sha256Expected = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
  assert(dxCommonUtils.crypto.hash(hashInput), sha256Expected, "crypto.hash (defaults to SHA-256)");
  assert(dxCommonUtils.crypto.hash(hashInput, 'SHA-256'), sha256Expected, "crypto.hash (SHA-256)");

  const sha512Expected = "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f";
  assert(dxCommonUtils.crypto.hash(hashInput, 'SHA-512'), sha512Expected, "crypto.hash (SHA-512)");
  assert(dxCommonUtils.crypto.hash(hashInput, 'MD5'), md5Expected, "crypto.hash (MD5 matches crypto.md5)");

  // --- AES ---
  const aesKeyHex = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // 64 hex chars = 32 bytes for AES-256
  const aesIvHex = "fedcba9876543210fedcba9876543210"; // 32 hex chars = 16 bytes
  const aesPlaintext = "This is a secret message.";

  // Test with Hex String inputs for key/iv
  const encrypted = dxCommonUtils.crypto.aes.encrypt(aesPlaintext, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesIvHex
  });
  const encryptedExpected = "qKKzNoy1wAZv7hdMAa2Cane6faYMXvlybqJZ50cFVTU=";
  assert(encrypted, encryptedExpected, "crypto.aes.encrypt (string inputs)");
  const decrypted = dxCommonUtils.crypto.aes.decrypt(encrypted, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesIvHex
  });
  assert(_arrayBufferToUtf8String(decrypted), aesPlaintext, "crypto.aes.encrypt/decrypt (string inputs)");

  // Test with ArrayBuffer inputs for key/iv (non-salted)
  const aesKeyBuffer = dxCommonUtils.codec.hexToArrayBuffer(aesKeyHex);
  const aesIvBuffer = dxCommonUtils.codec.hexToArrayBuffer(aesIvHex);
  const encryptedWithBuffer = dxCommonUtils.crypto.aes.encrypt(aesPlaintext, aesKeyBuffer, {
    iv: aesIvBuffer
  });
  const decryptedWithBufferRaw = dxCommonUtils.crypto.aes.decrypt(encryptedWithBuffer, aesKeyBuffer, {
    iv: aesIvBuffer
  });
  assert(_arrayBufferToUtf8String(decryptedWithBufferRaw), aesPlaintext, "crypto.aes.encrypt/decrypt (non-salted, ArrayBuffer inputs)");

  // --- AES (Salted) ---
  const saltPassword = "a_very_secret_password";
  const saltedEncrypted = dxCommonUtils.crypto.aes.encrypt(aesPlaintext, saltPassword, {
    mode: dxCommonUtils.AES_MODE.ECB, // Use ECB for simplicity as IV is derived
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    useSalt: true
  });
  const saltedDecryptedBuffer = dxCommonUtils.crypto.aes.decrypt(saltedEncrypted, saltPassword, {
    mode: dxCommonUtils.AES_MODE.ECB,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256
  });
  assert(_arrayBufferToUtf8String(saltedDecryptedBuffer), aesPlaintext, "crypto.aes.encrypt/decrypt (salted)");

  // --- AES (NoPadding) ---
  const noPadPlaintext = "16-byte-aligned."; // 16 bytes
  const noPadEncrypted = dxCommonUtils.crypto.aes.encrypt(noPadPlaintext, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.ECB,
    padding: dxCommonUtils.AES_PADDING.NONE
  });
  const noPadDecryptedBuffer = dxCommonUtils.crypto.aes.decrypt(noPadEncrypted, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.ECB,
    padding: dxCommonUtils.AES_PADDING.NONE
  });
  assert(_arrayBufferToUtf8String(noPadDecryptedBuffer), noPadPlaintext, "crypto.aes.encrypt/decrypt (NoPadding)");
  try {
    dxCommonUtils.crypto.aes.encrypt("not aligned", aesKeyHex, { padding: dxCommonUtils.AES_PADDING.NONE });
    assert(false, true, "AES with NoPadding should throw on unaligned data");
  } catch (e) {
    assert(e.message.includes("multiple of 16 bytes"), true, "AES with NoPadding throws correct error");
  }

  // --- AES (Real-world Salted Example from user) ---
  const realWorldPassword = "rwK8OclQiw9pXFEr65JiZPTVRwgzzxte";
  const realWorldEncrypted = "U2FsdGVkX1++UZMsV0HaQFSHxKcsIAXr8JNm+Xn82v92UtSSAXoJTS0pIsNVGUJWS7YkqGgqxCD1wQz/mURhTs6cE9g2u1hKxXCvrpQnFRsJD+Ytd3xcDRvlSYWMzbMg";
  const realWorldExpected = "deviceId=4eb3dbccf19aaeac&time=20240311103421&sysVer=1.0&cfgStamp=0";
  const realWorldDecryptedBuffer = dxCommonUtils.crypto.aes.decrypt(
    realWorldEncrypted,
    realWorldPassword,
    {
      mode: dxCommonUtils.AES_MODE.ECB,
      keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256
    }
  );
  assert(_arrayBufferToUtf8String(realWorldDecryptedBuffer), realWorldExpected, "crypto.aes.decrypt (real-world salted example)");

  // --- AES with random IV ---
  const aesRandIvResult = dxCommonUtils.crypto.aes.encryptWithRandomIV(aesPlaintext, aesKeyHex);
  assert(typeof aesRandIvResult.encrypted, 'string', "crypto.aes.encryptWithRandomIV returns encrypted string");
  assert(/^[0-9a-fA-F]{32}$/.test(aesRandIvResult.iv), true, "crypto.aes.encryptWithRandomIV returns a 32-char hex IV");
  const decryptedRandBuffer = dxCommonUtils.crypto.aes.decrypt(aesRandIvResult.encrypted, aesKeyHex, {
    mode: dxCommonUtils.AES_MODE.CBC,
    keySize: dxCommonUtils.AES_KEY_SIZE.BITS_256,
    iv: aesRandIvResult.iv
  });
  assert(_arrayBufferToUtf8String(decryptedRandBuffer), aesPlaintext, "crypto.aes.encryptWithRandomIV (decryption)");

  // --- RSA ---
  const rsaPlaintext = "Big secret stored here.";
  const keyPair = dxCommonUtils.crypto.rsa.generateKeyPair(dxCommonUtils.RSA_KEY_SIZE.BITS_1024); // Use 1024 for speed in testing
  assert(keyPair.privateKey.includes("-----BEGIN PRIVATE KEY-----"), true, "crypto.rsa.generateKeyPair (private key)");
  assert(keyPair.publicKey.includes("-----BEGIN PUBLIC KEY-----"), true, "crypto.rsa.generateKeyPair (public key)");

  // Test with string plaintext
  const rsaEncrypted = dxCommonUtils.crypto.rsa.encrypt(rsaPlaintext, keyPair.publicKey);
  const rsaDecryptedBuffer = dxCommonUtils.crypto.rsa.decrypt(rsaEncrypted, keyPair.privateKey);
  assert(_arrayBufferToUtf8String(rsaDecryptedBuffer), rsaPlaintext, "crypto.rsa.encrypt/decrypt (string)");

  // Test with ArrayBuffer plaintext
  const rsaPlaintextBuffer = dxCommonUtils.codec.hexToArrayBuffer(dxCommonUtils.codec.strToUtf8Hex(rsaPlaintext));
  const rsaEncryptedBuffer = dxCommonUtils.crypto.rsa.encrypt(rsaPlaintextBuffer, keyPair.publicKey);
  const rsaDecryptedBuffer2 = dxCommonUtils.crypto.rsa.decrypt(rsaEncryptedBuffer, keyPair.privateKey);
  assert(_arrayBufferToUtf8String(rsaDecryptedBuffer2), rsaPlaintext, "crypto.rsa.encrypt/decrypt (ArrayBuffer)");

  // --- RSA Signature ---
  const signPlaintext = "This data needs to be signed.";

  // Test with SHA-256
  const signatureSha256 = dxCommonUtils.crypto.rsa.sign(signPlaintext, keyPair.privateKey, 'SHA-256');
  assert(typeof signatureSha256, 'string', "crypto.rsa.sign (SHA-256) returns a string");
  const isValidSha256 = dxCommonUtils.crypto.rsa.verify(signPlaintext, signatureSha256, keyPair.publicKey, 'SHA-256');
  assert(isValidSha256, true, "crypto.rsa.verify (SHA-256) succeeds with correct data and key");
  const isInvalidData = dxCommonUtils.crypto.rsa.verify("wrong data", signatureSha256, keyPair.publicKey, 'SHA-256');
  assert(isInvalidData, false, "crypto.rsa.verify (SHA-256) fails with incorrect data");

  // Test with SHA-512
  const signatureSha512 = dxCommonUtils.crypto.rsa.sign(signPlaintext, keyPair.privateKey, 'SHA-512');
  const isValidSha512 = dxCommonUtils.crypto.rsa.verify(signPlaintext, signatureSha512, keyPair.publicKey, 'SHA-512');
  assert(isValidSha512, true, "crypto.rsa.verify (SHA-512) succeeds");
  const isInvalidAlgo = dxCommonUtils.crypto.rsa.verify(signPlaintext, signatureSha512, keyPair.publicKey, 'SHA-256');
  assert(isInvalidAlgo, false, "crypto.rsa.verify fails when sign/verify algorithms mismatch");

  // Test with wrong key
  const anotherKeyPair = dxCommonUtils.crypto.rsa.generateKeyPair(1024);
  const isInvalidKey = dxCommonUtils.crypto.rsa.verify(signPlaintext, signatureSha256, anotherKeyPair.publicKey, 'SHA-256');
  assert(isInvalidKey, false, "crypto.rsa.verify fails with incorrect public key");

  // --- X.509 Certificate Parsing ---
  const certPath = "/app/code/src/testcert.pem"; // User will create this file
  try {
    const certPem = std.loadFile(certPath);

    log.info(`--- Testing Certificate Parser on ${certPath} ---`);
    const certDetails = dxCommonUtils.crypto.parsePEM(certPem);

    assert(typeof certDetails, 'object', "crypto.parsePEM returns an object");
    assert(typeof certDetails.serialNumber, 'string', "crypto.parsePEM: serialNumber is a string");
    assert(certDetails.serialNumber.length > 0, true, "crypto.parsePEM: serialNumber is not empty");
    assert(typeof certDetails.issuer, 'string', "crypto.parsePEM: issuer is a string");
    assert(certDetails.issuer.length > 0, true, "crypto.parsePEM: issuer is not empty");
    assert(typeof certDetails.subject, 'string', "crypto.parsePEM: subject is a string");
    assert(certDetails.subject.length > 0, true, "crypto.parsePEM: subject is not empty");
    assert(typeof certDetails.validFrom, 'string', "crypto.parsePEM: validFrom is a string");
    assert(certDetails.validFrom.length > 0, true, "crypto.parsePEM: validFrom is not empty");
    assert(typeof certDetails.validTo, 'string', "crypto.parsePEM: validTo is a string");
    assert(certDetails.validTo.length > 0, true, "crypto.parsePEM: validTo is not empty");
    assert(typeof certDetails.publicKey, 'string', "crypto.parsePEM: publicKey is a string");
    assert(certDetails.publicKey.includes("-----BEGIN PUBLIC KEY-----"), true, "crypto.parsePEM: publicKey looks valid");

    log.info(`[INFO] Successfully parsed certificate: ${certPath}`);
    log.info(`       Subject: ${certDetails.subject}`);
  } catch (e) {
    if (e.message.includes("Failed to open file")) {
      log.warn(`[SKIP] Certificate file not found at ${certPath}. Please create it manually to run the X.509 parsing test.`);
    } else if (e.message.includes("Input must be a PEM formatted certificate string")) {
      log.warn(`[SKIP] Certificate file at ${certPath} is empty, not found, or not a valid PEM file.`);
    }
    else {
      // Re-throw other errors
      throw e;
    }
  }

  // --- X.509 Certificate Verification ---
  const userCertPath = "/app/code/src/server.pem"; // User needs to create this
  const caCertPath = "/app/code/src/ca.pem";     // User needs to create this

  try {
    log.info(`--- Testing Certificate Verification ---`);
    const userCertPem = std.loadFile(userCertPath);
    const caCertPem = std.loadFile(caCertPath);

    // Test 1: Successful verification
    const verificationResult = dxCommonUtils.crypto.verifyCertificate(userCertPem, caCertPem);
    assert(verificationResult, true, "crypto.verifyCertificate (valid signature)");

    // Test 2: Verification should fail with incorrect CA (using user cert as CA)
    try {
      dxCommonUtils.crypto.verifyCertificate(userCertPem, userCertPem);
      assert(false, true, "crypto.verifyCertificate should throw with an incorrect CA");
    } catch (e) {
      assert(e.message.includes("verification failed"), true, "crypto.verifyCertificate throws correct error on signature mismatch");
    }

    log.info(`[INFO] Successfully verified certificate: ${userCertPath}`);
  } catch (e) {
    if (e.message.includes("Failed to open file")) {
      log.warn(`[SKIP] Certificate files not found at ${userCertPath} or ${caCertPath}. Please create them manually to run the verification test.`);
    } else {
      // Re-throw other errors
      throw e;
    }
  }
}

function testCodec() {
  log.info('--- Testing Codec Namespace ---');

  const bytes = [72, 101, 108, 108, 111, 32, 228, 189, 160, 229, 165, 189]; // "Hello 你好"
  const hex = "48656c6c6f20e4bda0e5a5bd";
  const strAscii = "Hello World";
  const hexAscii = "48656c6c6f20576f726c64";
  const strUtf8 = "你好世界";
  const hexUtf8 = "e4bda0e5a5bd_e4b896e7958c"; // using _ for readability

  // Bytes <-> Hex
  assert(dxCommonUtils.codec.bytesToHex(bytes), hex.toLowerCase(), "codec.bytesToHex");
  assert(dxCommonUtils.codec.hexToBytes(hex), bytes, "codec.hexToBytes");

  // Raw String (ASCII) <-> Hex
  const strWithLowAscii = "\tHello\n"; // \t=9, \n=10
  const hexWithLowAscii = "0948656c6c6f0a";
  assert(dxCommonUtils.codec.strToHex(strWithLowAscii), hexWithLowAscii, "codec.strToHex (with low ASCII)");
  assert(dxCommonUtils.codec.hexToStr(hexWithLowAscii), strWithLowAscii, "codec.hexToStr (with low ASCII)");
  assert(dxCommonUtils.codec.strToHex(strAscii), hexAscii.toLowerCase(), "codec.strToHex (ASCII)");
  assert(dxCommonUtils.codec.hexToStr(hexAscii), strAscii, "codec.hexToStr (ASCII)");

  // UTF8 String <-> Hex
  assert(dxCommonUtils.codec.strToUtf8Hex(strUtf8), hexUtf8.replace(/_/g, ''), "codec.strToUtf8Hex (UTF8)");
  assert(dxCommonUtils.codec.utf8HexToStr(hexUtf8.replace(/_/g, '')), strUtf8, "codec.utf8HexToStr (UTF8)");

  // ArrayBuffer & Uint8Array <-> Hex
  const uint8 = dxCommonUtils.codec.hexToUint8Array(hex);
  const buffer = uint8.buffer;
  assert(dxCommonUtils.codec.arrayBufferToHex(buffer), hex.toLowerCase(), "codec.arrayBufferToHex");
  assert(dxCommonUtils.codec.uint8ArrayToHex(uint8), hex.toLowerCase(), "codec.uint8ArrayToHex");

  // Little Endian
  assert(dxCommonUtils.codec.decimalToLeHex(300, 2), "2c01", "codec.decimalToLeHex");
  assert(dxCommonUtils.codec.leToDecimal("2c01"), 300, "codec.leToDecimal");

  // Validation
  try {
    dxCommonUtils.codec.hexToBytes("123"); // Odd length
    assert(false, true, "codec.hexToBytes should throw on odd length");
  } catch (e) {
    assert(e.message.includes("even length"), true, "codec.hexToBytes throws on odd length");
  }
  try {
    dxCommonUtils.codec.hexToBytes("123g"); // Invalid char
    assert(false, true, "codec.hexToBytes should throw on invalid char");
  } catch (e) {
    assert(e.message.includes("valid hex string"), true, "codec.hexToBytes throws on invalid char");
  }

  // BCC (XOR Checksum)
  const bccStr = "12345"; // ASCII: 0x31, 0x32, 0x33, 0x34, 0x35
  // 0x31^0x32^0x33^0x34^0x35 = 49 (0x31)
  assert(dxCommonUtils.codec.bcc(bccStr), 49, "codec.bcc (ASCII string)");
  const bccUtf8 = "你好"; // UTF-8 Hex: e4 b_d a0 e5 a5 bd
  // 0xe4 ^ 0xbd ^ 0xa0 ^ 0xe5 ^ 0xa5 ^ 0xbd = 4
  assert(dxCommonUtils.codec.bcc(bccUtf8), 4, "codec.bcc (UTF-8 string)");
  const bccBuffer = dxCommonUtils.codec.hexToArrayBuffer("01020304");
  // 1 ^ 2 ^ 3 ^ 4 = 4
  assert(dxCommonUtils.codec.bcc(bccBuffer), 4, "codec.bcc (ArrayBuffer)");
}

function testRandom() {
  log.info('--- Testing Random Namespace ---');

  // Secure random bytes
  const randomBytesHex = dxCommonUtils.random.getBytes(16);
  assert(randomBytesHex.length, 32, "random.getBytes returns correct hex string length");
  assert(/^[0-9a-fA-F]{32}$/.test(randomBytesHex), true, "random.getBytes returns a valid hex string");

  // Non-secure random string
  const randomStr = dxCommonUtils.random.getStr(10);
  assert(randomStr.length, 10, "random.getStr returns correct length");
  const customCharset = "abc";
  const randomStrCustom = dxCommonUtils.random.getStr(5, customCharset);
  assert([...randomStrCustom].every(c => customCharset.includes(c)), true, "random.getStr uses custom charset");
}

function testFs() {
  log.info('--- Testing FS Namespace ---');

  const testString = "Hello, file system!";
  const testBase64 = "SGVsbG8sIGZpbGUgc3lzdGVtIQ=="; // "Hello, file system!"
  const testFilePath = "/tmp/dxCommonUtils_test.txt";

  // 1. Write Base64 to file
  const writeResult = dxCommonUtils.fs.base64ToFile(testFilePath, testBase64);
  assert(writeResult, true, "fs.base64ToFile returns true on success");

  // 2. Read file back to Base64
  const readBase64 = dxCommonUtils.fs.fileToBase64(testFilePath);
  assert(readBase64, testBase64, "fs.fileToBase64 reads back the correct content");

  // 3. Test empty file case (by writing an empty string)
  dxCommonUtils.fs.base64ToFile(testFilePath, "");
  const emptyRead = dxCommonUtils.fs.fileToBase64(testFilePath);
  assert(emptyRead, "", "fs.fileToBase64 handles empty files");

  // 4. Test reading non-existent file (should throw)
  try {
    dxCommonUtils.fs.fileToBase64("/tmp/non_existent_file_12345.txt");
    assert(false, true, "fs.fileToBase64 should throw on non-existent file");
  } catch (e) {
    assert(e.message.includes("Failed to open file") || e.message.includes("ENOENT"), true, "fs.fileToBase64 throws correct error on non-existent file");
  }
}

function _arrayBufferToUtf8String(buffer) {
  if (!buffer) return "";
  const hex = dxCommonUtils.codec.arrayBufferToHex(buffer);
  return dxCommonUtils.codec.utf8HexToStr(hex);
}
```
