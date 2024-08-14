import { View } from "react-native"
import Field from "./field"

type BoardProps = {
  row: number,
  column: number,
  opened: boolean,
  flagged: boolean,
  mined: boolean,
  exploded: boolean,
  nearMines: number,
}[][]

type MineFieldProps = {
  onOpenField: (row: number, column: number) => void,
  onSelectField: (row: number, column: number) => void,
  board: BoardProps,
}

export default function MineField({ onOpenField, onSelectField, board }: MineFieldProps) {
  const rows = board.map((rows, row) => {
    const columns = rows.map((field, column) => {
      return <Field
        {...field}
        key={column}
        onOpen={() => onOpenField(row, column)}
        onSelect={() => onSelectField(row, column)}
      />
    })
    return <View key={row} style={{ flexDirection: 'row' }}>{columns}</View>
  })
  return(
    <View style={{ backgroundColor: '#EEE' }}>{rows}</View>
  )
}