import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Link } from 'expo-router'
import { StrengoContext } from '../global/AppContext.js'

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
  
  /**
   * The useContext hook is used to access the values of the StrengoContext.
   * This allows the use of the template1, template2, and isLoading values.
   */
  const {
    template1,
    template2,
    isLoading,
  } = useContext(StrengoContext);

  /**
   * If the data is still loading, a loading message is displayed. This prevents errors from occurring when the data is not yet fetched.
   */
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    /**
     * The StrengoContext.Provider provides the values to the linked routes.
     */
    <StrengoContext.Provider value={{ template1, template2, isLoading }}>
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
    </StrengoContext.Provider>
  )
}