# dxStd

## 1. Overview

This module provides a comprehensive standard library for DejaOS, wrapping and extending the built-in `os` and `std` modules. It offers a unified interface for interacting with the operating system, including file I/O, timers, environment variables, threading, and more. It aims to provide a higher-level, more convenient API for common system-level tasks.

## 2. Files

- `dxStd.js`

> - Ensure this file is included in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Usage

### Basic Usage

```javascript
import dxstd from "./dxmodules/dxStd.js";

// --- File Operations ---
const filePath = "/app/data/greeting.txt";
const content = "Hello from dxStd!";

// Save content to a file
dxstd.saveFile(filePath, content);
log.info("File saved.");

// Check if the file exists
if (dxstd.exist(filePath)) {
  // Load the content from the file
  const loadedContent = dxstd.loadFile(filePath);
  log.info("File content:", loadedContent);
}

// Clean up the file
dxstd.remove(filePath);
log.info("File removed.");


// --- Timers ---
log.info("Setting a timeout for 1 second.");
dxstd.setTimeout(() => {
  log.info("Timeout fired!");
}, 1000);

// --- Utilities ---
const randomString = dxstd.genRandomStr(8);
log.info("Generated random string:", randomString);
```

## 6. API Reference

### Process Management

#### `dxstd.exit(n)`
Exits the application.
- **Parameters:**
  - `n` (number): The exit code.
- **Returns:** `void`

### Timers

#### `dxstd.setTimeout(func, delay)`
Starts a timer to execute a function asynchronously after a delay.
- **Parameters:**
  - `func` (function): The function to execute.
  - `delay` (number): The delay in milliseconds.
- **Returns:** (any): A timer handle that can be used with `clearTimeout`.

#### `dxstd.clearTimeout(handle)`
Clears a specified timer created by `setTimeout`.
- **Parameters:**
  - `handle` (any): The timer handle returned by `setTimeout`.
- **Returns:** `void`

#### `dxstd.setInterval(callback, interval, once)`
Sets up a recurring timer.
- **Parameters:**
  - `callback` (function): The function to be called repeatedly.
  - `interval` (number): The interval time in milliseconds.
  - `once` (boolean, optional): If true, executes the callback once immediately after creation.
- **Returns:** (string): The unique timer ID for this interval, which can be used with `clearInterval`.

#### `dxstd.clearInterval(timerId)`
Clears an interval timer created by `setInterval`.
- **Parameters:**
  - `timerId` (string): The ID of the timer to clear.
- **Returns:** `void`

#### `dxstd.clearIntervalAll()`
Clears all interval timers created in the current thread.

#### `dxstd.sleep(delay_ms)`
Pauses execution for a specified number of milliseconds.
- **Parameters:**
  - `delay_ms` (number): The delay in milliseconds.
- **Returns:** `void`

### File System

#### Constants
- **File Open Flags:** `O_RDONLY`, `O_WRONLY`, `O_RDWR`, `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_TRUNC`.
- **File Seek Flags:** `SEEK_SET`, `SEEK_CUR`, `SEEK_END`.
- **File Mode Flags:** `S_IFMT`, `S_IFIFO`, `S_IFCHR`, `S_IFDIR`, `S_IFBLK`, `S_IFREG`, `S_IFSOCK`, `S_IFLNK`, `S_ISGID`, `S_ISUID`.

#### `dxstd.saveFile(filename, content, sync)`
Saves a string to a file. Creates the directory path if it doesn't exist.
- **Parameters:**
  - `filename` (string): The absolute path of the file.
  - `content` (string): The string content to save.
  - `sync` (boolean, optional, default: `true`): If true, performs a system-wide sync to flush all file system buffers to disk.
- **Returns:** (boolean): `true` on success.

#### `dxstd.loadFile(filename)`
Loads the content of a file as a UTF-8 string.
- **Parameters:**
  - `filename` (string): The name of the file.
- **Returns:** (string): The content of the file.

