import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import * as Data from '../assets/data.json';

export default function test() {
  const data = Data.workouts;
  return (
    <SafeAreaView>

      <Text>Test</Text>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>

            <Text>{item.name}</Text>
            <Text>{item.duration}</Text>
            
          </View>
        )}
        keyExtractor={(item, name) => name}
      />

    </SafeAreaView>
  )
}