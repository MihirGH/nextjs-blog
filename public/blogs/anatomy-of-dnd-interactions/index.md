---
title: Anatomy of the Drag-and-Drop interactions in JavaScript
date: 2025-02-06
spoiler: Drag-and-drop (DnD) interactions are a staple in modern web applications, offering users an intuitive way to manipulate elements on the screen. In this blog, we'll dive deep into the anatomy of DnD interactions, explore how to build them in React using nothing but the mouse events from the scratch.
cta: javascript,react,event-handlers
---

## What is a Drag-and-Drop Interaction?

Drag-and-drop (DnD) interactions are a staple in modern web applications, offering users an intuitive way to manipulate elements on the screen. Whether it's rearranging items in a list, resizing columns in a table, or selecting multiple cells, DnD interactions enhance the user experience by making interfaces more interactive and dynamic.

At its core, a drag-and-drop interaction involves three key steps:

1. User **clicks** and grabs an element: The interaction begins when the user presses the mouse button on a draggable element.
2. User **moves** the element around: As the user moves the mouse, the element might follow the cursor, or some other visual feedback is given to the user for the ongoing interaction.
3. User **releases** the click and drops the element in a different location: The interaction ends when the user releases the mouse button, dropping the element in its new position.

## Handling Drag-and-Drop Interactions in JavaScript

To implement DnD interactions in JavaScript, we rely on three primary mouse events:

- **`mousedown`**: Fired when the user presses the mouse button.
- **`mousemove`**: Fired when the user moves the mouse pointer.
- **`mouseup`**: Fired when the user releases the mouse button.

### Breaking Down the Events

1. **`mousedown` - The Start of the Interaction**:

   - This event marks the beginning of the DnD interaction.
   - In this event's handle, we might store information about the state of the UI before the interaction starts, such as the initial location of the mouse cursor or we might perform relevant business logic that is needed as part of the preparation that is needed before moving the element.

2. **`mousemove` - The Fun Part**:

   - During this event, we reactively update the state of the UI based on the current location of the mouse.
   - This is where the magic happens —- Elements move around the screen or visual cues gets updated reactively based on the current location of the mouse, giving users real-time feedback.

3. **`mouseup` - The End of the Interaction**:
   - This event signifies the end of the DnD interaction.
   - We determine if the operation is valid and commit the final changes, such as firing backend mutations or setting the final UI state.

## Practical Example -- Bulk Selecting Cells in a data-grid

Let's explore a practical example to see how these events come together to create seamless DnD interactions. Especially in the context of data-heavy applications such as data-grid or spreadsheet, selecting multiple cells via drag-and-drop is a powerful feature. Let's breakdown the interaction in above mentioned events.

Our selection state would look something like below:

```tsx
type CellInfo = {
  rowIndex: number
  columnIndex: number
}

type SelectionState = {
  startingCell: CellInfo
  endingCell: CellInfo
} | null
```

When no cells are selected, our state would be `null`.

Also to identify whether a DnD selection interaction is in progress or not, we will maintain a ref called `isSelectingRef`.

Whenever

- **`mousedown` event occurs on a cell**: set the cell where the event occurred as the `startingCell` and `endingCell` of the selection. Also we mutate `isSelectingRef.current` to true to mark an in progress selection interaction.
- **`mouseover` event occurs a cell**: If `isSelectingRef.current` is `false` then that means there is no selection in progress so we ignore this event. This check prevents unnecessary state updates when user is not selecting cells in the first place. Otherwise, we update the `endingCell` in the state, set the current cell where the user's mouse is currently at as `endingCell`. Using `startingCell` and `endingCell` we can determine the rectangular block of the cells that are currently selected and show them with a different background color on the UI. This provides a visual cue to the user about the cells that are selected currently.
- **`mouseup` on the document**: Perform cleanup by mutating the `isSelectingRef.current` as `false`.

In terms of code, the state management and event handlers can be neatly abstracted in a `useBulkCellsSelection` hook as illustrated below.

