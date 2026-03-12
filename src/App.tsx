import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ReactFlow, { Background, Controls, ReactFlowProvider, type NodeTypes } from 'reactflow'
import 'reactflow/dist/style.css'

import { useStore } from './store/useStore'
import { InputNode } from './nodes/InputNode'
import { ActionNode } from './nodes/ActionNode'
import { ConstraintNode } from './nodes/ConstraintNode'
import { ControlPanel } from './components/ControlPanel'
import PreviewPanel from './components/PreviewPanel'
import Toast from './components/Toast'

const nodeTypes: NodeTypes = {
  input: InputNode,
  action: ActionNode,
  constraint: ConstraintNode,
}

const FlowEditor = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore()
  const [showLeftPanel, setShowLeftPanel] = useState(true)

  return (
    <div className="flex h-screen w-screen">
      {/* 左侧控制面板 - 滑动动画 */}
      <div
        className={`h-full border-r border-gray-700 transition-all duration-300 ease-in-out ${
          showLeftPanel ? 'w-80 opacity-100' : 'w-0 overflow-hidden opacity-0'
        }`}
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
          style={{ background: '#f9fafb' }} // 浅灰色背景
        >
          <Background color="#d1d5db" gap={16} size={1} /> {/* 浅灰色点 */}
          <Controls />
        </ReactFlow>
      </div>

      {/* 右侧面板 */}
      <PreviewPanel />
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Toast />
      <FlowEditor />
    </ReactFlowProvider>
  )
}