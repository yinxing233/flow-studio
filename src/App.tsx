import React, { useCallback } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'

// 1. 核心逻辑组件
const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: '输入经历 (Node A)' },
    },
    {
      id: '2',
      position: { x: 400, y: 100 },
      data: { label: 'AI 简历提取 (Node B)' },
    },
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState([{ id: 'e1-2', source: '1', target: '2' }])

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* 左侧画布 */}
      <div style={{ flex: 3, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>

      {/* 右侧 JSON 显影 */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#282c34',
          color: '#fff',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <h3>逻辑地图 (JSON)</h3>
        <pre style={{ fontSize: '12px' }}>{JSON.stringify({ nodes, edges }, null, 2)}</pre>
      </div>
    </div>
  )
}

// 2. 顶层入口（负责“通电”）
export default function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  )
}
