import {
  ColorValue,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native'

import utilParams from "../utils/params"
import Flag from './flag'
import Mine from './mine'

type FieldProps = {
  mined: boolean,
  opened: boolean,
  nearMines: number,
  exploded: boolean,
  flagged: boolean,
  onOpen: () => void,
  onSelect: () => void,
}

export default function Field({
  mined,
  opened,
  nearMines,
  exploded,
  flagged,
  onOpen,
  onSelect
}: FieldProps) {
  const styleField: any[] = [styles.field]

  if (opened) styleField.push(styles.opened)
  if (exploded) styleField.push(styles.exploded)
  if (flagged) styleField.push(styles.regular)
  if (!opened && !exploded) styleField.push(styles.regular)

  let color: ColorValue = '#000';

  if (nearMines > 0) {
    if (nearMines == 1) color = '#2A28D7'
    if (nearMines == 2) color = '#2B520F'
    if (nearMines > 2 && nearMines < 6) color = '#F9060A'
    if (nearMines >= 6) color = '#F221A9'
  }

  return(
    <TouchableWithoutFeedback onPress={onOpen}
    onLongPress={onSelect}>
    <View style={styleField}>
      {!mined && opened && nearMines > 0 ?
        <Text style={[styles.label, { color: color }]}>
          {nearMines}</Text> : false}
      {mined && opened ? <Mine /> : false}
      {flagged && !opened ? <Flag bigger={false} /> : false}
    </View>
  </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  field: {
      height: utilParams.blockSize,
      width: utilParams.blockSize,
      borderWidth: utilParams.borderSize,
      borderRadius: utilParams.borderRadius
  },
  regular: {
      backgroundColor: '#999',
      borderLeftColor: '#333',
      borderTopColor: '#333',
      borderRightColor: '#333',
      borderBottomColor: '#333'
  },
  opened: {
      backgroundColor: '#fff',
      borderColor: '#777',
      alignItems: 'center',
      justifyContent: 'center',
  },
  label: {
      fontWeight: 'bold',
      fontSize: utilParams.fontSize,
  },
  exploded: {
      backgroundColor: 'red',
      borderColor: 'red'
  }
})