```tsx
export const useBulkCellsSelection = () => {
  const isSelectingRef = useRef(false)
  const [selectionState, setSelectionState] = useState<SelectionState | null>(
    null
  )

  const onCellMouseDown = (rowIndex: number, columnIndex: number) => {
    isSelectingRef.current = true
    const startingCell = { rowIndex, columnIndex }
    setSelectionState({ startingCell, endingCell: startingCell })
  }

  const onCellMouseOver = (rowIndex: number, columnIndex: number) => {
    if (!isSelectingRef.current) return
    const endingCell = { rowIndex, columnIndex }
    setSelectionState((prev) => (prev ? { ...prev, endingCell } : null))
  }

  useEffect(() => {
    // Handle mouseup event to reset isSelectingRef
    const handleMouseUp = () => {
      isSelectingRef.current = false
    }

    // Attach on document
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      // Don't forget to cleanup
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [clearTicking])

  const isRowSelected = (rowIndex: number) => {
    if (!selectionState) return false

    const rowStart = Math.min(
      selectionState.startingCell.rowIndex,
      selectionState.endingCell.rowIndex
    )
    const rowEnd = Math.max(
      selectionState.startingCell.rowIndex,
      selectionState.endingCell.rowIndex
    )

    return rowStart <= rowIndex && rowIndex <= rowEnd
  }

  const isColumnSelected = (columnIndex: number) => {
    if (!selectionState) return false

    const colStart = Math.min(
      selectionState.startingCell.columnIndex,
      selectionState.endingCell.columnIndex
    )
    const colEnd = Math.max(
      selectionState.startingCell.columnIndex,
      selectionState.endingCell.columnIndex
    )

    return colStart <= columnIndex && columnIndex <= colEnd
  }

  const isCellSelected = (rowIndex: number, columnIndex: number) => {
    return isRowSelected(rowIndex) && isColumnSelected(columnIndex)
  }

  const isCursor = (rowIndex: number, columnIndex: number) => {
    return (
      selectionState &&
      selectionState.startingCell.rowIndex === rowIndex &&
      selectionState.startingCell.columnIndex === columnIndex
    )
  }

  return {
    selectionState,
    onCellMouseDown,
    onCellMouseOver,
    isRowSelected,
    isColumnSelected,
    isCellSelected,
    isCursor,
  }
}
```

## Bonus: Adding auto-scroll

In modern web applications, users often interact with large datasets presented in a grid or table format. As the user navigates through the data, they may need to select multiple cells by dragging their mouse cursor. However, when the selection area exceeds the visible boundaries of the container, the user experience can become frustrating. To address this issue, we can implement an auto-scroll feature that seamlessly scrolls the container when the user approaches its edges thus significantly enhancing the user experience.

The `useAutoScroll` hook is designed to automatically scroll a container when the user's mouse cursor approaches its edges. For this, we need to store the scrollable container's `ref`.

The handling of our key events only differs slightly with addition to one more event -- `mousemove`.

- `mousedown` event: No changes needed in how we set the `selectionState` and `isSelectingRef`
- `mouseover` event: No changes needed in how we set the `selectionState` to update the selection to currently hovered cell.
- `mousemove` event: Earlier we were not handling this event as to update the selection we only needed to listen to `mouseover` event over cell to update the selection. Now for the autoscroll, we listen to the `mousemove` event as well. When the user starts dragging and moves the mouse around, we check if mouse's current position is near the scrollable container's edges or not. This can be easily determined by `scrollableContainer`'s `getBoundingClientRect` and mouse event's `clientX` and `clientY` properties. If the user is near the edges, we invoke `scrollableContainer.scrollBy` with some appropriate delta. We also perform this check in a `requestAnimationFrame` as the user may not move the mouse once the auto-scroll has started and keep the mouse in that location and would expect the auto-scroll to continue.
- `mouseup` event: We clear the `requestAnimationFrame` in addition to setting `isSelectingRef.current` to `false`.

Here's how we can implement a simple `useAutoScroll` hook:

