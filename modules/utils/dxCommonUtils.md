# dxCommonUtils

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for common cryptographic, encoding, and file system utility functions. It is designed as a stateless, singleton-like utility library, providing a collection of tools organized into logical namespaces.

It includes comprehensive utility features:

- **crypto**: Hashing (MD5, HMAC-MD5), symmetric encryption (AES), and asymmetric encryption (RSA).
- **fs**: File system operations, such as converting files to/from Base64.
- **codec**: Data encoding and decoding functions (Hex, Base64, UTF-8, Little Endian, etc.).
- **random**: Generation of cryptographically secure random bytes and simple random strings.

## 2. Files

- `dxCommonUtils.js`
- `libvbar-m-dxcommonutils.so`

> - Ensure these 2 files are included in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Usage

### Basic Usage

```javascript
import dxCommonUtils from "./dxmodules/dxCommonUtils.js";
import log from "./dxmodules/dxLogger.js";

// 1. Hashing with the crypto namespace
const md5Hash = dxCommonUtils.crypto.md5("hello world");
log.info("MD5 Hash:", md5Hash); // Expected: 5eb63bbbe01eeed093cb22bb8f5acdc3

// 2. Encoding/Decoding with the codec namespace
const hexString = dxCommonUtils.codec.strToUtf8Hex("你好");
log.info("UTF-8 to Hex:", hexString); // Expected: e4bda0e5a5bd
const originalString = dxCommonUtils.codec.utf8HexToStr(hexString);
log.info("Hex to UTF-8:", originalString); // Expected: 你好

// 3. Generating random data with the random namespace
const randomBytes = dxCommonUtils.random.getBytes(8);
log.info("8 random bytes (hex):", randomBytes);

// 4. File operations with the fs namespace
const text = "This is a test file.";
const base64Text = dxCommonUtils.codec.arrayBufferToBase64(
  dxCommonUtils.codec.hexToArrayBuffer(dxCommonUtils.codec.strToUtf8Hex(text))
);
const filePath = "/tmp/test.txt";
dxCommonUtils.fs.base64ToFile(filePath, base64Text);
log.info(`Wrote to ${filePath}`);
const readBase64 = dxCommonUtils.fs.fileToBase64(filePath);
log.info(`Read from ${filePath}: ${readBase64}`);
```

## 6. API Reference

### Crypto Namespace (`dxCommonUtils.crypto`)

#### `crypto.md5(data)`

Calculates the MD5 hash of the input data.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to hash. If a string is provided, it will be treated as UTF-8. (required)
- **Returns:** `string` - The MD5 hash in hexadecimal format.

#### `crypto.hmacMd5(data, key)`

Calculates the HMAC-MD5 hash using the provided key.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to hash. (required)
  - `key` (string | ArrayBuffer | Uint8Array): The secret key for HMAC. (required)
  - _Note: If strings are provided, they will be treated as UTF-8._
- **Returns:** `string` - The HMAC-MD5 hash in hexadecimal format.

#### `crypto.hash(data, hashAlgorithm)`

Calculates a hash of the input data using the specified algorithm.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to hash. If a string is provided, it will be treated as UTF-8. (required)
  - `hashAlgorithm` (string): The hash algorithm to use (e.g., 'SHA-256', 'MD5', 'SHA1', 'SHA-384', 'SHA-512'). Default is 'SHA-256'. (optional)
- **Returns:** `string` - The hash in hexadecimal format.

#### `crypto.aes.encrypt(data, key, options)`

Encrypts data using AES.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to encrypt. If a string, treated as UTF-8. (required)
  - `key` (string | ArrayBuffer | Uint8Array): The encryption key. If a string, must be Hex. (required)
  - `options` (object): Encryption options: `{ mode: 'CBC', keySize: 256, iv: '...' }`. (optional)
- **Returns:** `string` - The Base64 encoded encrypted data.

#### `crypto.aes.decrypt(encryptedData, key, options)`

Decrypts AES encrypted data.

- **Parameters:**
  - `encryptedData` (string): The Base64 encoded data to decrypt. (required)
  - `key` (string | ArrayBuffer | Uint8Array): The decryption key. If a string, must be Hex. (required)
  - `options` (object): Decryption options. (optional)
