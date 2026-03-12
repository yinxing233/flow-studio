/**
 * @file types/index.ts
 * @description 核心流程图类型定义中心
 */

import type { Node, Edge } from 'reactflow'

// 节点类型字面量
export type NodeType = 'input' | 'action' | 'constraint'

// 各类型节点的专用数据接口
export interface InputNodeData {
  label: string
  content: string
  variables?: string[] // 输入变量占位符
}

export interface ActionNodeData {
  label: string
  content: string
  // 可扩展未来字段，如 parameters 等
}

export interface ConstraintNodeData {
  label: string
  content: string
  // 可扩展未来字段，如 rules 等
}

// 联合类型：FlowNodeData 可以是任一类型节点的数据
export type FlowNodeData = InputNodeData | ActionNodeData | ConstraintNodeData

// 核心节点接口：确保 type 与 data 类型匹配（但无法在类型层面强制，需运行时保证）
export type FlowNode = Node<FlowNodeData> & {
  type: NodeType // 覆盖基类中的 type，与 data 对应
}

// 核心连线接口（暂无需扩展）
export type FlowEdge = Edge

// 编译器输出结果结构
export interface CompileResult {
  markdown: string          // 生成的 Markdown 文本
  json: string              // 节点数据的 JSON 字符串
  isValid: boolean          // 是否成功编译（无环）
  error?: string            // 错误信息（若 isValid 为 false）
  sortedNodes?: FlowNode[]  // 成功排序后的节点（仅在 isValid 为 true 时存在）
}