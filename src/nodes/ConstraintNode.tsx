import React from 'react'
import { type NodeProps } from 'reactflow'
import { type FlowNodeData } from '../types'
import { BaseNode } from './BaseNode'
import { useStore } from '../store/useStore'

export const ConstraintNode = ({ id, selected, data }: NodeProps<FlowNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData)

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: e.target.value })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: e.target.value })
  }

  return (
    <BaseNode
      id={id}
      selected={selected}
      showSource={false}
      handleColor="bg-yellow-500"
      className="w-64 bg-yellow-50"
    >
      <div className="p-2">
        <input
          type="text"
          value={data.label}
          onChange={handleLabelChange}
          className="nodrag w-full rounded border border-yellow-200 bg-transparent px-2 py-1 font-semibold text-yellow-700 focus:border-yellow-500 focus:outline-none"
          placeholder="节点名称"
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>
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