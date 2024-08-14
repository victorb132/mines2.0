type BoardProps = {
  row: number,
  column: number,
  opened: boolean,
  flagged: boolean,
  mined: boolean,
  exploded: boolean,
  nearMines: number,
}[][]

const createBoard = (rows: number, columns: number) => {
  return Array(rows).fill(0).map((_, row) => {
    return Array(columns).fill(0).map((_, column) => {
      return {
        row,
        column,
        opened: false,
        flagged: false,
        mined: false,
        exploded: false,
        nearMines: 0,
      }
    })
  })
}

const spreadMines = (board: BoardProps, minesAmount: number) => {
  const rows: number = board.length
  const columns: number = board[0].length
  let minesPlanted = 0

  while (minesPlanted < minesAmount) {
    const rowSel = parseInt((Math.random() * rows).toString(), 10)
    const columnSel = parseInt((Math.random() * columns).toString(), 10)

    if (!board[rowSel][columnSel].mined) {
      board[rowSel][columnSel].mined = true
      minesPlanted++
    }
  }
}

export const createMinedBoard = (rows: number, columns: number, minesAmount: number) => {
  const board = createBoard(rows, columns)
  spreadMines(board, minesAmount)
  return board
}

export const cloneBoard = (board: BoardProps) => {
  return board.map(rows => {
    return rows.map(field => {
      return { ...field }
    })
  })
}

const getNeighbors = (board: BoardProps, row: number, column: number) => {
  const neighbors: any[] = []
  const rows: number[] = [row - 1, row, row + 1]
  const columns: number[] = [column - 1, column, column + 1]

  rows.forEach(r => {
    columns.forEach(c => {
      const different = r !== row || c !== column
      const validRow = r >= 0 && r < board.length
      const validColumn = c >= 0 && c < board[0].length

      if (different && validRow && validColumn) {
        neighbors.push(board[r][c])
      }
    })
  })
  return neighbors
}

const safeNeighborhood = (board: BoardProps, row: number, column: number) => {
  const safes = (result: any, neighbor: any) => result && !neighbor.mined
  return getNeighbors(board, row, column).reduce(safes, true)
}

export const openField = (board: BoardProps, row: number, column: number) => {
  const field = board[row][column]

  if (!field.opened) {
    field.opened = true

    if (field.mined) {
      field.exploded = true
    } else if (safeNeighborhood(board, row, column)) {
      getNeighbors(board, row, column)
        .forEach(n => openField(board, n.row, n.column))
    } else {
      const negihbors = getNeighbors(board, row, column)

      field.nearMines = negihbors.filter(n => n.mined).length
    }
  }
}

const fields = (board: any) => [].concat(...board)

export const hadExplosion = (board: BoardProps) => fields(board)
  .filter((field: any) => field.exploded).length > 0

const pendding = (field: any) => (field.mined && !field.flagged)
  || (!field.mined && !field.opened)

export const wonGame = (board: BoardProps) => fields(board).filter(pendding).length === 0

export const showMines = (board: BoardProps) => fields(board).filter((field: any) => field.mined)
  .forEach((field: any) => field.opened = true)

export const invertFlag = (board: BoardProps, row: number, column: number) => {
  const field = board[row][column]
  field.flagged = !field.flagged
}

export const flagsUsed = (board: BoardProps) => fields(board)
  .filter((field: any) => field.flagged).length