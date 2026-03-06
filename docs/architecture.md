# 项目架构 / Project Architecture

```markdown
src/
├── components/ # 所有的 UI 组件
│ ├── Sidebar.tsx # 左侧/顶部工具栏（拖拽源）
│ └── ControlPanel.tsx # 导出按钮、清空画布等
├── nodes/ # 自定义节点定义 (React Flow 核心)
│ ├── InputNode.tsx  
│ ├── ActionNode.tsx  
│ └── ConstraintNode.tsx
├── store/ # 状态管理 (Zustand)
│ └── useStore.ts # 存放 nodes 和 edges，处理增删改逻辑
├── engine/ # 逻辑核心 (简历亮点)
│ ├── topoSort.ts # 拓扑排序算法逻辑
│ └── compiler.ts # 将排序后的节点转为 MD/JSON 的模版函数
├── types/ # 全局类型定义
│ └── index.ts  
└── App.tsx # 主入口，配置 React Flow 画布
```
