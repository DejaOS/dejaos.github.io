# 人脸特征值提取服务

---

## 简介

**人脸特征值提取服务**（Face Server）是一套部署在 **CentOS** 服务器上的独立后台服务。它提供 HTTP 接口：上传一张含有人脸的照片，服务会返回 **裁剪后的人脸缩略图** 以及对应的 **特征值**（特征向量）。

适用于在 PC 或云端管理人员照片、再下发到 **VF 系列** DejaOS 人脸设备（Linux 系统，**不含** Android 人脸机）的场景。常见用途包括：

- 上传高清大图（例如数 MB），得到约 20 KB 级别的裁剪人脸图，下发到设备可显著缩短下载时间。
- 将照片转换为 **1024 字节** 特征值，仅下发特征值到设备，节省流量且无需在设备端保存人脸照片。

特征值、注册等概念说明见 [人脸识别开发概述](./overview.md)。

---

## 部署概要

| 项目 | 要求 |
| :--- | :--- |
| 操作系统 | **CentOS 7.x** |
| 安装路径 | `/root/face`（固定） |
| HTTP 端口 | **9001**（需开放） |
| 适用设备 | VF 系列人脸产品（DejaOS / Linux），不包括 Android 机型 |

安装后在 `/root/face/bin/` 下执行 `run.sh` 启动裁剪与特征提取服务。首次启动可能需要 **License** 授权（控制台会显示服务器 ID，联系管理员获取授权文件）。环境变量、启动脚本等细节见安装包内 README。

**安装包下载：** [FaceServer_dejaos.zip](https://dxiot-autobackup.oss-cn-hangzhou.aliyuncs.com/dejaos/FaceServer_dejaos.zip)

---

## HTTP 接口

**地址：** `POST http://<服务器IP>:9001/dxdop/webadmin/face/clipper`

**请求：** `multipart/form-data`，字段 `file` 为待处理图片。

**返回示例（成功）：**

```json
{
  "code": 1,
  "msg": "裁剪成功",
  "data": {
    "faceB64": "/9j/4AAQS....",
    "faceFeature": "6gcF8uFUNjcwC.....AAA=="
  }
}
```

| 字段 | 说明 |
| :--- | :--- |
| `faceB64` | 裁剪后人脸图的 Base64 数据（缩略图） |
| `faceFeature` | 人脸特征值 Base64 字符串，可用于设备注册与 1:N 比对 |

根据业务需要，将缩略图或特征值下发到设备（参见 [示例：人脸注册与识别](./recognition.md)）。

---

## 测试客户端（Windows）

安装包在 `bin/test/` 下附带 **Windows 可视化批量工具**，无需自行编写 HTTP 客户端即可对文件夹内照片批量处理。

1. 在 CentOS 上按 README 启动 Face Server。
2. 修改 `data/photo_tool/config` 中的服务器 IP：
   ```json
   {
     "batchUrl": "http://<IP>:9001/dxdop/webadmin/face/clipper",
     "locale": "zh_CN"
   }
   ```
3. 运行 `photo_tool.exe`，设置处理前/处理后目录及特征值输出目录，点击 **处理**。成功结果写入指定目录，失败记录显示在失败列表中便于重试。

![人脸服务测试客户端](/img/facetool.png)

---

## 相关文档

- [人脸识别开发概述](./overview.md) — 特征值、注册、识别流程
- [示例：人脸注册与识别](./recognition.md) — 设备端注册与比对