```tsx
import React, { useRef, useCallback } from 'react'

const SCROLL_DELTA = 10
const VERTICAL_EDGE_THRESHOLD = 60
const HORIZONTAL_EDGE_THRESHOLD = 60

type TickPosition = {
  tickLeft: boolean
  tickRight: boolean
  tickUp: boolean
  tickDown: boolean
}

export type CheckForScroll = (
  event: React.MouseEvent | MouseEvent,
  params?: { skipVerticalScroll: boolean; skipHorizontalScroll: boolean }
) => void

export const useAutoScroll = ({
  scrollableContainerRef,
}: {
  scrollableContainerRef: React.RefObject<HTMLDivElement | null>
}): {
  checkForScroll: CheckForScroll
  clearTicking: () => void
} => {
  const scrollRaf = useRef<number | null>(null)
  const tickPositionRef = useRef<TickPosition | null>(null)

  const startTick = useCallback((): void => {
    const scrollContainer = scrollableContainerRef.current
    if (!scrollContainer) return

    const { tickLeft, tickRight, tickUp, tickDown } =
      tickPositionRef.current ?? {}

    if (tickUp || tickDown) {
      const multiplier = tickUp ? -1 : 1
      scrollContainer.scrollBy({ left: 0, top: multiplier * SCROLL_DELTA })
    }

    if (tickLeft || tickRight) {
      const multiplier = tickLeft ? -1 : 1
      scrollContainer.scrollBy({ left: multiplier * SCROLL_DELTA, top: 0 })
    }

    scrollRaf.current = requestAnimationFrame(startTick)
  }, [scrollableContainerRef])

  const startScrolling = useCallback((): void => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(startTick)
  }, [startTick])

  const clearTicking = useCallback((): void => {
    if (!scrollRaf.current) return
    window.cancelAnimationFrame(scrollRaf.current)
    scrollRaf.current = null
  }, [])

  const checkForScroll: CheckForScroll = useCallback(
    (mouseEvent, params): void => {
      const enableHorizontal = !params?.skipHorizontalScroll
      const enableVertical = !params?.skipVerticalScroll

      const scrollContainer = scrollableContainerRef.current
      if (!scrollContainer) return

      const rect = scrollContainer.getBoundingClientRect()

      const tickLeft =
        mouseEvent.clientX < rect.left + HORIZONTAL_EDGE_THRESHOLD &&
        enableHorizontal
      const tickRight =
        mouseEvent.clientX > rect.right - HORIZONTAL_EDGE_THRESHOLD &&
        enableHorizontal
      const tickUp =
        mouseEvent.clientY < rect.top + VERTICAL_EDGE_THRESHOLD &&
        enableVertical
      const tickDown =
        mouseEvent.clientY > rect.bottom - VERTICAL_EDGE_THRESHOLD &&
        enableVertical

      tickPositionRef.current = {
        tickLeft,
        tickRight,
        tickUp,
        tickDown,
      }

      if (tickLeft || tickRight || tickUp || tickDown) {
        startScrolling()
      } else {
        clearTicking()
      }
    },
    [clearTicking, scrollableContainerRef, startScrolling]
  )

  return { checkForScroll, clearTicking }
}
```

Now we just need to invoke the `useAutoScroll` in our grid component, pass it the `scrollableContainerRef` and pass the returned `checkForScroll` and `clearTicking` methods to the `useBulkCellsSelection` hook and wire them up with `mousemove` and `mouseup` event handlers. Here's how we can achieve that:

```ts
import React, { useState, useRef } from 'react'

import { useAutoScroll } from './hooks/useAutoScroll'
import { useBulkCellsSelection } from './hooks/useBulkCellsSelection'

const GridComponent = () => {
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null)

  const { checkForScroll, clearTicking } = useAutoScroll({
    scrollableContainerRef,
  })

  const { selectionState } = useBulkCellsSelection({
    checkForScroll,
    clearTicking,
  })

  return (
    <div
      ref={scrollableContainerRef}
      style={{ height: 300, overflowY: 'auto', overflowX: 'auto' }}
    >
      <table>{/* Grid or table content */}</table>
    </div>
  )
}
```

And inside `useBulkCellsSelection`, we just have to add another listener for `mousemove` event:

```ts
export const useBulkCellsSelection = ({
  checkForScroll,
  clearTicking,
}: ReturnType<typeof useAutoScroll>) => {
  // existing code for onCellMouseDown and onCellMouseOver...
  useEffect(() => {
    // Handle mouseup event to reset isSelectingRef
    // and also now add cleanup to stop auto-scroll
    const handleMouseUp = () => {
      isSelectingRef.current = false
      clearTicking()
    }

    // Handle mousemove event to see if auto scroll is needed
    const handleMouseMove = (event: MouseEvent) => {
      if (!isSelectingRef.current) return
      checkForScroll(event)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [clearTicking])

  // existing code for selection related callbacks...
}
```

You can play around with the final version in the [codesandbox](https://codesandbox.io/p/devbox/clickable-data-grid-forked-dr5ffr) here

## Acknowledgements

Special thanks to my colleagues: [Aakash Kumar](https://github.com/CodeThatBreak) and [Priyanshu Shrivastav](https://github.com/convict-git) who are the co-maintainer and co-author of the internal table library along with me at Sprinklr. [Aakash Kumar](https://github.com/CodeThatBreak) integrated the auto-scroll capability in the existing table and brought it to production. We also have taken a lot of inspiration from ag-grid in implementing and integrating bulk selection and auto-scroll in our internal table component that is built on top of `react-virtualized` and `react-table`.

## References

1. [Drag'n'Drop with mouse events -- JavaScript Info](https://javascript.info/mouse-drag-and-drop)
2. [`autoScrollService` in ag-grid](https://github.com/ag-grid/ag-grid/blob/latest/packages/ag-grid-community/src/autoScrollService.ts)
