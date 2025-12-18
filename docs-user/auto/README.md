---
title: 自动化表格生成说明
description: 生成 Props/Events 原始提取表格并与文档联动
updated: 2025-12-18
version: ^1.x
category: guide
tags: [Automation, Docs]
---

# 自动化表格生成说明

## 目标
- 通过脚本扫描组件/插件源码，提取 `defineProps` / `defineEmits` 的原始内容，生成到 `docs-user/auto/props-events/` 下的 Markdown 文件，供查阅与后续升级脚本加工。

## 使用
```bash
npm run generate:docs        # 基础版：正则提取原始内容
npm run generate:docs:ast    # 升级版：AST/SFC 解析生成标准表格
```

生成完成后，可在组件/插件文档中的“Props / Events / Slots”小节看到指向对应自动化文件的链接。

## 注意
- AST 版已支持运行时对象写法（`defineProps({ ... })`）与常见 `defineEmits([...])`/类型字面量签名
- 对于复杂场景（泛型/联合类型/交叉类型），可按需迭代解析规则
