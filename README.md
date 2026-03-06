# Flow Studio

**Flow Studio** 是一款用于可视化构建 AI Prompt 的工具。它将复杂 Prompt 从难以维护的长文本，转化为清晰的逻辑图。

> 像搭积木一样构建 Prompt，让复杂提示词结构变得清晰可维护。

---

## Features（功能特性）

- **可视化画布**：拖拽节点与连线，构建 Prompt 逻辑图。
- **节点系统**：提供 Input（输入变量）、Action（执行步骤）、Constraint（输出约束） 三类节点，用于定义 Prompt 要素。
- **Prompt 生成**：根据节点依赖关系，将图结构转换为结构化 Markdown Prompt。
- **导出功能**：JSON 保存图结构，Markdown 导出最终 Prompt。

---

## How It Works（工作原理）

Flow Studio 的核心是一个 **Prompt Graph Compiler**，它将 Prompt 设计从文本编辑升级为逻辑建模：

1. **逻辑解构**：将提示词拆解为离散的基础节点（Input/Action/Constraint）。
2. **可视化建模**：通过连线建立节点间的依赖关系，形成有向无环图（DAG）。
3. **线性化编译**：编译器对图进行拓扑排序，生成顺序执行的线性 Prompt 文本。

这种方式让复杂指令的依赖关系一目了然，大幅提升 Prompt 的可维护性与复用性。

---

## Technical Highlights（技术亮点）

- **前端**：[React Flow](https://reactflow.dev/) 处理画布交互，[Zustand](https://zustand-demo.pmnd.rs/) 管理状态，[TypeScript](https://www.typescriptlang.org/) 保障类型安全。
- **编译逻辑**：采用拓扑排序（Kahn 算法）对 DAG 进行拓扑排序，确保生成的 Prompt 严格遵循依赖顺序，无循环依赖。
- **数据模型**：统一 NodeData 接口定义节点类型与内容，边结构存储源目标 ID，支持完整的图序列化与反序列化。