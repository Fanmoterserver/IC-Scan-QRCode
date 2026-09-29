import { forwardRef, useRef } from 'react'
import { Input } from '@/components/ui/input'

// Scanners type faster than this between characters; humans don't.
// If real scans get cleared, raise this (e.g. 80-100).
const MAX_GAP_MS = 50

export const ScanInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  function ScanInput({ onKeyDown, ...props }, ref) {
    const lastKeyTime = useRef(0)
    const block = (e: React.SyntheticEvent) => e.preventDefault()

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const key = e.key.toLowerCase()

      // Block copy / paste / cut shortcuts
      if ((e.ctrlKey || e.metaKey) && ['v', 'c', 'x'].includes(key)) return block(e)
      if (e.shiftKey && key === 'insert') return block(e)

      // Printable character: check typing speed
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const now = performance.now()
        const gap = now - lastKeyTime.current
        lastKeyTime.current = now

        // A slow keystroke means a human is typing: wipe the field and
        // treat this character as the start of a new input.
        if (gap > MAX_GAP_MS && e.currentTarget.value.length > 0) {
          e.currentTarget.value = ''
        }
      }

      onKeyDown?.(e)
    }

    return (
      <Input
        {...props}
        ref={ref}
        autoComplete="off"
        onKeyDown={handleKeyDown}
        onPaste={block}
        onCopy={block}
        onCut={block}
        onDrop={block}
        onDragStart={block}
        onContextMenu={block}
        onBeforeInput={(e) => {
          const t = (e.nativeEvent as InputEvent).inputType
          if (t === 'insertFromPaste' || t === 'insertFromDrop') block(e)
        }}
      />
    )
  }
)
