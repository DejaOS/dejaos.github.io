# 调试

在 dejaOS 应用程序开发过程中，目前不支持逐步调试。您只能依靠打印日志来调试运行时数据。JavaScript 中最基本的 `console.log` **不推荐**在 dejaOS 中使用，因为它无法实现实时打印。我们使用 `dxLogger` 作为替代，使用方法非常简单。参考以下示例：

```js
import log from "../dxmodules/dxLogger.js";

log.debug("调试信息..................");
log.info("信息..................");
log.error("错误..................");

let obj = { a: 1, b: "b" };
log.info("对象:", obj);

let arr = ["a", "b", "c"];
log.info("数组:", arr);

let err = new Error("文件不存在");
log.error(err);
```

它支持 3 个级别的打印，不同级别在 `OUTPUT` 区域显示不同的文字颜色。

如果打印 Error 对象，会自动打印详细的错误堆栈信息，便于定位错误发生在哪一行代码。

![alt text](/img/logger.png)
