# WTF Frontend (New)

## 如何开始
```shell
cp .env.sample .env.local
pnpm install
pnpm dev
```

## 命名规范
- 文件夹名：
    - 短横线命名
- 文件名：
    - 组件：短横线命名
    - hook：短横线命名
    - 其他文件：短横线命名
- 类型定义：
    - type类型：T + 名字 (尽量保持一致采用这个)
    - interface类型：I + 名字
    - enum类型：E + 名字
    - 其他类型：名字
- 变量名：
    - 常量：大写字母 + 下划线
    - 其他变量：小驼峰命名

## 目录结构

> 确保 app 只涉及路由页面，保持 app 的简介，方便后续维护（如 替换技术栈等特殊场景）和识别路由布局

```
├── app // 组件
│   ├── (auth) // 登录相关
│   ├── (main) // 核心页面
│   │   ├── course   // 课程
│   │   │   ├── (course)  // 课程详情
│   │   │   ├── (chapter) // 课程章节（文档）阅读
│   │   │   ├── (quiz)    // 课程章节测验
│   │   ├── personal // 个人中心
├── components // 共享组件 和 基础组件（shadcn）
├── hooks      // 全局hook
├── features   // 按照domain 划分（功能模块）
│   ├── course
│   │   ├── api         // 和课程相关的 API hook
│   │   ├── components  // 和课程相关的组件
│   │   ├── hooks       // 和课程相关的 hooks
│   │   ├── type.ts | types // 和课程相关的类型
├── lib    // 工具类
├── styles // 全局样式
├── types  // 全局类型定义
```

## 相关技术

- web3钱包：`@reown/appkit @reown/appkit-adapter-wagmi`
- web3基础库: `wagmi viem`
- 请求库：`@tanstack/react-query`
- UI库： `shadcn`（已存在的antd为antd-web3的依赖项，在项目中请勿使用）
- Animation: `framer-motion` 和 参考 [animata](https://animata.design/)
