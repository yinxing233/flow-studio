import React from 'react'
import { type NodeProps } from 'reactflow'
import { type FlowNodeData } from '../types'
import { BaseNode } from './BaseNode'
import { useStore } from '../store/useStore'

export const ActionNode = ({ id, selected, data }: NodeProps<FlowNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: e.target.value })
  }

  return (
    <BaseNode id={id} selected={selected} handleColor="bg-green-500" className="w-64 bg-green-50">
      <div className="p-2 font-semibold text-green-700">⚡ 动作节点</div>
      <textarea
        value={data.content ?? ''}
        onChange={handleContentChange}
        className="nodrag w-full resize-none bg-transparent p-2 text-sm text-gray-600 focus:outline-none"
        rows={3}
        placeholder="请输入内容..."
        onMouseDown={(e) => e.stopPropagation()}
      />
    </BaseNode>
  )
}
