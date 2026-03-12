/**
 * @file components/Toast.tsx
 * @description 全局提示组件（使用 useReducer 管理动画状态，避免 ESLint 警告）
 */

import React, { useEffect, useReducer } from 'react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'

// 定义状态类型
type ToastState = {
  visible: boolean
  leaving: boolean
}

type ToastAction = { type: 'SHOW' } | { type: 'LEAVE' } | { type: 'HIDE' }

const reducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'SHOW':
      return { visible: true, leaving: false }
    case 'LEAVE':
      return { ...state, leaving: true }
    case 'HIDE':
      return { visible: false, leaving: false }
    default:
      return state
  }
}

const Toast: React.FC = () => {
  const { toast, clearToast } = useStore()
  const [state, dispatch] = useReducer(reducer, { visible: false, leaving: false })

  useEffect(() => {
    if (toast) {
      // 新消息到达：立即显示，清除离开状态
      dispatch({ type: 'SHOW' })

      // 自动消失定时器（2.7秒后触发退出动画）
      const timer = setTimeout(() => {
        dispatch({ type: 'LEAVE' })
      }, 2700)

      return () => clearTimeout(timer)
    } else {
      // toast 被清除时，重置内部状态
      dispatch({ type: 'HIDE' })
    }
  }, [toast])

  // 动画结束处理：如果 leaving 为 true，则真正移除 toast（通过 store）
  const handleAnimationEnd = () => {
    if (state.leaving) {
      clearToast()
      // 状态会在 useEffect 中重置（因为 toast 变为 null）
    }
  }

  // 手动关闭：立即触发退出动画
  const handleClose = () => {
    dispatch({ type: 'LEAVE' })
  }

  // 如果不可见且没有离开动画，不渲染
  if (!state.visible && !state.leaving) return null

  const bgColor = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    info: 'bg-blue-500',
  }[toast?.type || 'info']

  const animationClass = state.leaving ? 'animate-fade-out' : 'animate-slide-down'

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg ${bgColor} ${animationClass}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <span className="text-sm font-medium">{toast?.message}</span>
        <button
          onClick={handleClose}
          className="rounded-full p-1 transition-colors hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