#### `dxstd.saveBinaryFile(filename, data, offset, length, sync)`
Saves binary data (ArrayBuffer or Uint8Array) to a file.
- **Parameters:**
  - `filename` (string): The absolute path of the file.
  - `data` (ArrayBuffer|Uint8Array): The binary data to save.
  - `offset` (number, optional, default: `0`): Byte offset in data to start writing from.
  - `length` (number, optional, default: `data.byteLength - offset`): Number of bytes to write.
  - `sync` (boolean, optional, default: `true`): If true, performs a system-wide sync.
- **Returns:** (boolean): `true` on success.

#### `dxstd.loadBinaryFile(filename, offset, length)`
Loads a portion or the entire content of a file as binary data into a `Uint8Array`.
- **Parameters:**
  - `filename` (string): The absolute path of the file.
  - `offset` (number, optional, default: `0`): Byte offset in the file to start reading from.
  - `length` (number, optional): Number of bytes to read. Defaults to reading from the offset to the end of the file.
- **Returns:** (Uint8Array): A `Uint8Array` containing the file's binary data.

#### `dxstd.open(filename, flags)`
Opens a file and returns a file descriptor.
- **Parameters:**
  - `filename` (string): The absolute path of the file.
  - `flags` (number): A bitwise OR of file open flags (e.g., `dxstd.O_RDWR | dxstd.O_CREAT`).
- **Returns:** (number): A file descriptor handle, or a value < 0 on error.

#### `dxstd.close(fd)`
Closes a file descriptor.
- **Parameters:**
  - `fd` (number): The file descriptor handle.
- **Returns:** (number): 0 on success, or -errno on failure.

#### `dxstd.read(fd, buffer, offset, length)`
Reads `length` bytes from file descriptor `fd` into an `ArrayBuffer`.
- **Parameters:**
  - `fd` (number): The file descriptor handle.
  - `buffer` (ArrayBuffer): The `ArrayBuffer` to read into.
  - `offset` (number): The offset in the buffer to start writing at.
  - `length` (number): The number of bytes to read.
- **Returns:** (number): The number of bytes read, or a value < 0 on error.

#### `dxstd.write(fd, buffer, offset, length)`
Writes `length` bytes from an `ArrayBuffer` to a file descriptor.
- **Parameters:**
  - `fd` (number): The file descriptor handle.
  - `buffer` (ArrayBuffer): The `ArrayBuffer` to write from.
  - `offset` (number): The offset in the buffer to start reading from.
  - `length` (number): The number of bytes to write.
- **Returns:** (number): The number of bytes written, or a value < 0 on error.

#### `dxstd.seek(fd, offset, whence)`
Seeks to a position in a file.
- **Parameters:**
  - `fd` (number): The file descriptor handle.
  - `offset` (number | bigint): The offset.
  - `whence` (number): The starting point: `dxstd.SEEK_SET`, `dxstd.SEEK_CUR`, or `dxstd.SEEK_END`.
- **Returns:** (number | bigint): The new offset from the beginning of the file.

#### `dxstd.exist(filename)`
Checks if a file or directory exists.
- **Parameters:**
  - `filename` (string): The name of the file or directory.
- **Returns:** (boolean): `true` if the path exists, `false` otherwise.

#### `dxstd.stat(path)`
Returns status information for a file or directory.
- **Parameters:**
  - `path` (string): The absolute path.
- **Returns:** `[object, number]`: An array `[obj, err]`, where `obj` is a status object (`mode`, `size`, `mtime`, etc.) and `err` is an error code.

#### `dxstd.lstat(path)`
Same as `stat()`, but if the path is a symbolic link, it returns information about the link itself.

#### `dxstd.isDir(filename)`
Checks if a given path is a directory.
- **Parameters:**
  - `filename` (string): The path to check.
- **Returns:** (boolean): `true` if the path is a directory, `false` otherwise.

#### `dxstd.remove(filename)`
Deletes a file.
- **Parameters:**
  - `filename` (string): The absolute path of the file.
- **Returns:** (number): 0 on success, or -errno on failure.

#### `dxstd.rename(oldname, newname)`
Renames or moves a file.
- **Parameters:**
  - `oldname` (string): The old absolute path.
  - `newname` (string): The new absolute path.
- **Returns:** (number): 0 on success, or -errno on failure.

### Directory Operations

#### `dxstd.mkdir(path)`
Creates a directory.
- **Parameters:**
  - `path` (string): The absolute path of the directory.
