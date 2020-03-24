import React, { Component } from 'react'
import { View, Switch, StyleSheet }

from 'react-native'

export default SwitchExample = (props) => {
   return (
      <View style = {styles.container}>
         <Switch onValueChange = {props.toggleHandle} value = {props.isOn}/>
      </View>
   )
}
const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: "center",
      alignSelf: "flex-end",
      marginRight: 30,
   }
})