import { describe, it, expect } from 'vitest'
import { topoSort } from './topoSort'
import type { FlowNode, FlowEdge } from '../types'

describe('topoSort', () => {
  // 测试用例 1: 正常 DAG
  it('should sort nodes in correct order for a simple DAG', () => {
    const nodes: FlowNode[] = [
      { id: '1', type: 'input', data: { label: 'Input', content: '' } },
      { id: '2', type: 'action', data: { label: 'Action', content: '' } },
      { id: '3', type: 'constraint', data: { label: 'Constraint', content: '' } },
    ] as FlowNode[]
    const edges: FlowEdge[] = [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
    ]

    const result = topoSort(nodes, edges)
    expect(result.map((n) => n.id)).toEqual(['1', '2', '3'])
  })

  // 测试用例 2: 多个入度为0的节点
  it('should handle multiple root nodes', () => {
    const nodes: FlowNode[] = [
      { id: '1', type: 'input', data: { label: 'Input1', content: '' } },
      { id: '2', type: 'input', data: { label: 'Input2', content: '' } },
      { id: '3', type: 'action', data: { label: 'Action', content: '' } },
    ] as FlowNode[]
    const edges: FlowEdge[] = [
      { id: 'e1', source: '1', target: '3' },
      { id: 'e2', source: '2', target: '3' },
    ]

    const result = topoSort(nodes, edges)
    // 1 和 2 都是根节点，顺序可以不同，但 3 必须在后面
    expect(result.map((n) => n.id)).toContain('1')
    expect(result.map((n) => n.id)).toContain('2')
    expect(result.map((n) => n.id)).toContain('3')
    expect(result.findIndex((n) => n.id === '3')).toBeGreaterThan(
      Math.max(
        result.findIndex((n) => n.id === '1'),
        result.findIndex((n) => n.id === '2'),
      ),
    )
  })

  // 测试用例 3: 环路检测
  it('should throw an error for cyclic dependencies', () => {
    const nodes: FlowNode[] = [
      { id: '1', type: 'input', data: { label: 'Input', content: '' } },
      { id: '2', type: 'action', data: { label: 'Action', content: '' } },
    ] as FlowNode[]
    const edges: FlowEdge[] = [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '1' }, // 形成环
    ]

    expect(() => topoSort(nodes, edges)).toThrow('Detected cyclic dependency')
  })

  // 测试用例 4: 孤立节点
  it('should handle isolated nodes correctly', () => {
    const nodes: FlowNode[] = [
      { id: '1', type: 'input', data: { label: 'Input', content: '' } },
      { id: '2', type: 'action', data: { label: 'Action', content: '' } },
      { id: '3', type: 'constraint', data: { label: 'Constraint', content: '' } },
    ] as FlowNode[]
    const edges: FlowEdge[] = []

    const result = topoSort(nodes, edges)
    // 无依赖的节点可以任意顺序排列
    expect(result.map((n) => n.id).sort()).toEqual(['1', '2', '3'])
  })
})