- **Returns:** (number): 0 on success, or -errno on failure.

#### `dxstd.rmdir(dirname)`
Removes an empty directory.
- **Parameters:**
  - `dirname` (string): The path to the directory.
- **Returns:** (number): The exit code of the underlying `rmdir` command (0 on success).

#### `dxstd.readdir(path)`
Returns the names of the files in a directory.
- **Parameters:**
  - `path` (string): The absolute path of the directory.
- **Returns:** `[string[], number]`: An array `[array, err]`, where `array` is an array of filenames and `err` is an error code.

#### `dxstd.ensurePathExists(filename)`
Ensures that the directory path for a given filename exists. Creates it if necessary.
- **Parameters:**
  - `filename` (string): The full path of the file.
- **Returns:** `void`

#### `dxstd.getcwd()`
Returns the current working directory.
- **Returns:** `[string, number]`: An array `[str, err]`, where `str` is the CWD and `err` is an error code.

#### `dxstd.chdir(path)`
Changes the current working directory.
- **Parameters:**
  - `path` (string): The directory path.
- **Returns:** (number): 0 on success, or -errno on failure.

### Environment Variables

#### `dxstd.getenviron()`
Returns an object containing key-value pairs of all environment variables.
- **Returns:** (object): The environment variables.

#### `dxstd.getenv(name)`
Returns the value of an environment variable.
- **Parameters:**
  - `name` (string): The name of the variable.
- **Returns:** (string|undefined): The value of the variable, or `undefined` if not found.

#### `dxstd.setenv(name, value)`
Sets the value of an environment variable.
- **Parameters:**
  - `name` (string): The name of the variable.
  - `value` (string): The value to set.
- **Returns:** `void`

#### `dxstd.unsetenv(name)`
Deletes an environment variable.
- **Parameters:**
  - `name` (string): The name of the variable to delete.
- **Returns:** `void`

### Scripting

#### `dxstd.eval(str, async)`
Executes a string as a JavaScript script.
- **Parameters:**
  - `str` (string): The JavaScript script string.
  - `async` (boolean, optional, default: `false`): If `true`, the script can use `await` and the function returns a Promise.
- **Returns:** (any): The result of the script evaluation.

#### `dxstd.loadScript(filename)`
Loads and executes the content of a file as a JavaScript script in the global scope.
- **Parameters:**
  - `filename` (string): The absolute path of the script file.
- **Returns:** (any): The result of the script evaluation.

#### `dxstd.parseExtJSON(str)`
Parses a string using a superset of `JSON.parse`. It supports comments, unquoted properties, trailing commas, etc.
- **Parameters:**
  - `str` (string): The JSON string to parse.
- **Returns:** (any): The parsed object.

### Workers

#### `dxstd.Worker(module_filename)`
Creates a new thread (worker). The API is close to the WebWorkers API.
- **Parameters:**
  - `module_filename` (string): The absolute path of the module filename to be executed in the new thread.
- **Returns:** (os.Worker): A new Worker instance.

### Utilities

#### `dxstd.genRandomStr(length)`
Generates a random string of a specified length consisting of letters and numbers.
- **Parameters:**
  - `length` (number, optional, default: `6`): The length of the string.
- **Returns:** (string): The generated random string.

#### `dxstd.platform()`
Returns a string representing the platform.
- **Returns:** (string): The platform identifier ("linux", "darwin", "win32", or "js").

## 7. Examples

