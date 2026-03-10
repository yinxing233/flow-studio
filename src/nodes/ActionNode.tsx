import { Handle, Position, type NodeProps } from 'reactflow'
import { type FlowNodeData } from '../types'

export const ActionNode = ({ data }: NodeProps<FlowNodeData>) => {
  return (
    <div className="w-48 rounded-lg border border-green-500 bg-green-50 shadow-md">
      <div className="p-2 font-semibold text-green-700">动作节点</div>
      <div className="p-2 text-sm text-gray-600">{data.label}</div>
      <Handle type="target" position={Position.Left} className="h-2 w-2 bg-green-500" />
      <Handle type="source" position={Position.Right} className="h-2 w-2 bg-green-500" />
    </div>
  )
}
