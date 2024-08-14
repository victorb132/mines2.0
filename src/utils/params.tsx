import { Dimensions } from "react-native"

const utilParams = {
  blockSize: 30,
  borderSize: 5,
  borderRadius: 30,
  fontSize: 15,
  headerRatio: 0.15,
  difficultLevel: 0.1,

  getColumnsAmount(){
    const width = Dimensions.get('window').width
    return Math.floor(width/ this.blockSize)
  },
  getRowsAmount(){
    const totalHeight = Dimensions.get('window').height
    const boardHeight = totalHeight * (1 - this.headerRatio)
    return Math.floor(boardHeight / this.blockSize)
  },
}

export default utilParams