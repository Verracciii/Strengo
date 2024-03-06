import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import databaseHelper from '../../service/databasehelper'

const styles = StyleSheet.create({
    topBar: {
        position:'relative',
        flexDirection: 'row',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e1e4f5',
        padding: 20,
        width: '100%',
        text: {
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold'
        }
    },
    workoutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 25,
    },
    workoutLog: {

    }
})


const WorkoutRow = (template, templateId) => {
        
        return (
            pass
        )
    }

const Workout = (template, templateId) => {
    
    return (
        pass
    )
}

const WorkoutList = (template, templateId) => {

    return (
        <View style={{
            backgroundColor: 'red',
            width: '100%'
            }}>

            <Text style={styles.workoutTitle}>Workout</Text>

        </View>
    )
}

export default function newWorkout() {

    const { templateId } = useLocalSearchParams()
    console.log("[template] SearchParams template " + templateId)

    const [template, setTemplate] = useState([])

    useEffect(() => {
        async function getTemplate() {
            const tempTemplate = await databaseHelper.readTemplates(
                "SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE templateId = ?", 
                templateId
                )
            setTemplate(tempTemplate)
    }

    getTemplate()

    }, []);

    return (

        <View>
            <View style={styles.topBar}>
                <Text style={styles.topBar.text}>Time elapsed: </Text>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <WorkoutList />
            </ScrollView>
        </View>
    )
}