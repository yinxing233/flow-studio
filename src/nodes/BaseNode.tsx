import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'

interface BaseNodeProps {
  id: string
  selected?: boolean
  children: React.ReactNode
  className?: string
  showTarget?: boolean
  showSource?: boolean
  handleColor?: string
}

export const BaseNode = memo(
  ({
    id,
    selected,
    children,
    className = '',
    showTarget = true,
    showSource = true,
    handleColor = 'bg-gray-400',
  }: BaseNodeProps) => {
    const deleteNode = useStore((state) => state.deleteNode)

    return (
      <div
        className={`group relative min-w-[150px] rounded-lg border-2 bg-white p-1 transition-all ${
          selected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
        } ${className}`}
      >
        {/* 删除按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteNode(id)
          }}
          className={`absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-all hover:bg-red-600 ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
          }`}
        >
          <X size={14} />
        </button>

        {/* 内容区域 - 直接渲染 children，不再处理字符串 */}
        <div className="h-full w-full">{children}</div>

        {/* 输入点 */}
        {showTarget && (
          <Handle
            type="target"
            position={Position.Left}
            className={`h-3 w-3 border-2 border-white ${handleColor}`}
          />
        )}

        {/* 输出点 */}
        {showSource && (
          <Handle
            type="source"
            position={Position.Right}
            className={`h-3 w-3 border-2 border-white ${handleColor}`}
          />
        )}
      </div>
    )
  },
)

BaseNode.displayName = 'BaseNode'