- **Returns:** `string` - The decrypted data as a UTF-8 string.

#### `crypto.aes.encryptWithRandomIV(data, key)`

A convenience method for AES-256-CBC encryption that automatically generates a secure 16-byte IV.

- **Parameters:**
  - `data` (string): The UTF-8 data to encrypt. (required)
  - `key` (string | ArrayBuffer | Uint8Array): The 32-byte encryption key. If a string, must be Hex. (required)
- **Returns:** `object` - An object `{ encrypted: "...", iv: "..." }` containing the Base64 encrypted data and the generated IV as a hex string.

#### `crypto.rsa.generateKeyPair(bits)`

Generates a new RSA key pair.

- **Parameters:**
  - `bits` (number): Key size in bits. Must be one of `1024`, `2048`, `4096`. Default is `2048`. (optional)
- **Returns:** `object` - An object `{ privateKey: "...", publicKey: "..." }` containing the keys in PEM format.

#### `crypto.rsa.encrypt(data, publicKey)`

Encrypts data using an RSA public key.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to encrypt. If a string, treated as UTF-8. (required)
  - `publicKey` (string): The PEM formatted RSA public key. (required)
- **Returns:** `string` - The Base64 encoded encrypted data.

#### `crypto.rsa.decrypt(encryptedData, privateKey)`

Decrypts RSA encrypted data using a private key.

- **Parameters:**
  - `encryptedData` (string): The Base64 encoded encrypted data. (required)
  - `privateKey` (string): The PEM formatted RSA private key. (required)
- **Returns:** `ArrayBuffer|null` - The decrypted data as an ArrayBuffer. Returns null on decryption failure.

#### `crypto.rsa.sign(data, privateKey, hashAlgorithm)`

Creates a digital signature for data using an RSA private key. This is the core function needed for standards like JWT (RS256/RS384/RS512).

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The data to sign. If a string, it will be treated as UTF-8. (required)
  - `privateKey` (string): The PEM formatted RSA private key. (required)
  - `hashAlgorithm` (string): The hash algorithm to use (e.g., 'SHA-256', 'SHA-384', 'SHA-512'). Default is 'SHA-256'. (optional)
- **Returns:** `string` - The signature as a Base64 encoded string.

#### `crypto.rsa.verify(data, signature, publicKey, hashAlgorithm)`

Verifies a digital signature using an RSA public key. This is the counterpart to `rsa.sign` and is used to validate signatures like those in JWT.

- **Parameters:**
  - `data` (string | ArrayBuffer | Uint8Array): The original, unsigned data. (required)
  - `signature` (string | ArrayBuffer | Uint8Array): The signature to verify. If a string, it must be Base64 encoded. (required)
  - `publicKey` (string): The PEM formatted RSA public key. (required)
  - `hashAlgorithm` (string): The hash algorithm used for signing (e.g., 'SHA-256', 'SHA-384', 'SHA-512'). Default is 'SHA-256'. (optional)
- **Returns:** `boolean` - True if the signature is valid, otherwise false.

#### `crypto.parsePEM(pemString)`

Parses a PEM formatted X.509 certificate and returns its details.

- **Parameters:**
  - `pemString` (string): The certificate content in PEM format. (required)
- **Returns:** `object` - An object containing certificate details:
  - `serialNumber` (string): The certificate serial number.
  - `issuer` (string): The certificate issuer.
  - `subject` (string): The certificate subject.
  - `validFrom` (string): The certificate validity start date.
  - `validTo` (string): The certificate validity end date.
  - `publicKey` (string): The public key in PEM format.

#### `crypto.verifyCertificate(certPEM, caCertPEM)`

Verifies if a certificate was signed by a given Certificate Authority (CA).

- **Parameters:**
  - `certPEM` (string): The certificate to verify, in PEM format. (required)
  - `caCertPEM` (string): The CA's certificate, in PEM format. (required)
- **Returns:** `boolean` - True if the certificate is signed by the CA.
- **Throws:** `Error` - If the native verification fails due to parsing errors or signature mismatch.

### FS Namespace (`dxCommonUtils.fs`)

#### `fs.fileToBase64(filePath)`

Reads the entire content of a file and returns it as a Base64 encoded string.

- **Parameters:**
  - `filePath` (string): The absolute path to the file. (required)
