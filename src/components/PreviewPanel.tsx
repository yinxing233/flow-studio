/**
 * @file components/PreviewPanel.tsx
 * @description 预览面板组件，展示编译后的 Prompt 和调试信息。
 */

import React from 'react'
import { useStore } from '../store/useStore'

const PreviewPanel: React.FC = () => {
  const { compiledPrompt, isValid, error, getSortedNodes, nodes, edges } = useStore()

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt)
    // 简单提示，实际可替换为 toast
    alert('Prompt 已复制到剪贴板！')
  }

  const sortedNodes = getSortedNodes()
  const sortedNodesInfo = sortedNodes.map((n) => `${n.type}: ${n.data.label}`).join('\n')

  return (
    <div className="flex h-full w-80 flex-col border-l border-gray-200">
      <div className="flex-none border-b border-gray-200 p-4">
        <h2 className="mb-2 text-lg font-semibold">Prompt 预览</h2>
        <div
          className={`h-64 overflow-auto rounded-md bg-gray-50 p-3 text-sm ${
            !isValid ? 'border border-red-300 bg-red-50' : ''
          }`}
        >
          <pre className="whitespace-pre-wrap">{compiledPrompt}</pre>
        </div>
        {!isValid && error && <div className="mt-2 text-sm text-red-600">错误：{error}</div>}
        <button
          onClick={handleCopy}
          className="mt-3 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          复制 Prompt
        </button>
      </div>

      <div className="flex-grow overflow-auto p-4">
        <details className="rounded-md border border-gray-200">
          <summary className="cursor-pointer bg-gray-100 p-2">调试信息</summary>
          <div className="p-2 text-sm text-gray-700">
            <h3 className="font-medium">拓扑排序结果:</h3>
            <pre className="mb-4 overflow-auto rounded-md bg-gray-50 p-2 text-xs">
              {sortedNodesInfo || '无节点'}
            </pre>

            <h3 className="font-medium">节点数据 (JSON):</h3>
            <pre className="mb-4 overflow-auto rounded-md bg-gray-50 p-2 text-xs">
              {JSON.stringify(nodes, null, 2)}
            </pre>

            <h3 className="font-medium">连线数据 (JSON):</h3>
            <pre className="overflow-auto rounded-md bg-gray-50 p-2 text-xs">
              {JSON.stringify(edges, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}

export default PreviewPanel
