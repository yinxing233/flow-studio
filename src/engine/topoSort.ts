import type { FlowNode, FlowEdge } from '../types'

/**
 * 拓扑排序（Kahn算法）
 * @param nodes 所有节点
 * @param edges 所有连线
 * @returns 排序后的节点数组
 * @throws 存在环路时抛出错误
 */
export const topoSort = (nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] => {
  // 1. 初始化：入度表、邻接表、节点映射
  const inDegree = new Map<string, number>() // 节点 -> 入度
  const adjacencyList = new Map<string, string[]>() // 节点 -> 下游节点列表
  const nodeMap = new Map<string, FlowNode>() // 节点ID -> 节点对象，用于快速查找
  const result: FlowNode[] = []
  const queue: string[] = [] // 入度为0的节点ID队列

  // 如果没有连线，直接返回节点顺序
  if (edges.length === 0) {
    return nodes
  }

  // 初始化所有节点入度为0，邻接表为空，节点映射
  nodes.forEach((node) => {
    inDegree.set(node.id, 0)
    adjacencyList.set(node.id, [])
    nodeMap.set(node.id, node)
  })

  // 根据连线更新入度和邻接表
  edges.forEach((edge) => {
    const { source, target } = edge
    // 目标节点入度+1
    inDegree.set(target, (inDegree.get(target) || 0) + 1)
    // 源节点添加下游
    adjacencyList.get(source)?.push(target)
  })

  // 2. 将所有入度为0的节点入队
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id)
  })

  // 3. BFS拓扑排序
  while (queue.length) {
    const currentId = queue.shift()! // 取出一个入度为0的节点
    const node = nodeMap.get(currentId)! // 性能优化：使用 Map 快速查找节点
    result.push(node) // 加入结果序列

    const neighbors = adjacencyList.get(currentId) || []
    neighbors.forEach((neighborId) => {
      // 移除当前节点后，下游节点入度减1
      const newInDegree = (inDegree.get(neighborId) || 0) - 1
      inDegree.set(neighborId, newInDegree)
      if (newInDegree === 0) queue.push(neighborId) // 入度变为0则入队
    })
  }

  // 4. 环路检测：若结果节点数少于总数，说明存在环
  if (result.length !== nodes.length) {
    throw new Error('Detected cyclic dependency: the graph must be a DAG.')
  }

  return result
}
