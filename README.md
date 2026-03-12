# Flow Studio

**Flow Studio** 是一个可视化流程构建工具（visual workflow builder），
用于把复杂的多步骤指令从长篇文字转化为清晰的逻辑图，并自动生成结构化文档。

> 像搭积木一样搭流程，让复杂逻辑一目了然。
> 当你需要编写复杂的 AI 提示词、业务流程或技术文档时，纯文本往往难以维护——Flow Studio 让流程设计回归逻辑，而不是写长文本。

---

## 它能做什么 | What it does

🧱 **可视化编辑**
拖拽节点、建立连线，在画布上设计流程逻辑。

🔗 **依赖自动管理**
节点关系自动构成 **DAG（Directed Acyclic Graph）**，系统会检测并阻止循环依赖。

⚡ **实时生成文档**
每次修改流程图都会自动重新编译，右侧实时生成结构化 **Markdown 工作流文档**。

💾 **保存与分享**
流程图自动保存到浏览器 `localStorage`，支持 **JSON 导入 / 导出**。

---

## 举个例子 | Example

你在画布上拖出三个节点：

* **Input**：用户上传简历
* **Action**：提取技能关键词
* **Constraint**：输出不超过 5 项技能

然后连线：

- Action → 依赖 Input
- Constraint → 依赖 Action

系统会自动编译为：

```
Step 1 — Input
用户上传简历

Step 2 — Action
提取技能关键词
依赖：Step 1

Step 3 — Constraint
输出不超过 5 项技能
依赖：Step 2
```

**画图 → 自动生成结构化文档。**

---

## 工作方式 | How it works

Flow Studio 将流程设计建模为一个 **DAG 工作流**：

1. 节点表示步骤（Input / Action / Constraint）
2. 连线表示依赖关系
3. 系统进行 **拓扑排序（Topological Sort）**
4. 编译生成线性化的 Markdown 工作流

---

## 技术速览 | Tech Stack

技术选型目标：**轻量、高效、类型安全**

* [React Flow](https://reactflow.dev/)  — 节点式可视化画布
* [Zustand](https://zustand-demo.pmnd.rs/) — 状态管理
* [TypeScript](https://www.typescriptlang.org/) — 类型安全
* **Topological Sort** — 工作流编译核心算法
* **localStorage** — 本地持久化

---

## 项目状态 | Status

当前阶段：**MVP**（个人独立开发作品，持续迭代中）

已实现：

* 可视化流程编辑
* DAG 依赖建模
* 循环依赖检测
* 实时工作流编译
* JSON 导入 / 导出
* 本地自动保存

---