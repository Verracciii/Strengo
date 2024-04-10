import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import databaseHelper from '../service/databasehelper';

/**
 * 
 * The history function is used to display the history of the user's workouts.
 */
export default function history() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    /**
     * Asynchronously fetches the history of the user's workouts from the database.
     */
    async function fetchHistory() {
      const history = await databaseHelper.readOperatingValues("SELECT WorkoutHistory.*, Workouts.workoutName FROM WorkoutHistory INNER JOIN Workouts ON WorkoutHistory.workoutId = Workouts.workoutId");
      setHistory(history);
    }

    fetchHistory();
    console.log(history);
  }, []);

  return (
    <View>
      {/**
       * For every item in the history array, distinguished by its item.id, text with the workout name, template id, and date is displayed.
       */}
      <FlatList
        data={history}
        renderItem={({ item }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.workoutName} </Text>
              <Text>Template: {item.templateId}</Text>
              <Text> || {item.date}</Text>
            </View>
          )
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}