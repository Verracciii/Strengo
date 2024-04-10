import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import databaseHelper from '../../../service/databasehelper'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'black',
    width: '75%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
  },

  workoutFinished: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,

    text: {
      fontSize: 20,
      fontWeight: 'bold',
    }
  },

  workoutName: {
    fontSize: 15
  },

  doneButton: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

})

export default function workoutFinished () {

  /**
   * Fetches the dynamic URL parameters from the URL.
   * The templateId is used to fetch the workout data from the database.
   */
  const { templateId } = useLocalSearchParams(templateId);
  const [workoutData, setWorkoutData] = useState([]);
  console.log('templateId', templateId);

  useEffect(() => {
    console.log('workoutFinished mounted');
    
    console.log('Fetching workout data');

    /**
     * Asynchronously fetches the finished sets of a workout from the WorkoutHistory table.
     */
    async function getWorkoutData(templateId) {
      const workoutData = await databaseHelper.customQuery('SELECT WorkoutHistory.*, Workouts.workoutName FROM WorkoutHistory INNER JOIN Workouts ON WorkoutHistory.workoutId = Workouts.workoutId WHERE WorkoutHistory.templateId = ?', Number(templateId));
      setWorkoutData(workoutData);
      console.log(typeof workoutData);
    }
    getWorkoutData(templateId);

    

  }, [])

  return (
    <SafeAreaView style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>

      

      <View style={styles.container}>

        <View style={styles.workoutFinished}>
          <Text style={styles.workoutFinished.text}>Workout Finished</Text>
        </View>

          {/**
           * Maps over the workout data and displays the workout name.
           */}
          <FlatList 
          data={workoutData}
          renderItem={({ item }) => {
            return (
              <View style={{padding: 5}}>
                <Text style={styles.workoutName}>{item.workoutName}</Text>
              </View>
            )}}
            keyExtractor={item => item.id}
            scrollEnabled={false} />
      
      </View>

      <Link href='/home' asChild>
        <TouchableOpacity>
          <View style={styles.doneButton}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>Done</Text>
          </View>
        </TouchableOpacity>
      </Link>

    </SafeAreaView>
  )
}