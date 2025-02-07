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
