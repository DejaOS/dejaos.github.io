# dxAudio

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于音频播放和管理功能。
它包含全面的音频系统功能：

- 使用 WAV 文件进行音频播放（不支持 MP3 或其他格式）
- 从 ArrayBuffer 数据进行音频流播放
- 文本转语音（TTS）功能（并非所有设备都支持）
- 音量控制和范围管理（0-10，其中 0 表示静音）
- 播放中断和缓存管理
- 跨线程音频播放支持

## 2. 文件

- dxAudio.js
- libvbar-m-dxaudio.so
- libasound.so.2
- libatopology.so.2

> - 确保这 4 个文件包含在您项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- dxLogger

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。设备必须具有音频硬件支持。

## 5. 使用方法

### 基本用法

```javascript
import audio from "./dxmodules/dxAudio.js";

// 初始化音频系统
audio.init(5, 512, 2048); // volume=5, periodSize=512, bufferSize=2048

// 播放 WAV 文件
audio.play("/app/code/src/audio.wav");

// 设置音量
audio.setVolume(7);

// 获取当前音量
let currentVolume = audio.getVolume();
log.info("当前音量:", currentVolume);

// 中断当前播放
audio.interrupt();

// 清除播放缓存
audio.clearCache();

// 完成后反初始化（通常不需要）
audio.deinit();
```

## 6. API 参考

### `audio.init(volume, periodSize, bufferSize)`

初始化音频系统。必须在任何其他操作之前调用。

**参数：**

- `volume` (number): 音量级别（0-10，其中 0 表示静音），默认 5
- `periodSize` (number): 周期大小（样本数），默认 512
- `bufferSize` (number): 缓冲区大小（样本数），默认 2048

**技术细节：**

- **periodSize**: 控制音频处理延迟。较小的值（256,512）提供较低的延迟但 CPU 使用率较高。较大的值（1024,2048）减少 CPU 使用率但增加延迟。
- **bufferSize**: 确定音频流畅度。较小的值（1024,2048）使用较少内存但可能导致音频卡顿。较大的值（4096,8192）提供更流畅的播放但使用更多内存。

**推荐配置：**

- 低延迟：(256, 1024) - 用于实时通信
- 高质量：(1024, 4096) - 用于音乐播放
- 平衡：(512, 2048) - 用于一般应用程序

**返回值：** `void`

**抛出：** 如果初始化失败则抛出 `Error`

### `audio.deinit()`

反初始化音频系统并释放资源。

**返回值：** `boolean` - 如果反初始化成功则为 true

### `audio.setVolume(volume)`

设置音频音量级别。

**参数：**

- `volume` (number): 音量级别（0-10，其中 0 表示静音），必需

**返回值：** `boolean` - 如果音量设置成功则为 true

**抛出：** 如果音量参数无效则抛出 `Error`

### `audio.getVolume()`

获取当前音频音量级别。

**返回值：** `number` - 当前音量级别（0-10，其中 0 表示静音）

### `audio.play(path)`

从文件路径播放 WAV 音频文件。

**参数：**

- `path` (string): WAV 文件的绝对路径，必需

**返回值：** `number` - 播放状态代码（参见 audio.PLAY_CODE 常量）

**文件要求：**

- 路径应以 '/app/code/' 开头
- 文件应为标准 WAV 格式
- WAV 格式应为：通道：1，采样率：约 24000，精度：16 位，其他格式需要转换为此格式
- 推荐：https://onlineaudioconverter.com/# 用于格式转换
- 推荐：https://www.maztr.com/audiofileanalyzer 用于分析当前 WAV 文件格式

**返回值：**

- 0: 播放成功启动
- -1: 播放失败
- -2: 播放队列已满

### `audio.playWavData(buffer)`

从 ArrayBuffer 数据播放音频（流式音频）。

**参数：**

- `buffer` (ArrayBuffer): 音频数据缓冲区，必需

**返回值：** `number` - 播放状态代码（参见 audio.PLAY_CODE 常量）

**注意：** 此函数对于播放音频流、实时音频数据或从网络源接收的音频数据很有用。缓冲区应包含有效的 WAV 格式音频数据。

### `audio.playTxt(txt, type)`

使用文本转语音（TTS）功能播放文本。

**参数：**

- `txt` (string): 要转换为语音的文本，必需
- `type` (number): 语言类型，必需（0：中文，1：英文）

**返回值：** `number` - 播放状态代码（参见 audio.PLAY_CODE 常量）

**注意：** TTS 功能可能并非所有设备都支持。该函数将提供的文本转换为指定语言的语音并通过音频系统播放。

**语言类型：**

- 0: 中文
- 1: 英文

### `audio.interrupt()`

中断当前播放的音频。

**返回值：** `boolean` - 如果中断成功则为 true

**注意：** 此函数立即停止当前播放的音频，而不影响播放队列。它对于紧急停止或在不同音频源之间切换很有用。

### `audio.clearCache()`

清除音频播放缓存和队列。

**返回值：** `boolean` - 如果缓存清除成功则为 true

**注意：** 此函数从播放队列中移除所有待播放的音频并清除音频缓存。当您想要完全重置音频播放状态或释放内存资源时应使用它。

**警告：** 此操作与播放功能互斥，不应在音频正在播放时调用。

## 7. 常量

### 播放状态代码

```javascript
audio.PLAY_CODE = {
  SUCCESS: 0, // 播放成功完成
  FAILED: -1, // 播放操作失败
  QUEUE_IS_FULL: -2, // 播放队列已满，无法添加更多音频
};
```

### TTS 语言类型

```javascript
audio.PLAY_TYPE = {
  CHINESE_DATA: 0, // 中文 TTS 数据
  ENGLISH_DATA: 1, // 英文 TTS 数据
};
```

## 8. 相关模块

- **dxAlsa:** 已弃用，被 dxAudio 替代。
- **dxAlsaplay:** 已弃用，被 dxAudio 替代。

## 9. 示例

无。
