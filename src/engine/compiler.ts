/**
 * @file engine/compiler.ts
 * @description 编译流程图，生成结构化的 Markdown 文本和 JSON 数据。
 */

import type { FlowNode, FlowEdge, CompileResult, InputNodeData } from '../types'
import { topoSort, CyclicDependencyError } from './topoSort'

// 定义 JSON 输出的节点类型
interface NodeJson {
  type: string
  label: string
  content: string
  variables?: string[]
}

export const compileGraph = (nodes: FlowNode[], edges: FlowEdge[]): CompileResult => {
  let markdown = ''
  let json = ''
  let isValid = true
  let error: string | undefined
  let sortedNodes: FlowNode[] | undefined

  try {
    // 1. 拓扑排序
    sortedNodes = topoSort(nodes, edges)

    // 2. 生成 Markdown 和 JSON
    const markdownParts: string[] = []
    const jsonObj: Record<string, NodeJson> = {}

    sortedNodes.forEach((node) => {
      const { id, type, data } = node
      const { label, content } = data

      // Markdown 生成
      switch (type) {
        case 'input': {
          markdownParts.push(`## Input: ${label}\n${content}\n`)
          const inputData = data as InputNodeData
          if (inputData.variables && inputData.variables.length > 0) {
            markdownParts.push('### Variables:\n')
            inputData.variables.forEach((v) => markdownParts.push(`- ${v}\n`))
          }
          break
        }
        case 'action':
          markdownParts.push(`## Action: ${label}\n${content}\n`)
          break
        case 'constraint':
          markdownParts.push(`## Constraint: ${label}\n${content}\n`)
          break
        default:
          // 未知类型，但保留内容
          markdownParts.push(`## Unknown Node: ${label}\n${content}\n`)
          break
      }

      // JSON 构建（保留完整数据）
      const baseJson: NodeJson = {
        type,
        label,
        content,
      }
      if (type === 'input') {
        const inputData = data as InputNodeData
        if (inputData.variables) {
          baseJson.variables = inputData.variables
        }
      }
      jsonObj[id] = baseJson
    })

    markdown = markdownParts.join('\n')
    json = JSON.stringify(jsonObj, null, 2)
  } catch (err) {
    isValid = false
    if (err instanceof CyclicDependencyError) {
      error = err.message
    } else {
      error = err instanceof Error ? err.message : String(err)
    }
    // 发生错误时，使用原始节点顺序生成 JSON（仅用于调试）
    const fallbackJsonObj: Record<string, NodeJson> = {}
    nodes.forEach((node) => {
      const baseJson: NodeJson = {
        type: node.type,
        label: node.data.label,
        content: node.data.content,
      }
      if (node.type === 'input') {
        const inputData = node.data as InputNodeData
        if (inputData.variables) {
          baseJson.variables = inputData.variables
        }
      }
      fallbackJsonObj[node.id] = baseJson
    })
    markdown = `## Compilation Error\n\n${error}\n\nPlease check for cycles in your graph.`
    json = JSON.stringify(fallbackJsonObj, null, 2)
  }

  return {
    markdown,
    json,
    isValid,
    error,
    sortedNodes,
  }
}
