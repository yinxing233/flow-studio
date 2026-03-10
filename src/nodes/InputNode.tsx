import { Handle, Position, type NodeProps } from 'reactflow'
import { type FlowNodeData } from '../types'

export const InputNode = ({ data }: NodeProps<FlowNodeData>) => {
  return (
    <div className="w-48 rounded-lg border border-blue-500 bg-blue-50 shadow-md">
      <div className="p-2 font-semibold text-blue-700">输入节点</div>
      <div className="p-2 text-sm text-gray-600">{data.label}</div>
      <Handle type="source" position={Position.Right} className="h-2 w-2 bg-blue-500" />
    </div>
  )
}