``` javascript
// --- Test Directory Setup ---
const testDir = '/app/data/dxStd_test';
dxStd.ensurePathExists(testDir + '/dummy.txt'); // ensurePathExists itself is tested here

// --- File System Tests (Text) ---
log.info('\n--- Testing Text File I/O ---');
const textFilePath = testDir + '/test.txt';
const textContent = 'Hello, DejaOS! This is a test.\nLine 2.';

assert(dxStd.saveFile(textFilePath, textContent, false), 'saveFile should return true');
log.info('saveFile OK');

const loadedText = dxStd.loadFile(textFilePath);
assertEquals(loadedText, textContent, 'loadFile should return the saved content');
log.info('loadFile OK');

assert(dxStd.exist(textFilePath), 'exist should return true for existing file');
log.info('exist OK');

assert(!dxStd.isDir(textFilePath), 'isDir should be false for a file');
log.info('isDir (file) OK');

assert(dxStd.isDir(testDir), 'isDir should be true for a directory');
log.info('isDir (directory) OK');

// --- File System Tests (Binary) ---
log.info('\n--- Testing Binary File I/O ---');
const binaryFilePath = testDir + '/test.bin';
// Create a sample buffer: [0, 1, 2, ..., 9]
const fullBuffer = new Uint8Array(10).map((_, i) => i);

// 1. Save the whole buffer
assert(dxStd.saveBinaryFile(binaryFilePath, fullBuffer), 'saveBinaryFile (full) should return true');
log.info('saveBinaryFile (full buffer) OK');

// 2. Load the whole buffer and verify
let loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertArraysEqual(loadedBuffer, fullBuffer, 'loadBinaryFile (full) should match original buffer');
log.info('loadBinaryFile (full file) OK');

// 3. Save a slice of the buffer: [3, 4, 5, 6]
const sliceOffset = 3;
const sliceLength = 4;
const sliceBuffer = fullBuffer.subarray(sliceOffset, sliceOffset + sliceLength);
assert(dxStd.saveBinaryFile(binaryFilePath, fullBuffer, sliceOffset, sliceLength), 'saveBinaryFile (slice) should return true');
log.info('saveBinaryFile (slice) OK');

// 4. Load the entire file to confirm it now only contains the slice
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertArraysEqual(loadedBuffer, sliceBuffer, 'File content should now be the saved slice');
assertEquals(loadedBuffer.length, sliceLength, 'File length should match slice length');
log.info('Verifying saved slice OK');

// 5. Load a sub-slice from the new file: [4, 5] (which are the middle 2 bytes of [3, 4, 5, 6])
const subSliceOffset = 1;
const subSliceLength = 2;
const subSliceBuffer = sliceBuffer.subarray(subSliceOffset, subSliceOffset + subSliceLength);
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath, subSliceOffset, subSliceLength);
assertArraysEqual(loadedBuffer, subSliceBuffer, 'loadBinaryFile (sub-slice) should return the correct partial data');
log.info('loadBinaryFile (sub-slice) OK');

// 6. Test zero-length write
dxStd.saveBinaryFile(binaryFilePath, new Uint8Array(0));
loadedBuffer = dxStd.loadBinaryFile(binaryFilePath);
assertEquals(loadedBuffer.length, 0, "Loading a zero-byte file should result in a zero-length buffer");
log.info('Zero-length binary I/O OK');

// --- Timer Tests ---
log.info('\n--- Testing Timers ---');
let timeoutFired = false;
let intervalCount = 0;
let intervalId = null;

// The final check will be performed inside this timer
const assertionTimer = dxStd.setTimeout(() => {
    log.info('--- Verifying Timer Assertions ---');
    try {
        assert(timeoutFired, 'setTimeout callback should have been fired');
        assertEquals(intervalCount, 2, 'setInterval should have fired exactly twice');
        log.info('Timer assertions OK');
    } catch (e) {
        // We must catch here, otherwise the error is silent in a setTimeout
        log.info(`\n!!!!!!!!!! TIMER TEST FAILED !!!!!!!!!!`);
        log.info(`Error: ${e.message}`);
        std.exit(1);
    }
}, 200); // Run assertions after 200ms

dxStd.setTimeout(() => {
    timeoutFired = true;
    log.info('setTimeout OK');
}, 50);

intervalId = dxStd.setInterval(() => {
    intervalCount++;
    if (intervalCount === 1) {
        log.info('setInterval fired once OK');
    }
    if (intervalCount === 2) {
        dxStd.clearInterval(intervalId);
        log.info('setInterval and clearInterval OK');
    }
}, 50);

log.info('Timers have been set. Waiting for callbacks...');

// --- Utils Tests ---
log.info('\n--- Testing Utils ---');
const randomStr = dxStd.genRandomStr(10);
assertEquals(randomStr.length, 10, 'genRandomStr should generate a string of the correct length');
log.info(`genRandomStr OK (generated: ${randomStr})`);

// --- Cleanup ---
log.info('\n--- Cleaning up ---');
log.info(dxStd.remove(textFilePath));
log.info(dxStd.remove(binaryFilePath));
// Note: Can't remove a directory with content, so we remove files first.
// For now, we assume the directory is empty before removal.
dxStd.rmdir(testDir);
assert(!dxStd.exist(testDir), 'Test directory should be removed');
log.info('Cleanup OK');


// --- Advanced / Manual Verification Tests ---
// The following tests are harder to assert automatically or modify global state.
// They are structured here for manual verification or future expansion.
log.info('\n--- Advanced / Manual Verification ---');

// 1. Scripting Tests
log.info('--- Testing Scripting ---');
// Test parseExtJSON (still good to assert this one)
const jsonWithComments = `{'a':1, // comment\n 'b': 'c'}`;
const parsed = dxStd.parseExtJSON(jsonWithComments);
assertEquals(parsed.a, 1, 'parseExtJSON should handle comments and single quotes');
assertEquals(parsed.b, 'c', 'parseExtJSON should handle comments and single quotes');
log.info('parseExtJSON OK');

// Test eval (simple case is fine to assert)
const evalResult = dxStd.eval('2 + 3');
assertEquals(evalResult, 5, 'eval should compute expressions');
log.info('eval OK');

// Test loadScript (requires a file)
const scriptPath = testDir + '/test_script.js';
dxStd.saveFile(scriptPath, 'var testVar = 42; ');
dxStd.loadScript(scriptPath);
assertEquals(testVar, 42, 'loadScript should execute the script and set global variables');
log.info('loadScript executed (manual check for console message and `testVar` if needed)');
dxStd.remove(scriptPath); // Cleanup script file

// 2. Environment & CWD Tests (Simplified to console logs for manual verification)
log.info('\n--- Testing Environment & CWD ---');
const originalCwd = dxStd.getcwd()[0];
const originalEnv = dxStd.getenv('MY_TEST_VAR');

log.info('Setting MY_TEST_VAR to "hello"');
dxStd.setenv('MY_TEST_VAR', 'hello');
log.info('getenv("MY_TEST_VAR"):', dxStd.getenv('MY_TEST_VAR'));

log.info('Unsetting MY_TEST_VAR');
dxStd.unsetenv('MY_TEST_VAR');
log.info('getenv("MY_TEST_VAR") after unset:', dxStd.getenv('MY_TEST_VAR'));

// Restore original env if it existed
if (originalEnv !== undefined) {
    dxStd.setenv('MY_TEST_VAR', originalEnv);
}

log.info(`Original CWD: ${originalCwd}`);
dxStd.chdir(testDir);
log.info(`New CWD: ${dxStd.getcwd()[0]}`);

dxStd.chdir(originalCwd); // Restore CWD
log.info(`Restored CWD: ${dxStd.getcwd()[0]}`);


// 3. Advanced File System Tests (Simplified to console logs for manual verification)
log.info('\n--- Testing Advanced File System ---');
const readdirPath = testDir + '/readdir_test';
const file1 = readdirPath + '/f1.txt';
const file2 = readdirPath + '/f2.txt';
dxStd.ensurePathExists(file1);
dxStd.saveFile(file1, '1');
dxStd.saveFile(file2, '2');

const files = dxStd.readdir(readdirPath)[0];
log.info(`readdir("${readdirPath}"):`, files);

const renamedFile = readdirPath + '/f1_renamed.txt';
log.info(`Renaming "${file1}" to "${renamedFile}"`);
dxStd.rename(file1, renamedFile);
log.info(`Exists "${renamedFile}":`, dxStd.exist(renamedFile));
log.info(`Exists "${file1}":`, dxStd.exist(file1));

// Cleanup for this test
dxStd.remove(renamedFile);
dxStd.remove(file2);
dxStd.remove(readdirPath);


// 4. Worker Test (Manual Observation)
log.info('\n--- Testing Worker (Manual Observation) ---');
log.info("Starting worker... you should see a message from it in the console.");
dxStd.Worker('/app/code/src/worker2.js');
log.info("Worker test section finished (check console for worker output).");

log.info('\n----------- [dxStd] All tests passed! -----------');
```