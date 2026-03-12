/**
 * @file components/ControlPanel.tsx
 * @description 流程图画布的控制面板组件。
 */

import { useStore } from '../store/useStore'
import type { FlowNode } from '../types'
import { Trash2, Download, Upload, RotateCcw } from 'lucide-react'

export const ControlPanel = () => {
  const { addNode, nodes, deleteNode, edges, loadFromJSON, resetToDefault } = useStore()

  // 获取当前选中的节点
  const selectedNodes = nodes.filter((node) => node.selected)

  // 处理删除选中节点
  const handleDeleteSelected = () => {
    if (selectedNodes.length === 0) return
    const idsToDelete = selectedNodes.map((node) => node.id)
    idsToDelete.forEach((id) => deleteNode(id))
  }

  // 处理添加节点
  const handleAddNode = (type: 'input' | 'action' | 'constraint') => {
    const newNode: FlowNode = {
      id: `${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} 节点`,
        content: '',
      },
    }
    addNode(newNode)
  }

  // 导出 JSON
  const handleExport = () => {
    const data = {
      nodes,
      edges,
    }
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入 JSON
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (json.nodes && json.edges) {
          loadFromJSON(json)
        } else {
          alert('无效的 JSON 文件：缺少 nodes 或 edges 字段')
        }
      } catch (err) {
        alert('解析 JSON 失败：' + err)
      }
    }
    reader.readAsText(file)
    // 重置 input 以便再次选择同一文件
    event.target.value = ''
  }

  // 重置为默认示例
  const handleReset = () => {
    if (confirm('确定要重置为默认示例吗？当前未保存的更改将丢失。')) {
      resetToDefault()
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-gray-800 p-4 text-white">
      <h2 className="mb-2 border-b border-gray-700 pb-2 text-xl font-bold">控制面板</h2>

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

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700 active:scale-95"
        >
          <Download size={16} />
          导出 JSON
        </button>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700 active:scale-95">
          <Upload size={16} />
          导入 JSON
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded bg-yellow-600 px-4 py-2 transition-colors hover:bg-yellow-700 active:scale-95"
        >
          <RotateCcw size={16} />
          重置默认
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={selectedNodes.length === 0}
          className="flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 transition-colors hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-50"
        >
          <Trash2 size={16} />
          删除选中节点 {selectedNodes.length > 0 && `(${selectedNodes.length})`}
        </button>
        <div className="text-xs text-gray-400 italic">提示：点击按钮在画布中生成节点</div>
      </div>
    </div>
  )
}