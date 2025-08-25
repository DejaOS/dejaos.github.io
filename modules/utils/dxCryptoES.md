# dxCryptoES

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), providing a comprehensive suite of modern cryptographic algorithms. It is based on **CryptoES** (https://github.com/entronad/crypto-es), a pure JavaScript library inspired by the popular CryptoJS, offering a familiar API while being compatible with ES6 and modern JavaScript environments.

It is suitable for scenarios requiring a wide range of cryptographic algorithms and flexibility, where pure JavaScript implementation is acceptable.

Includes a rich set of cryptographic features:
- **Hashing**: MD5, SHA-1, SHA-2 (SHA-256, SHA-512, etc.), SHA-3, RIPEMD-160.
- **HMAC**: Keyed-hashing for message authentication using any of the supported hash functions.
- **Symmetric Ciphers**: AES, TripleDES, Rabbit, RC4, Blowfish for encryption and decryption.
- **Key Derivation**: PBKDF2 for deriving cryptographic keys from passwords.
- **Encoders**: Utilities for converting data between formats like Base64, Hex, and Utf8.

## 2. Files

- The `crypto-es` directory, which contains the complete library.
  - `crypto-es/index.js` (main module entry point)

> Ensure the `crypto-es` directory is included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- None.

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Usage

### Hashing
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

// Calculate the SHA-256 hash of a message
const message = "This is a test message";
const hash = CryptoES.SHA256(message);

// The output is a WordArray object, use .toString() to get a hex string
log.info(hash.toString());
// e.g., "b23546a7862a5367527b469b6623c52a353d213a899a19c67644910a30e8c4d2"
```

### HMAC
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

const message = "Message for HMAC";
const key = "my-secret-key";

// Calculate HMAC-SHA256
const hmac = CryptoES.HmacSHA256(message, key);
log.info(hmac.toString());
```

### Symmetric Encryption (AES)
```javascript
import CryptoES from '../dxmodules/crypto-es/index.js';

const plainText = "This is a secret message.";
const secretKey = "my-super-secret-key";

// Encrypt
const ciphertext = CryptoES.AES.encrypt(plainText, secretKey).toString();
log.info("Encrypted:", ciphertext);

// Decrypt
const bytes = CryptoES.AES.decrypt(ciphertext, secretKey);
const decryptedText = bytes.toString(CryptoES.enc.Utf8);
log.info("Decrypted:", decryptedText);
```

## 6. API Reference

### Hashing Functions
- `CryptoES.MD5(message)`
- `CryptoES.SHA1(message)`
- `CryptoES.SHA256(message)`
- `CryptoES.SHA512(message)`
- `CryptoES.SHA3(message, config)`
- `CryptoES.RIPEMD160(message)`

### HMAC Functions
- `CryptoES.HmacMD5(message, key)`
- `CryptoES.HmacSHA1(message, key)`
- `CryptoES.HmacSHA256(message, key)`
- `CryptoES.HmacSHA512(message, key)`

### Cipher Functions
- `CryptoES.AES.encrypt(message, key, config)`
- `CryptoES.AES.decrypt(ciphertext, key, config)`
- `CryptoES.TripleDES.encrypt(message, key, config)`
- `CryptoES.TripleDES.decrypt(ciphertext, key, config)`
- `CryptoES.Rabbit.encrypt(message, key, config)`
- `CryptoES.Rabbit.decrypt(ciphertext, key, config)`
- And more (RC4, Blowfish).

### Key Derivation
- `CryptoES.PBKDF2(password, salt, options)`

### Encoders
- `CryptoES.enc.Hex`
- `CryptoES.enc.Base64`
- `CryptoES.enc.Utf8`

## 7. Related Modules

This module has functional overlap with `dxCommonUtils`. The primary difference is the underlying implementation, which impacts performance and feature set. Choose the appropriate module based on your specific needs.

| Feature             | dxCryptoES (Pure JS)                  | dxCommonUtils (C/Native)            |
|---------------------|---------------------------------------|-------------------------------------|
| **Performance**     | Lower                                 | **High (Hardware Accelerated)**     |
| **Hashing**         | **Wide Support (SHA2/3, etc.)**       | Limited (MD5 only)                  |
| **Symmetric Ciphers** | **Wide Support (AES, DES, etc.)**     | AES only                            |
| **Asymmetric (RSA)**  | No                                    | **Yes**                             |
| **Key Derivation**    | **Yes (PBKDF2)**                      | No                                  |
| **Security**        | Provides modern, secure algorithms    | Provides fast but older algorithms  |

## 8. Example

``` javascript
// =================================================================
// 1. Hashing Algorithms
// =================================================================
log.info('--- 1. Hashing Algorithms ---');
const message = "Message";
log.info('MD5:', CryptoES.MD5(message).toString());
log.info('SHA1:', CryptoES.SHA1(message).toString());
log.info('SHA256:', CryptoES.SHA256(message).toString());
log.info('SHA512:', CryptoES.SHA512(message).toString());
log.info('SHA3 (512 bits):', CryptoES.SHA3(message, { outputLength: 512 }).toString());
log.info('SHA3 (256 bits):', CryptoES.SHA3(message, { outputLength: 256 }).toString());
log.info('RIPEMD160:', CryptoES.RIPEMD160(message).toString());

// =================================================================
// 2. Progressive Hashing (for large data)
// =================================================================
log.info('--- 2. Progressive Hashing ---');
const sha256 = CryptoES.algo.SHA256.create();
sha256.update("Message Part 1");
sha256.update("Message Part 2");
sha256.update("Message Part 3");
const hash = sha256.finalize();
const expectedHash = CryptoES.SHA256("Message Part 1Message Part 2Message Part 3").toString();
log.info('Progressive SHA256 Hash:', hash.toString());
assertEquals(expectedHash, hash.toString(), 'Progressive hash should match one-time hash');

// =================================================================
// 3. HMAC (Hash-based Message Authentication Code)
// =================================================================
log.info('--- 3. HMAC ---');
const hmacKey = 'my-secret-key';
const hmacMessage = 'This is a message to authenticate.';
log.info('HMAC-SHA256:', CryptoES.HmacSHA256(hmacMessage, hmacKey).toString());
log.info('HMAC-MD5:', CryptoES.HmacMD5(hmacMessage, hmacKey).toString());

// =================================================================
// 4. Symmetric Encryption - AES
// =================================================================
log.info('--- 4. Symmetric Encryption (AES) ---');
const aesKey = 'my-super-secret-key-123';
const plainText = 'This is a top secret message.';

// Encrypt
const ciphertext = CryptoES.AES.encrypt(plainText, aesKey);
log.info('AES Encrypted (Base64):', ciphertext.toString());

// Decrypt
const bytes = CryptoES.AES.decrypt(ciphertext.toString(), aesKey);
const decryptedText = bytes.toString(CryptoES.enc.Utf8);
log.info('AES Decrypted:', decryptedText);
assertEquals(plainText, decryptedText, "AES decryption should match original plaintext");

// =================================================================
// 5. Key Derivation - PBKDF2
// =================================================================
log.info('--- 5. Key Derivation (PBKDF2) ---');
const password = 'my-secure-password';
const salt = CryptoES.lib.WordArray.random(128 / 8); // 128-bit salt

const derivedKey = CryptoES.PBKDF2(password, salt, {
    keySize: 512 / 32, // 512 bits
    iterations: 100 // Lowered for faster testing
});
log.info('PBKDF2 Salt (Hex):', salt.toString());
log.info('PBKDF2 Derived Key (Hex):', derivedKey.toString());
assertEquals(512 / 8, derivedKey.sigBytes, 'Derived key should be 64 bytes (512 bits)');


// =================================================================
// 6. Encodings
// =================================================================
log.info('--- 6. Encodings ---');
const originalText = 'Hello, World!';
const words = CryptoES.enc.Utf8.parse(originalText);
log.info('Original Text:', originalText);

const base64 = CryptoES.enc.Base64.stringify(words);
log.info('Encoded Base64:', base64);
const base64Decoded = CryptoES.enc.Base64.parse(base64).toString(CryptoES.enc.Utf8);
assertEquals(originalText, base64Decoded, 'Base64 encoding roundtrip should succeed');

const hex = CryptoES.enc.Hex.stringify(words);
log.info('Encoded Hex:', hex);
const hexDecoded = CryptoES.enc.Hex.parse(hex).toString(CryptoES.enc.Utf8);
assertEquals(originalText, hexDecoded, 'Hex encoding roundtrip should succeed');


// =================================================================
// 7. Advanced Cipher Usage (AES with custom options)
// =================================================================
log.info('--- 7. Advanced Cipher Usage (AES with custom options) ---');
const keyHex = '000102030405060708090a0b0c0d0e0f';
const ivHex = '101112131415161718191a1b1c1d1e1f';
const customKey = CryptoES.enc.Hex.parse(keyHex);
const customIv = CryptoES.enc.Hex.parse(ivHex);

// Test with custom key and IV
const encryptedWithCustoms = CryptoES.AES.encrypt(plainText, customKey, { iv: customIv });
const decryptedWithCustoms = CryptoES.AES.decrypt(encryptedWithCustoms, customKey, { iv: customIv });
assertEquals(plainText, decryptedWithCustoms.toString(CryptoES.enc.Utf8), 'AES with custom key/IV should work');

// Test with different block mode and padding
const encryptedWithMode = CryptoES.AES.encrypt(plainText, aesKey, {
    mode: CryptoES.mode.CFB,
    padding: CryptoES.pad.AnsiX923
});
const decryptedWithMode = CryptoES.AES.decrypt(encryptedWithMode, aesKey, {
    mode: CryptoES.mode.CFB,
    padding: CryptoES.pad.AnsiX923
});
assertEquals(plainText, decryptedWithMode.toString(CryptoES.enc.Utf8), 'AES with custom mode/padding should work');

// =================================================================
// 8. Other Cipher Algorithms
// =================================================================
log.info('--- 8. Other Cipher Algorithms ---');
// TripleDES
const tripleDesEnc = CryptoES.TripleDES.encrypt(plainText, aesKey);
const tripleDesDec = CryptoES.TripleDES.decrypt(tripleDesEnc, aesKey);
assertEquals(plainText, tripleDesDec.toString(CryptoES.enc.Utf8), 'TripleDES encryption roundtrip should succeed');

// Rabbit Stream Cipher
const rabbitEnc = CryptoES.Rabbit.encrypt(plainText, aesKey);
const rabbitDec = CryptoES.Rabbit.decrypt(rabbitEnc, aesKey);
assertEquals(plainText, rabbitDec.toString(CryptoES.enc.Utf8), 'Rabbit encryption roundtrip should succeed');

// =================================================================
// 9. Progressive HMAC
// =================================================================
log.info('--- 9. Progressive HMAC ---');
const progressiveHmac = CryptoES.algo.HMAC.create(CryptoES.algo.SHA256, hmacKey);
progressiveHmac.update("Message Part 1");
progressiveHmac.update("Message Part 2");
const hmacResult = progressiveHmac.finalize();
const expectedHmac = CryptoES.HmacSHA256("Message Part 1Message Part 2", hmacKey).toString();
assertEquals(expectedHmac, hmacResult.toString(), 'Progressive HMAC should match one-time HMAC');

// =================================================================
// 10. Handling Binary Data (ArrayBuffer/Uint8Array)
// =================================================================
log.info('--- 10. Handling Binary Data (ArrayBuffer/Uint8Array) ---');
const binaryData = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 255, 254, 253]);
const wordArray = CryptoES.lib.WordArray.create(binaryData.buffer);

const encryptedBinary = CryptoES.AES.encrypt(wordArray, aesKey);
const decryptedBinaryCipherParams = CryptoES.AES.decrypt(encryptedBinary, aesKey);

// Convert WordArray back to Uint8Array
const decryptedBinary = wordA_to_u8a(decryptedBinaryCipherParams);
assertArraysEqual(binaryData, decryptedBinary, "Binary data encryption roundtrip should succeed");

```