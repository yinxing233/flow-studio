/**
 * @file engine/compiler.ts
 * @description 编译流程图，生成通用工作流描述（元语言风格）
 */

import type { FlowNode, FlowEdge, CompileResult, InputNodeData } from '../types'
import { topoSort, CyclicDependencyError } from './topoSort'

interface NodeJson {
  type: string
  label: string
  content: string
  variables?: string[]
}

/**
 * 生成通用工作流 Markdown（最终确认版）
 */
const generateWorkflowMarkdown = (sortedNodes: FlowNode[], edges: FlowEdge[]): string => {
  const markdownParts: string[] = []

  // 1. 构建上游依赖映射
  const upstreamMap = new Map<string, string[]>()
  edges.forEach((edge) => {
    const deps = upstreamMap.get(edge.target) || []
    deps.push(edge.source)
    upstreamMap.set(edge.target, deps)
  })

  // 2. 步骤编号映射（同时保存标签）
  const stepMap = new Map<string, { index: number; label: string }>()
  sortedNodes.forEach((node, index) => {
    stepMap.set(node.id, { index: index + 1, label: node.data.label || '未命名节点' })
  })

  // 3. 头部元指令（通用，不特指 AI）
  markdownParts.push('# Workflow: 流程设计\n')
  markdownParts.push('## 0. 元指令')
  markdownParts.push(
    '请按照以下步骤顺序执行，每个步骤的输出作为后续依赖步骤的输入。\n' +
    '严格遵守末尾列出的“全局约束”。\n'
  )

  // 4. 节点编排
  sortedNodes.forEach((node) => {
    const { index, label } = stepMap.get(node.id)!
    const upstreamIds = upstreamMap.get(node.id) || []

    // 依赖引用：步骤 X (标签)
    const upstreamRefs = upstreamIds
      .map((id) => {
        const info = stepMap.get(id)
        return info ? `步骤 ${info.index} (${info.label})` : ''
      })
      .filter(Boolean)
      .join('、') || '无（起始步骤）'

    markdownParts.push(`### 步骤 ${index}: ${label}`)
    markdownParts.push(`- **节点类型**: ${node.type.toUpperCase()}`)
    markdownParts.push(`- **依赖**: ${upstreamRefs}`)

    // 核心指令（多行内容）
    markdownParts.push(`- **指令/内容**:`)
    markdownParts.push(`> ${node.data.content.replace(/\n/g, '\n> ')}`)

    // 提取局部变量
    const vars = node.data.content.match(/\{\{([^}]+)\}\}/g)
    if (vars) {
      markdownParts.push(`- **本地变量**: ${[...new Set(vars)].join(', ')}`)
    }
    markdownParts.push('')
  })

  // 5. 全局约束
  const globalConstraints = sortedNodes
    .filter((n) => n.type === 'constraint')
    .map((n) => n.data.content)
    .filter(Boolean)

  if (globalConstraints.length > 0) {
    markdownParts.push('---')
    markdownParts.push('## 全局约束')
    globalConstraints.forEach((c, i) => markdownParts.push(`${i + 1}. ${c}`))
    markdownParts.push('')
  }

  // 6. 全局变量表
  const allVars = new Set<string>()
  sortedNodes.forEach((node) => {
    const vars = node.data.content.match(/\{\{([^}]+)\}\}/g) || []
    vars.forEach((v) => allVars.add(v))
  })

  if (allVars.size > 0) {
    markdownParts.push('## 待填充变量表')
    ;[...allVars].sort().forEach((v) => markdownParts.push(`- [ ] ${v}`))
  }

  return markdownParts.join('\n')
}

export const compileGraph = (nodes: FlowNode[], edges: FlowEdge[]): CompileResult => {
  let markdown = ''
  let json = ''
  let isValid = true
  let error: string | undefined
  let sortedNodes: FlowNode[] | undefined

  try {
    sortedNodes = topoSort(nodes, edges)
    markdown = generateWorkflowMarkdown(sortedNodes, edges)

    // 生成 JSON（保留原有结构）
    const jsonObj: Record<string, NodeJson> = {}
    sortedNodes.forEach((node) => {
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
      jsonObj[node.id] = baseJson
    })
    json = JSON.stringify(jsonObj, null, 2)
  } catch (err) {
    isValid = false
    if (err instanceof CyclicDependencyError) {
      error = err.message
    } else {
      error = err instanceof Error ? err.message : String(err)
    }
    markdown = `## 编译错误\n\n${error}\n\n请检查流程图是否存在循环依赖。`
    json = JSON.stringify({ error }, null, 2)
  }

  return {
    markdown,
    json,
    isValid,
    error,
    sortedNodes,
  }
}