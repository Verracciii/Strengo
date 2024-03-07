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
        flexWrap: 'wrap',
        text: {

            color: 'black',
            fontSize: 20,
            fontWeight: 'bold'

        },
    },
    workout: {
        workoutBox: {

            backgroundColor: 'lightgrey',
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
            alignItems: 'center',

            workoutTitleBox: {

                backgroundColor: '#3f51b5',
                flexDirection: 'row',
                width: '100%',

                workoutTitle: {

                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                    paddingLeft: 25,

                },
            },
            workoutRow:{

                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: 15,

                workoutNo: {
                    
                    workoutNoText:{
                        fontSize: 20,
                        fontWeight: 'bold',
                    
                    },
                },
                workoutInput: {

                    backgroundColor: 'grey',
                    width: '10%',
                    height: '95%',

                },
                workoutFinishButton: {

                    backgroundColor: 'green',
                    width: '20%',
                    height: '95%',
                    justifyContent: 'center',
                    alignItems: 'center',

                    workoutFinishButtonText: {

                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 17,

                    },
                },
            }
        }
    }
})


const WorkoutRow = (template, templateId) => {
        
        return (
            <View style={styles.workout.workoutBox.workoutRow}>
                <View style={styles.workout.workoutBox.workoutRow.workoutNo}>
                    <Text style={styles.workout.workoutBox.workoutRow.workoutNo.workoutNoText}>1</Text>
                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>

                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    
                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutFinishButton}>
                    <Text style={styles.workout.workoutBox.workoutRow.workoutFinishButton.workoutFinishButtonText}>Finish</Text>
                </View>

            </View>
        )
    }

const Workout = (template, templateId) => {
    
    return (
        <View>
            <WorkoutRow template={template} templateiD={templateId}/>
        </View>
    )
}

const WorkoutList = (template, templateId) => {

    return (
        <ScrollView style={{
            flexDirection: 'column',
        }}>

            <Workout template={template} templateId={templateId} />

        </ScrollView>

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
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                }}>
                    <Text style={styles.topBar.text}>Time elapsed: </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingLeft: '15%',
                    paddingRight: '30%',
                    width:'100%',
                    alignItems: 'center',
                    }}>
                    <Text>Reps</Text>
                    <Text>Sets</Text>
                </View>

            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: "column" }}>
                <WorkoutList template={template} templateId={templateId}/>
            </ScrollView>
        </View>
    )
}