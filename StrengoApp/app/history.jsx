import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import databaseHelper from '../service/databasehelper';

export default function history() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            const history = await databaseHelper.readOperatingValues("SELECT WorkoutHistory.*, Workouts.workoutName FROM WorkoutHistory INNER JOIN Workouts ON WorkoutHistory.workoutId = Workouts.workoutId");
            setHistory(history);
        }

        fetchHistory();
        console.log(history);
    }, []);

  return (
    <View>
      <FlatList
      data={history}
      renderItem={({ item }) => {
        return (
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>{item.workoutName} </Text>
            <Text>Template: {item.templateId}</Text>
            <Text> || {item.date}</Text>
          </View>
        )}
      }
      keyExtractor={item => item.id}
      />
    </View>
  )
}