/**
 * @file flow.ts
 * @description 核心流程图类型定义中心
 * @logic 桥接 React Flow 基础接口与业务逻辑实体，定义节点(Node)与连线(Edge)的结构规范
 */

import type { Node, Edge } from 'reactflow'

// 1. 节点类型定义
export type NodeType = 'input' | 'action' | 'constraint'

// 2. 纯粹的业务数据接口
export interface FlowNodeData {
  label: string
  content: string
  variables?: string[]
}

// 3. 核心节点接口
// 建议统一使用 type 交叉，以应对未来 React Flow 版本的类型变化
export type FlowNode = Node<FlowNodeData> & {
  type: NodeType // 强制覆盖基类中的 type
}

// 4. 核心连线接口
// 如果未来需要增加自定义数据，可以写成: Edge & { customField: string }
export type FlowEdge = Edge

// 5. 编译器输出结果结构
export interface CompileResult {
  nodes: FlowNode[]
  markdown: string
  json: string
  isValid: boolean
  error?: string
}
