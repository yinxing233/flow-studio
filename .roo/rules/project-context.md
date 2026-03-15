# Roo Code 项目规则 (Flow Studio)

## 技术栈与工程边界

- 核心：React 18, Vite, TS, React Flow (遵循 src/types/flow.ts), Tailwind CSS, Lucide.
- 状态：Zustand (多 slice, 单向数据流).
- 结构：严禁创建新顶级目录。

## 数据流向与逻辑约束

- 单向流：UI → Store → Engine → Markdown.
- Engine层：`engine/topoSort.ts` 必须为纯函数 (Kahn 算法)，严禁依赖 UI 或外部状态。
- Store层：作为 UI 与 Engine 的唯一中转，禁止 UI 直接调用 Engine。

## 协作守则

- 严格遵循 #GlobalRules。
- 模式切换建议：
  - 复杂重构/新功能：Architect 模式产出计划，用户确认后切换 Code。
  - 功能实现/修复：直接使用 Code 模式。
- 代码规范：所有节点操作必须基于 `src/types/` 定义。
