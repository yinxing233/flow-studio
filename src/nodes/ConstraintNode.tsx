import { Handle, Position, type NodeProps } from 'reactflow'
import { type FlowNodeData } from '../types'

export const ConstraintNode = ({ data }: NodeProps<FlowNodeData>) => {
  return (
    <div className="w-48 rounded-lg border border-yellow-500 bg-yellow-50 shadow-md">
      <div className="p-2 font-semibold text-yellow-700">约束节点</div>
      <div className="p-2 text-sm text-gray-600">{data.label}</div>
      <Handle type="target" position={Position.Left} className="h-2 w-2 bg-yellow-500" />
      <Handle type="source" position={Position.Right} className="h-2 w-2 bg-yellow-500" />
    </div>
  )
}