- **Returns:** `string` - The Base64 encoded content of the file.

#### `fs.base64ToFile(filePath, base64String)`

Decodes a Base64 string and writes the binary data to a file. This will overwrite the file if it already exists.

- **Parameters:**
  - `filePath` (string): The absolute path to the file to be written. (required)
  - `base64String` (string): The Base64 encoded data. (required)
- **Returns:** `boolean` - `true` on success.

### Random Namespace (`dxCommonUtils.random`)

#### `random.getBytes(length)`

Generates cryptographically secure random bytes using the underlying OpenSSL engine.

- **Parameters:**
  - `length` (number): The number of bytes to generate. (required)
- **Returns:** `string` - The random bytes represented as a hex string.

#### `random.getStr(length, charset)`

Generates a non-cryptographically secure random string from a given charset using `Math.random()`.

- **Parameters:**
  - `length` (number): The length of the string to generate. (required)
  - `charset` (string): The set of characters to use. Defaults to alphanumeric. (optional)
- **Returns:** `string` - The generated random string.

### Codec Namespace (`dxCommonUtils.codec`)

This namespace contains various functions for converting data between different formats.

**Hex `<->` Bytes/String:**

- `codec.hexToBytes(hexString)`: Converts a hex string to an array of byte numbers.
- `codec.bytesToHex(byteArray)`: Converts an array of byte numbers to a hex string.
- `codec.hexToStr(hexString)`: Converts a hex string to a single-byte character string (e.g., ASCII).
- `codec.strToHex(string)`: Converts a single-byte character string to a hex string.
- `codec.strToUtf8Hex(string)`: Converts any string (including multi-byte chars) to a UTF-8 hex string.
- `codec.utf8HexToStr(hexString)`: Converts a UTF-8 hex string back to a string.

**Hex `<->` ArrayBuffer/Uint8Array:**

- `codec.hexToArrayBuffer(hexString)`: Converts a hex string to an `ArrayBuffer`.
- `codec.hexToUint8Array(hexString)`: Converts a hex string to a `Uint8Array`.
- `codec.arrayBufferToHex(arrayBuffer)`: Converts an `ArrayBuffer` to a hex string.
- `codec.uint8ArrayToHex(uint8Array)`: Converts a `Uint8Array` to a hex string.

**Base64 `<->` ArrayBuffer:**

- `codec.base64ToArrayBuffer(base64String)`: Decodes a Base64 string into an `ArrayBuffer`.
- `codec.arrayBufferToBase64(arrayBuffer)`: Encodes an `ArrayBuffer` into a Base64 string.

**Little Endian `<->` Decimal:**

- `codec.leToDecimal(hexString)`: Converts a little-endian hex string to a decimal number.
- `codec.decimalToLeHex(decimalNumber, byteSize)`: Converts a decimal number to a little-endian hex string of a specified byte size.

**BCC**

- `codec.bcc(data)`:Calculates the BCC (Block Check Character / XOR Checksum) of the input data.
- **Returns:** The calculated 8-bit BCC value (0-255).

## 7. Constants

### AES Constants

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

### RSA Constants

```javascript
dxCommonUtils.RSA_KEY_SIZE = {
  BITS_1024: 1024,
  BITS_2048: 2048,
  BITS_4096: 4096,
};
```

## 8. Related Modules

- **dxCommon:** Deprecated. Replaced by dxOs and dxCommonUtils.
- **dxCryptoES**
  This module has functional overlap with `dxCommonUtils`. The primary difference is the underlying implementation, which impacts performance and feature set. Choose the appropriate module based on your specific needs.

| Feature               | dxCryptoES (Pure JS)               | dxCommonUtils (C/Native)           |
| --------------------- | ---------------------------------- | ---------------------------------- |
| **Performance**       | Lower                              | **High (Hardware Accelerated)**    |
| **Hashing**           | Wide Support                       | Wide Support                       |
| **Symmetric Ciphers** | **Wide Support (AES, DES, etc.)**  | AES only                           |
| **Asymmetric (RSA)**  | No                                 | **Yes**                            |
| **Key Derivation**    | **Yes (PBKDF2)**                   | No                                 |
| **Security**          | Provides modern, secure algorithms | Provides fast but older algorithms |

## 9. Example

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
