/**
 * @file engine/topoSort.ts
 * @description 拓扑排序（Kahn算法），自动过滤无效边，检测环路。
 */

import type { FlowNode, FlowEdge } from '../types'

export class CyclicDependencyError extends Error {
  constructor() {
    super('Detected cyclic dependency: the graph must be a DAG.')
    this.name = 'CyclicDependencyError'
  }
}

export const topoSort = (nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] => {
  // 如果没有节点，直接返回空数组
  if (nodes.length === 0) return []

  // 建立节点 ID 集合用于快速查找
  const nodeIdSet = new Set(nodes.map((n) => n.id))

  // 过滤掉 source 或 target 不在节点列表中的边
  const validEdges = edges.filter(
    (edge) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target)
  )

  // 如果没有有效边，直接返回节点（顺序任意，保持原数组）
  if (validEdges.length === 0) {
    return [...nodes] // 返回副本，避免外部修改
  }

  // 初始化入度表、邻接表、节点映射
  const inDegree = new Map<string, number>()
  const adjacencyList = new Map<string, string[]>()
  const nodeMap = new Map<string, FlowNode>()

  nodes.forEach((node) => {
    inDegree.set(node.id, 0)
    adjacencyList.set(node.id, [])
    nodeMap.set(node.id, node)
  })

  // 构建图
  validEdges.forEach((edge) => {
    const { source, target } = edge
    // 目标节点入度+1
    inDegree.set(target, (inDegree.get(target) || 0) + 1)
    // 源节点添加下游
    adjacencyList.get(source)?.push(target)
  })

  // 队列：所有入度为0的节点
  const queue: string[] = []
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id)
  })

  const result: FlowNode[] = []

  // BFS 拓扑排序
  while (queue.length) {
    const currentId = queue.shift()!
    const currentNode = nodeMap.get(currentId)!
    result.push(currentNode)

    const neighbors = adjacencyList.get(currentId) || []
    neighbors.forEach((neighborId) => {
      const newDegree = (inDegree.get(neighborId) || 0) - 1
      inDegree.set(neighborId, newDegree)
      if (newDegree === 0) queue.push(neighborId)
    })
  }

  // 检查环路：如果结果数量少于节点总数，说明存在环
  if (result.length !== nodes.length) {
    throw new CyclicDependencyError()
  }

  return result
}