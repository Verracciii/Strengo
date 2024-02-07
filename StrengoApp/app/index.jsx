import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
//import { databasehHelper } from '../service/databasehelper.js'

//databasehHelper.initDatabase() // Call the initDatabase function

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '50%',
    margin: 100,
  },
  linkText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default function Index() {
  return (
    <View style={styles.container}>

      <View style={styles.linkContainer}>
        <Link push href="/home">
          <Text style={styles.linkText}>Home</Text>
        </Link>
      </View>

      <View style={styles.linkContainer}>
        <Link push href="/trainer">
          <Text style={styles.linkText}>Trainer</Text>
        </Link>
      </View>
      
    </View>
  )
}