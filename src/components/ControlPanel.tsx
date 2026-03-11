/**
 * @file ControlPanel.tsx
 * @description 流程图画布的控制面板组件，负责节点类型的选择与实例化。
 */

import { useStore } from '../store/useStore'
import type { FlowNode } from '../types'

export const ControlPanel = () => {
  const { addNode } = useStore()

  // 处理节点添加逻辑
  const handleAddNode = (type: 'input' | 'action' | 'constraint') => {
    const newNode: FlowNode = {
      // 使用时间戳作为临时 ID，坐标固定在 (100, 100)
      id: `${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: {
        label: `${type.toUpperCase()} 节点`,
        content: '',
      },
    }
    addNode(newNode)
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-gray-800 p-4 text-white">
      <h2 className="mb-2 text-xl font-bold border-b border-gray-700 pb-2">控制面板</h2>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleAddNode('input')}
          className="rounded bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700 active:scale-95"
        >
          添加输入节点
        </button>

        <button
          onClick={() => handleAddNode('action')}
          className="rounded bg-green-600 px-4 py-2 transition-colors hover:bg-green-700 active:scale-95"
        >
          添加动作节点
        </button>

        <button
          onClick={() => handleAddNode('constraint')}
          className="rounded bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700 active:scale-95"
        >
          添加约束节点
        </button>
      </div>

      <div className="mt-auto text-xs text-gray-400 italic">
        提示：点击按钮在画布中心生成节点
      </div>
    </div>
  )
}