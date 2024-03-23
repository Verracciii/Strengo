import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
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

async function finishWorkout(templateId, weight, reps, set, workoutId) {
    const d = new Date().toDateString();
    await databaseHelper.customQuery("INSERT INTO WorkoutHistory (templateId, date, weight, reps, sets, workoutId) VALUES (?, ?, ?, ?, ?, ?)", templateId, d, weight, reps, set, workoutId)
    await databaseHelper.customQuery("SELECT * FROM WorkoutHistory")
}

const WorkoutRow = (set, templateId) => {
    console.log("entering WorkoutRow set: ", set);
        
    const [reps, setReps] = useState(set.set.reps)
    const [weight, setWeight] = useState(set.set.weight)

    console.log("reps: ", reps);
    console.log("weight: ", weight);

        return (
            <View style={styles.workout.workoutBox.workoutRow}>
                <View style={styles.workout.workoutBox.workoutRow.workoutNo}>
                    <Text style={styles.workout.workoutBox.workoutRow.workoutNo.workoutNoText}>{set.set.sets}</Text>
                </View>

                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                    <TextInput 
                    returnKeyType='next'
                    textAlign='center'
                    inputMode='numeric'
                    defaultValue={set.set.weight.toString()}
                    onChangeText={(text) => setWeight(text)}
                    />
                </View>

                <View style={styles.workout.workoutBox.workoutRow.workoutInput}>
                <TextInput 
                    returnKeyType='next'
                    textAlign='center'
                    inputMode='numeric'
                    defaultValue={set.set.reps.toString()}
                    onChangeText={(text) => setReps(text)}
                    />
                </View>

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

const WorkoutList = ({ template }) => {
    console.log("entering WorkoutList template: ", template);
    console.log("template.workouts: ", template.workouts);
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

    const { templateId } = useLocalSearchParams()

    const [template, setTemplate] = useState([])

    useEffect(() => {
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