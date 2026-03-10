import { create } from 'zustand'
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'
import type { FlowNode, FlowEdge } from '../types'
import { topoSort } from '../engine/topoSort'

interface FlowState {
  nodes: FlowNode[]
  edges: FlowEdge[]
  topoOrder: FlowNode[]
  isValid: boolean
  error: string | null

  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect

  // 辅助 Actions
  addNode: (node: FlowNode) => void
  updateNodeData: (nodeId: string, data: Partial<FlowNode['data']>) => void
  recompute: () => void
}

/**
 * Zustand Store
 * @logic 遵循 UI -> Store -> Engine 的单向数据流
 */
export const useStore = create<FlowState>((set, get) => {
  // 初始测试数据
  const initialNodes: FlowNode[] = [
    {
      id: '1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { label: '输入经历 (Node A)', content: '' },
    },
    {
      id: '2',
      type: 'action',
      position: { x: 400, y: 100 },
      data: { label: 'AI 简历提取 (Node B)', content: '' },
    },
  ]

  const initialEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }]

  // 初始化拓扑排序
  let initialTopoOrder: FlowNode[] = []
  try {
    initialTopoOrder = topoSort(initialNodes, initialEdges)
  } catch (err) {
    console.warn('初始化拓扑排序失败:', err)
    initialTopoOrder = initialNodes
  }

  return {
    nodes: initialNodes,
    edges: initialEdges,
    topoOrder: initialTopoOrder,
    isValid: true,
    error: null,

    onNodesChange: (changes: NodeChange[]) => {
      // 仅当节点被删除时才重新计算拓扑排序
      const hasDelete = changes.some((change) => change.type === 'remove')
      set({
        nodes: applyNodeChanges(changes, get().nodes) as FlowNode[],
      })
      if (hasDelete) {
        get().recompute()
      }
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges) as FlowEdge[],
      })
      get().recompute()
    },

    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges) as FlowEdge[],
      })
      get().recompute()
    },

    addNode: (node: FlowNode) => {
      set({
        nodes: [...get().nodes, node],
      })
      get().recompute()
    },

    updateNodeData: (nodeId: string, data: Partial<FlowNode['data']>) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...data } }
          }
          return node
        }),
      })
      get().recompute()
    },

    recompute: () => {
      const { nodes, edges } = get()
      if (nodes.length === 0) {
        set({ topoOrder: [], isValid: true, error: null })
        return
      }

      try {
        // 如果没有连线，则直接返回节点顺序
        if (edges.length === 0) {
          set({ topoOrder: nodes, isValid: true, error: null })
          return
        }

        const sorted = topoSort(nodes, edges)
        set({ topoOrder: sorted, isValid: true, error: null })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.warn('拓扑排序错误:', { nodes, edges }, message)
        set({ isValid: false, error: message })
      }
    },
  }
})

export default useStore
