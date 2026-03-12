/**
 * @file store/useStore.ts
 */

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
import { compileGraph } from '../engine/compiler'

// Toast 类型定义
export interface Toast {
  message: string
  type: 'error' | 'success' | 'info'
}

const STORAGE_KEY = 'flow-studio-data'

interface FlowState {
  nodes: FlowNode[]
  edges: FlowEdge[]
  compiledPrompt: string
  isValid: boolean
  error: string | null
  toast: Toast | null

  // React Flow 必需的 handlers
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect

  // 辅助 actions
  addNode: (node: FlowNode) => void
  deleteNode: (nodeId: string) => void
  updateNodeData: (nodeId: string, data: Partial<FlowNode['data']>) => void
  getSortedNodes: () => FlowNode[]
  recompute: () => void
  // Toast 控制
  showToast: (toast: Toast) => void
  clearToast: () => void
  // 从 JSON 加载流程图
  loadFromJSON: (data: { nodes: FlowNode[]; edges: FlowEdge[] }) => void
  // 重置为默认示例
  resetToDefault: () => void
}

// 默认示例数据
const defaultNodes: FlowNode[] = [
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
const defaultEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }]

// 尝试从 localStorage 读取初始数据
let initialNodes: FlowNode[] = defaultNodes
let initialEdges: FlowEdge[] = defaultEdges
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    if (
      parsed.nodes &&
      Array.isArray(parsed.nodes) &&
      parsed.edges &&
      Array.isArray(parsed.edges)
    ) {
      initialNodes = parsed.nodes
      initialEdges = parsed.edges
    }
  }
} catch (e) {
  console.warn('Failed to load from localStorage, using default data', e)
}

const saveToLocalStorage = (nodes: FlowNode[], edges: FlowEdge[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }))
  } catch (e) {
    console.warn('Failed to save to localStorage', e)
  }
}

export const useStore = create<FlowState>((set, get) => {
  const initialCompile = compileGraph(initialNodes, initialEdges)

  return {
    nodes: initialNodes,
    edges: initialEdges,
    compiledPrompt: initialCompile.markdown,
    isValid: initialCompile.isValid,
    error: initialCompile.error || null,
    toast: null,

    onNodesChange: (changes: NodeChange[]) => {
      const { nodes: currentNodes, edges: currentEdges } = get()
      const nextNodes = applyNodeChanges(changes, currentNodes) as FlowNode[]
      const deletedIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id)

      let nextEdges = currentEdges
      if (deletedIds.length > 0) {
        nextEdges = currentEdges.filter(
          (edge) => !deletedIds.includes(edge.source) && !deletedIds.includes(edge.target),
        )
      }

      set({ nodes: nextNodes, edges: nextEdges })
      get().recompute()
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, get().edges) as FlowEdge[]
      set({ edges: nextEdges })
      get().recompute()
    },

    onConnect: (connection: Connection) => {
      const { nodes, edges } = get()
      const newEdge = { ...connection, id: `e-${Date.now()}` } as FlowEdge
      const testEdges = [...edges, newEdge]
      const testCompile = compileGraph(nodes, testEdges)
      if (!testCompile.isValid) {
        get().showToast({
          message: '无法连接：会导致循环依赖',
          type: 'error',
        })
        return
      }
      const nextEdges = addEdge(newEdge, edges) as FlowEdge[]
      set({ edges: nextEdges })
      get().recompute()
    },

    addNode: (node: FlowNode) => {
      const offset = get().nodes.length * 50
      const newNode: FlowNode = {
        ...node,
        position: { x: 150 + offset, y: 150 + offset },
      }
      set({ nodes: [...get().nodes, newNode] })
      get().recompute()
    },

    deleteNode: (nodeId: string) => {
      const { nodes, edges } = get()
      const nextNodes = nodes.filter((n) => n.id !== nodeId)
      const nextEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
      set({ nodes: nextNodes, edges: nextEdges })
      get().recompute()
    },

    updateNodeData: (nodeId: string, data: Partial<FlowNode['data']>) => {
      const nextNodes = get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node,
      )
      set({ nodes: nextNodes })
      get().recompute()
    },

    recompute: () => {
      const { nodes, edges } = get()
      const result = compileGraph(nodes, edges)
      set({
        compiledPrompt: result.markdown,
        isValid: result.isValid,
        error: result.error || null,
      })
      // 自动保存到 localStorage
      saveToLocalStorage(nodes, edges)
    },

    getSortedNodes: () => {
      const { nodes, edges } = get()
      const result = compileGraph(nodes, edges)
      return result.sortedNodes || nodes
    },

    showToast: (toast: Toast) => {
      set({ toast })
      setTimeout(() => {
        set((state) => {
          if (state.toast === toast) {
            return { toast: null }
          }
          return state
        })
      }, 3000)
    },
    clearToast: () => set({ toast: null }),

    loadFromJSON: (data: { nodes: FlowNode[]; edges: FlowEdge[] }) => {
      set({ nodes: data.nodes, edges: data.edges })
      get().recompute()
    },

    resetToDefault: () => {
      set({ nodes: defaultNodes, edges: defaultEdges })
      get().recompute()
    },
  }
})

export default useStore