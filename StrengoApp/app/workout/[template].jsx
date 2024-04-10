import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams} from 'expo-router'
import databaseHelper from '../../service/databasehelper'
import { router } from 'expo-router'

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
                    width: 'auto',
                    height: 'auto',
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
Any mention of map() in relation to rendering the components is from Github Copilot.
*/

/**
 * 
 * Below, are 4 components:
 * WorkoutRow: This component is a row in the workout. It contains the weight, reps, and a finish button.
 * Workout: This component is a workout. It contains the workout name and a list of sets. This also maps over the sets to create a WorkoutRow for each set.
 * WorkoutList: This component is a list of workouts. It contains a list of workouts. This also maps over the workouts to create a Workout for each workout.
 * newWorkout: This component is the main component. It contains the top bar, a ScrollView, and the WorkoutList.
 */
function transformData(data) {
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.workoutId]) {
            acc[item.workoutId] = {
                workoutId: item.workoutId,
                workoutName: item.workoutName,
                sets: []
            };
        }
        acc[item.workoutId].sets.push(item);
        return acc;
    }, {});

    return Object.values(grouped);
}

/**
 * Function for inserting the finished workout into the WorkoutHistory table upon the click of the finish button.
 * It first fetches the exact date and time of the workout and inserts the workout into the WorkoutHistory table.
 */
async function finishWorkout(templateId, weight, reps, set, workoutId) {
    const d = new Date().toDateString();
    await databaseHelper.customQuery("INSERT INTO WorkoutHistory (templateId, date, weight, reps, sets, workoutId) VALUES (?, ?, ?, ?, ?, ?)", templateId, d, weight, reps, set, workoutId)
    await databaseHelper.customQuery("SELECT * FROM WorkoutHistory")
}

const WorkoutRow = (set) => {
    /**
     * Logs the set to the console.
     * This helps with debugging.
     */
    console.log("entering WorkoutRow set: ", set);
    
    /**
     * useState for the reps and weight.
     */
    const [reps, setReps] = useState(set.set.reps)
    const [weight, setWeight] = useState(set.set.weight)

    console.log("reps: ", reps);
    console.log("weight: ", weight);

        return (
            <View style={styles.workout.workoutBox.workoutRow}>
                {/**
                 * View for the set number.
                 */}
                <View style={styles.workout.workoutBox.workoutRow.workoutNo}>
                    <Text style={styles.workout.workoutBox.workoutRow.workoutNo.workoutNoText}>{set.set.sets}</Text>
                </View>

                 {/**
                  * TextInput box for the weight.
                  * Default value is the weight of the set in the templates table.
                  */}
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    <TextInput 
                    returnKeyType='next'
                    textAlign='center'
                    inputMode='numeric'
                    defaultValue={set.set.weight.toString()}
                    onChangeText={(text) => setWeight(text)}
                    />
                </View>

                {/**
                 * TextInput box for the reps.
                 * Default value is the reps of the set in the templates table.
                */}
                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    <TextInput 
                        returnKeyType='next'
                        textAlign='center'
                        inputMode='numeric'
                        defaultValue={set.set.reps.toString()}
                        onChangeText={(text) => setReps(text)}
                        />
                </View>

                {/**
                 * Finish set button
                 * First checks if the reps and weight are empty, meaning that the user has not entered any values.
                 * If the user has not entered any values, the default values are used and passed to the finishWorkout function.
                 * If the user has entered values, those values are passed to the finishWorkout function.
                 * The values are first converted to numbers before being passed to the finishWorkout function.
                 */}
                <TouchableOpacity 
                style={styles.workout.workoutBox.workoutRow.workoutFinishButton}
                onPress={() =>{
                    if (reps === "" && weight === "") {
                        finishWorkout(set.set.templateId, set.set.weight, set.set.reps, set.set.sets, set.set.workoutId)
                    } else {
                        finishWorkout(set.set.templateId, Number(weight), Number(reps), set.set.sets, set.set.workoutId)
                    }
                }}
                >
                    <Image source={require('../../assets/images/checkmark.jpeg')} style={{height: 25, width:25}} />
                </TouchableOpacity>

            </View>
        )
    }

    /**
     * Creates a container for the workout.
     * It then maps over that specific workout and creates a WorkoutRow for each set in the workout.
     */
const Workout = ({ workout }) => {
    console.log("entering Workout workout: ", workout);
    return (
        <View>
            <View style={styles.workout.workoutBox.workoutTitleBox}>
                <Text style={styles.workout.workoutBox.workoutTitleBox.workoutTitle}>
                    {workout.workoutName}
                </Text>
            </View>
            {workout.sets.map((set, key) => (
                <WorkoutRow key={key} set={set} />
            ))}
        </View>
    )
}

/**
 * Container for multiple Workout components.
 * Maps over the template and creates a Workout for each workout in the template
 */
const WorkoutList = ({ template }) => {
    console.log("entering WorkoutList template: ", template);
    return (
        <View style={{
            flexDirection: 'column',
            height: 'auto',
        }}>
            {template && template.map((workout, index) => (
                <Workout workout={workout} key={index} />
            ))}
            

        </View>

    )
}

export default function newWorkout() {

    /**
     * Fetches the templateId from the URL.
     * This is passed from home.jsx to access a dynamic route which changes depending on which template is clicked.
     */
    const { templateId } = useLocalSearchParams()

    const [template, setTemplate] = useState([])

    useEffect(() => {
        /**
         * Async function fetches the template depending on the templateId.
         * This prevents having to pass the template as a prop from home.jsx.
         */
        async function getTemplate() {
            console.log("\nRunning async function getTemplate() in useEffect\n");
            console.log("templateId: ", templateId);

            const tempTemplate = await databaseHelper.readTemplates(
                "SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE templateId = ?", 
                templateId
                );
            if (tempTemplate.length === 0) {
                console.warn("No template found with id: ", templateId);
                return;
            }
            console.log("tempTemplate: ", tempTemplate);
            console.log("template.workouts: ", tempTemplate.workouts);
            setTemplate(transformData(tempTemplate));
    }
    getTemplate();
    }, []);

    return (

        <View style={{ flex:1 }}>
            {/**
             * Top bar for the workout.
             */}
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

                    <Text>Weight</Text>
                    <Text>Reps</Text>
                    
                </View>

            </View>

            {/**
             * Creates a scrollable view of workouts.
             */}
            <ScrollView contentContainerStyle={{
                flexGrow: 1,  
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                flexDirection: "column",
                height: 'auto',
                paddingBottom: 85, 
                }}>
                <WorkoutList template={template} templateId={templateId}/>

                <View style={{
                    width: '100%',
                    height: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    
                    {/**
                     * Appends a finish workout button to the bottom of the screen.
                     * This button navigates to the workoutFinished page upon being clicked.
                     * It passes the templateId as a parameter to the workoutFinished page.
                     */}
                    <TouchableOpacity style={{
                        backgroundColor:'green',
                        height:'75%%',
                        width: '75%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '25'}} 

                        onPress={() => {
                            console.log("templateId in onPress: ", templateId);
                            router.replace({
                                pathname: 'workout/workoutFinished/[workoutFinished]',
                                params: {templateId: templateId}
                            })
                        }}>
                        <View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'white'}}>
                                Finish Workout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}