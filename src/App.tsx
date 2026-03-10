import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ReactFlow, { Background, Controls, ReactFlowProvider, type NodeTypes } from 'reactflow'
import 'reactflow/dist/style.css'

import { useStore } from './store/useStore'
import { InputNode } from './nodes/InputNode'
import { ActionNode } from './nodes/ActionNode'
import { ConstraintNode } from './nodes/ConstraintNode'
import { ControlPanel } from './components/ControlPanel'

const nodeTypes: NodeTypes = {
  input: InputNode,
  action: ActionNode,
  constraint: ConstraintNode,
}

const FlowEditor = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, topoOrder, error } = useStore()
  const [showLeftPanel, setShowLeftPanel] = useState(true)

  return (
    <div className="flex h-screen w-screen">
      {/* 左侧控制面板 - 滑动动画 */}
      <div
        className={`h-full border-r border-gray-700 transition-all duration-300 ease-in-out ${showLeftPanel ? 'w-80 opacity-100' : 'w-0 overflow-hidden opacity-0'} `}
      >
        {/* 面板内容容器，避免宽度为0时内容溢出 */}
        <div className="h-full w-80">
          <ControlPanel />
        </div>
      </div>

      {/* 画布区域 */}
      <div className="relative h-full flex-1">
        {/* 美化后的浮动按钮 */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800/80 px-3 py-2 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-gray-700/90"
        >
          {showLeftPanel ? <X size={18} /> : <Menu size={18} />}
          <span className="text-sm font-medium">{showLeftPanel ? '关闭面板' : '打开面板'}</span>
        </button>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      {/* 右侧面板保持不变，但统一使用 Tailwind 类 */}
      <div className="w-80 overflow-auto border-l border-gray-700 bg-gray-800 p-5 text-white">
        <h3 className="mb-4 text-lg font-bold">执行顺序 (Topo Order)</h3>
        {error ? (
          <div className="mb-4 rounded border border-red-500 bg-red-900/30 p-3 text-red-400">
            错误: {error}
          </div>
        ) : (
          <ol className="mb-8 list-inside list-decimal space-y-2">
            {topoOrder.map((node) => (
              <li key={node.id} className="text-sm">
                <span className="text-blue-400">[{node.type.toUpperCase()}]</span> {node.data.label}
              </li>
            ))}
          </ol>
        )}

        <h3 className="mb-4 text-lg font-bold">逻辑地图 (JSON)</h3>
        <pre className="overflow-auto rounded bg-black/30 p-2 text-xs">
          {JSON.stringify({ nodes, edges }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  )
}
