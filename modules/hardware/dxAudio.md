# dxAudio

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for audio playback and management functionality.
It includes comprehensive audio system features:

- Audio playback with WAV files (MP3 or other formats not supported)
- Audio streaming playback from ArrayBuffer data
- Text-to-Speech (TTS) functionality (not all devices support)
- Volume control and range management (0-10, where 0 means mute)
- Playback interruption and cache management
- Cross-thread audio playback support

## 2. Files

- dxAudio.js
- libvbar-m-dxaudio.so
- libasound.so.2
- libatopology.so.2

> - Ensure these 4 files are included in the dxmodules subdirectory under your project root directory

## 3. Dependencies

- dxLogger

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+. Device must have audio hardware support.

## 5. Usage

### Basic Usage

```javascript
import audio from "./dxmodules/dxAudio.js";

// Initialize the audio system
audio.init(5, 512, 2048); // volume=5, periodSize=512, bufferSize=2048

// Play WAV file
audio.play("/app/code/src/audio.wav");

// Set volume
audio.setVolume(7);

// Get current volume
let currentVolume = audio.getVolume();
log.info("Current volume:", currentVolume);

// Interrupt current playback
audio.interrupt();

// Clear playback cache
audio.clearCache();

// Deinitialize when done (usually not needed)
audio.deinit();
```

## 6. API Reference

### `audio.init(volume, periodSize, bufferSize)`

Initializes the audio system. Must be called before any other operation.

**Parameters:**

- `volume` (number): Volume level (0-10, where 0 means mute), default 5
- `periodSize` (number): Period size in samples, default 512
- `bufferSize` (number): Buffer size in samples, default 2048

**Technical Details:**

- **periodSize**: Controls audio processing latency. Smaller values (256,512) provide lower latency but higher CPU usage. Larger values (1024,2048) reduce CPU usage but increase latency.
- **bufferSize**: Determines audio smoothness. Smaller values (1024,2048) use less memory but may cause audio stuttering. Larger values (4096,8192) provide smoother playback but use more memory.

**Recommended configurations:**

- Low latency: (256, 1024) - For real-time communication
- High quality: (1024, 4096) - For music playback
- Balanced: (512, 2048) - For general applications

**Returns:** `void`

**Throws:** `Error` if initialization fails

### `audio.deinit()`

Deinitializes the audio system and releases resources.

**Returns:** `boolean` - true if deinitialization successful

### `audio.setVolume(volume)`

Sets the audio volume level.

**Parameters:**

- `volume` (number): Volume level (0-10, where 0 means mute), required

**Returns:** `boolean` - true if volume set successfully

**Throws:** `Error` if volume parameter is invalid

### `audio.getVolume()`

Gets the current audio volume level.

**Returns:** `number` - Current volume level (0-10, where 0 means mute)

### `audio.play(path)`

Plays WAV audio file from file path.

**Parameters:**

- `path` (string): Absolute path to WAV file, required

**Returns:** `number` - Playback status code (see audio.PLAY_CODE constants)

**File Requirements:**

- Path should start with '/app/code/'
- File should be in standard WAV format
- The WAV format should be Channels: 1, Sample Rate: around 24000, Precision: 16-bit, other formats need to be converted to this format
- Recommended: https://onlineaudioconverter.com/# for format conversion
- Recommended: https://www.maztr.com/audiofileanalyzer for analyzing current WAV file format

**Return values:**

- 0: Playback started successfully
- -1: Playback failed
- -2: Playback queue is full

### `audio.playWavData(buffer)`

Plays audio from ArrayBuffer data (streaming audio).

**Parameters:**

- `buffer` (ArrayBuffer): Audio data buffer, required

**Returns:** `number` - Playback status code (see audio.PLAY_CODE constants)

**Note:** This function is useful for playing audio streams, real-time audio data, or audio data received from network sources. The buffer should contain valid WAV format audio data.

### `audio.playTxt(txt, type)`

Plays text using Text-to-Speech (TTS) functionality.

**Parameters:**

- `txt` (string): Text to be converted to speech, required
- `type` (number): Language type, required (0: Chinese, 1: English)

**Returns:** `number` - Playback status code (see audio.PLAY_CODE constants)

**Note:** TTS functionality may not be supported on all devices. The function converts the provided text to speech in the specified language and plays it through the audio system.

**Language types:**

- 0: Chinese (中文)
- 1: English (English)

### `audio.interrupt()`

Interrupts currently playing audio.

**Returns:** `boolean` - true if interruption successful

**Note:** This function immediately stops the currently playing audio without affecting the playback queue. It's useful for emergency stops or when switching between different audio sources.

### `audio.clearCache()`

Clears audio playback cache and queue.

**Returns:** `boolean` - true if cache cleared successfully

**Note:** This function removes all pending audio from the playback queue and clears the audio cache. It should be used when you want to completely reset the audio playback state or free up memory resources.

**Warning:** This operation is mutually exclusive with playback functions and should not be called while audio is actively playing.

## 7. Constants

### Playback Status Codes

```javascript
audio.PLAY_CODE = {
  SUCCESS: 0, // Playback completed successfully
  FAILED: -1, // Playback operation failed
  QUEUE_IS_FULL: -2, // Playback queue is full, cannot add more audio
};
```

### Language Types for TTS

```javascript
audio.PLAY_TYPE = {
  CHINESE_DATA: 0, // Chinese language TTS data
  ENGLISH_DATA: 1, // English language TTS data
};
```

## 8. Related Modules

- **dxAlsa:** Deprecated,Replaced by dxAudio.
- **dxAlsaplay:** Deprecated,Replaced by dxAudio.

## 9. Example

None.
