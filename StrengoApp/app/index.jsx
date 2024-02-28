import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'
import databaseHelper from '../service/databasehelper.js'

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

  //Github copilot gave me the knowledge to fix my error regarding using async functions in useEffect
  //The previous error was that await functions returned a promise, and useEffect does not support promises/returning anything (except clean up)
  //Now the initiliasing of the db is wrapped in an async function, this async function does not return anything.
  //asyncInitDb is also local to the scope of UseEffect.
  //The [] at the end of useEffect is an empty dependency array, this means that the useEffect will only run once, when the component mounts.
  useEffect(() => {
    async function asyncInitDb() {
      await databaseHelper.initDatabase()
      await databaseHelper.insertWorkout("HELLO???", "Strength")
      databaseHelper.readDb()
    }
    asyncInitDb();
  }, []);

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