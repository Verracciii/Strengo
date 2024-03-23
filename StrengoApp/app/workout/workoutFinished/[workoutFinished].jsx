import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
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


})

export default function workoutFinished () {
  const { templateId } = useLocalSearchParams(templateId);
  const [workoutData, setWorkoutData] = useState([]);
  console.log('templateId', templateId);

  useEffect(() => {
    console.log('workoutFinished mounted');
    
    console.log('Fetching workout data');

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
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={styles.container}>

        <View style={styles.workoutFinished}>
          <Text style={styles.workoutFinished.text}>Workout Finished</Text>
        </View>

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
    </SafeAreaView>
  )
}