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
                    width: '10%',
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

/*
[Github Copilot: 07/03/2024 asked:
"@workspace I have written 3 components (correct me if im wrong), workoutlist, workout, workoutrow. 
They are children of each other respecitvely. My SQL data [template] contains all the info for the template. 
I want to pass this data to the components. 
I want workout list to then iterate over and create a workout for each workout and then workout creates a workoutrow for each set in the data. 
How would I begin the process of this iteration?"

"This is the structure of the data: [ { "templateId": 1, "templateName": "Push", "workoutId": 1, "weight": 0, "reps": 20, "sets": 1, "isDefault": 1, "workoutName": "Push-ups", "type": "Chest" }, { "templateId": 1, "templateName": "Push", "workoutId": 1, "weight": 0, "reps": 15, "sets": 2, "isDefault": 1, "workoutName": "Push-ups", "type": "Chest" }, ... ]"
]
transformData function is from Github Copilot. It will allow me to map() over the array to iterate creating workouts.
*/
function transformData(data) {
    // Group by templateId, then by workoutId
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.templateId]) {
        acc[item.templateId] = {};
      }
      if (!acc[item.templateId][item.workoutId]) {
        acc[item.templateId][item.workoutId] = [];
      }
      acc[item.templateId][item.workoutId].push(item);
      return acc;
    }, {});
  
    // Transform into array of templates, each with an array of workouts, each with an array of sets
    return Object.entries(grouped).map(([templateId, workouts]) => ({
      templateId,
      workouts: Object.entries(workouts).map(([workoutId, sets]) => ({
        workoutId,
        sets,
      })),
    }));
  }

const WorkoutRow = (set, templateId) => {
        
        return (
            <View style={styles.workout.workoutBox.workoutRow}>
                <View style={styles.workout.workoutBox.workoutRow.workoutNo}>
                    <Text style={styles.workout.workoutBox.workoutRow.workoutNo.workoutNoText}>1</Text>
                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    <Text>{set.reps} reps</Text>
                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    <Text>{set.weight} kg</Text>
                </View>
                <View style={styles.workout.workoutBox.workoutRow.workoutFinishButton}>
                </View>

            </View>
        )
    }

const Workout = (workout, templateId, key) => {
    
    console.warn("Workout with params \nworkout: ", workout, " \nkey: ", key);

    return (
        <View>
            <View style={styles.workout.workoutBox.workoutTitleBox}>
                <Text style={styles.workout.workoutBox.workoutTitleBox.workoutTitle}>
                    Squats
                </Text>
            </View>
            {workout.sets.map((set, key) => (
                <workoutRow key={key} set={set} />
            ))}
        </View>
    )
}

const WorkoutList = (template, templateId) => {

    console.log("WorkoutList run with following params: \ntemplate: ", template);
    return (
        <ScrollView style={{
            flexDirection: 'column',
        }}>
            {template && template.workouts && template.workouts.map((workout, index) => (
                <Workout workout={workout} key={index} />
            ))}
            

        </ScrollView>

    )
}

export default function newWorkout() {

    const { templateId } = useLocalSearchParams()

    const [template, setTemplate] = useState([])

    useEffect(() => {
        async function getTemplate() {
            const tempTemplate = await databaseHelper.readTemplates(
                "SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE templateId = ?", 
                templateId
                );
            if (tempTemplate.length === 0) {
                console.warn("No template found with id: ", templateId);
                return;
            }
            setTemplate(transformData(tempTemplate))
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
                    paddingHorizontal: '20%',
                    width:'100%',
                    alignItems: 'center',
                    }}>

                    <Text>Reps</Text>
                    <Text>Sets</Text>
                    
                </View>

            </View>

            <ScrollView contentContainerStyle={{ 
                flexGrow: 1, 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                flexDirection: "column" 
                }}>
                <WorkoutList template={template} templateId={templateId}/>
            </ScrollView>
        </View>
    )
}