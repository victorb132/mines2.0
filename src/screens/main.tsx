import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert
} from "react-native";

import LevelSection from './levelSection';

import Header from '../components/header';
import MineField from '../components/mineField';

import utilParams from '../utils/params';
import {
  cloneBoard,
  createMinedBoard,
  flagsUsed,
  hadExplosion,
  invertFlag,
  openField,
  showMines,
  wonGame,
} from '../utils/logic';

type BoardProps = {
  row: number,
  column: number,
  opened: boolean,
  flagged: boolean,
  mined: boolean,
  exploded: boolean,
  nearMines: number,
}[][]

export function Main() {
  const [board, setBoard] = useState<BoardProps>([]);
  const [won, setWon] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [showLevelSelection, setShowLevelSelection] = useState<boolean>(false);

  function minesAmount(): number {
    const columns: number = utilParams.getColumnsAmount();
    const rows: number = utilParams.getRowsAmount();

    return Math.ceil(columns * rows * utilParams.difficultLevel)
  }

  function createBoard(): void {
    const columns: number = utilParams.getColumnsAmount()
    const rows: number = utilParams.getRowsAmount()

    const minedBoard = createMinedBoard(rows, columns, minesAmount())

    setBoard(minedBoard)
  }

  function resetState() {
    createBoard();
    setWon(false);
    setLost(false);
    setShowLevelSelection(false);
  }

  useEffect(() => {
    createBoard();
  }, [])

  function onOpenField(row: number, column: number): void {
    const boardCloned = cloneBoard(board)

    openField(boardCloned, row, column)

    const lost = hadExplosion(boardCloned)
    const won = wonGame(boardCloned)

    if (lost) {
      showMines(boardCloned)
      Alert.alert('Perdeu', 'Tente novamente!')
    }

    if (won) {
      Alert.alert('Parabéns', 'Você venceu')
    }

    setBoard(boardCloned)
    setLost(lost)
    setWon(won)
  }

  function onSelectField(row: number, column: number) {
    const boardCloned = cloneBoard(board)
    invertFlag(boardCloned, row, column)
    const won = wonGame(boardCloned)

    if (won) {
      Alert.alert('Parabéns', 'Você venceu!')
    }

    setBoard(boardCloned);
    setWon(won)
  }

  function onLevelSelected(level: number) {
    utilParams.difficultLevel = level
    resetState();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <LevelSection
        onCancel={() => setShowLevelSelection(false)}
        isVisible={showLevelSelection}
        onLevelSelected={onLevelSelected}
      />
      <Header
        onFlagPress={() => setShowLevelSelection(true)}
        flagsLeft={minesAmount() - flagsUsed(board)}
        onNewGamePress={resetState}
      />
      <View style={styles.board}>
        <MineField
          board={board}
          onOpenField={onOpenField}
          onSelectField={onSelectField}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
})