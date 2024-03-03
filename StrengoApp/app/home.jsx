{/* 
Todo:
Create a stylesheet file
Look into routing and understand it better
Look into how to better implement multiple modals
Look into and utilise SQLite
*/}

import { 
    View, 
    Text, 
    StyleSheet, 
    Pressable, 
    Modal,
    Image,
    FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import databaseHelper from '../service/databasehelper.js'

const styles = StyleSheet.create({

        // These are the styles for all of the components in the home screen
        templateContainer: {
                flexDirection: 'row',
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center', 
                backgroundColor: 'red',
                borderColor: 'black',
                borderWidth: 5,
                width: '90%',
                height: '80%',
                marginTop: 150,
                flexWrap: 'wrap',
                gap: 10,
                paddingTop: 10,
        },
        templateBox: {
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start', 
                backgroundColor: 'green',
                borderColor: 'black',
                borderWidth: 5,
                width: '45%',
                height: '25%',
                margin: 1,
        },
        headerText: {
                fontSize: 30,
                textAlign: 'center',
                fontWeight: 'bold'
        },
        templateText: {
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold'
        },
        modalView: {
            display: 'flex',
            marginTop: "5%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "orange",
            borderRadius: 5,
            width: "80%",
            height: "auto",
        },
        pressableBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            width: "133px",
            height: "133px",
        }

})

export default function home() {
    
    // Initialising the modal states
    // This could possibly be done in a better way and needs to be revisited
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [template1, setTemplate1] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  //Prevents data from rendering before data is fetched from the database

    useEffect(() => {
        /**
         * Inserts workout templates into the database and reads all templates.
         * @returns {Promise<void>}
         */
        async function testTemplatesAndRead() {
            //Create template the "pull" template.
            await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 20, 1, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 15, 2, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 1, 0, 10, 3, 1);

            await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 6, 2, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 7, 55, 4, 3, 1);

            await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 6, 2, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 9, 25, 4, 3, 1);

            await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 10, 1, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 8, 2, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 14, 25, 6, 3, 1);

            await databaseHelper.insertWorkoutTemplate(1, "Push", 12, 30, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(1, "Push", 12, 30, 6, 2, 1);

            //The "push" template.
            await databaseHelper.insertWorkoutTemplate(2, "Pull", 4, 12, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(2, "Pull", 4, 12, 6, 2, 1);

            await databaseHelper.insertWorkoutTemplate(2, "Pull", 6, 120, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(2, "Pull", 6, 120, 6, 2, 1);

            await databaseHelper.insertWorkoutTemplate(2, "Pull", 11, 0, 8, 1, 1);
            await databaseHelper.insertWorkoutTemplate(2, "Pull", 11, 0, 6, 2, 1);

            await databaseHelper.readTemplates("SELECT * FROM Templates");

            const tempTemplate1 = await databaseHelper.readTemplates("SELECT * FROM Templates INNER JOIN Workouts ON Templates.workoutId = Workouts.workoutId WHERE Templates.templateId = 1");
            console.log("This is template1" + tempTemplate1);
            setTemplate1(tempTemplate1);
            setIsLoading(false); //Indicates that the data has been fetched from the database
        
    }
    
    testTemplatesAndRead();
}, []);



    return (
        //Use SafeAreaView to avoid the notch on the most new iphones
        <SafeAreaView style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
                }}>

                <View style={styles.templateContainer}>

                    {/* 
                    These are the pressable boxes for the templates. 
                    They are all coupled with their associated modal. 
                    */}
                        
                        <Pressable style={styles.templateBox} onPress={() => setModalVisible1(true)}>
                            {/* 
                            !isLoading only shows the text component once isLoading is false
                            template1 {data from template1}
                            [0]? {the first element in the array, other elements are not needed, only templateName is needed,
                            ? is used to prevent an error if the array is empty}
                            templateName {the name of the template}
                            Will need to reconsider how to do this when there are multiple templates
                             */}
                           {!isLoading && <Text style={styles.templateText}>{template1[0]?.templateName}</Text>}
                            <FlatList
                                data={template1}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>{item.workoutName}</Text>

                                    </View>
                                )}
                                keyExtractor={(item, index) => index}
                            />
                        </Pressable>

                        <Pressable style={styles.templateBox} onPress={() => setModalVisible2(true)}>
                                <Text style={styles.templateText}>Template 2</Text>
                        </Pressable>

                        <Pressable style={styles.templateBox} onPress={() => setModalVisible3(true)}>
                                <Text style={styles.templateText}>Template 3</Text>
                        </Pressable>

                        <Pressable style={styles.templateBox} onPress={() => setModalVisible4(true)}>
                                <Text style={styles.templateText}>Template 4</Text>
                        </Pressable>

                </View>
                    
                    {/*
                    These are the modals for the templates.
                    I need to look into a more efficient and clean way to code this part.
                    For now this is the solution.
                    */}

                    {/*
                    onRequestClose only has effect on Andriod devices.
                    This is to handle the hardware back button.
                    This has no effect on iOS.
                    */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible1}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed."); 
                        setModalVisible1(!modalVisible1);
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.modalView}>

                                <View style={
                                    {
                                        flexDirection: 'row',
                                        gap: 75,
                                        display: "flex",
                                        width: "100%", 
                                        height: "auto", 
                                        marginBottom: "5%", 
                                        marginTop: "5%",
                                        }}>

                                    <Pressable onPress={() => setModalVisible1(false)}>
                                        <Image source={
                                            require("../assets/images/x_icon.png")} 
                                            style={{height: 25, width: 25}}/>
                                    </Pressable>

                                    <Text style={styles.templateText}>{template1[0]?.templateName}</Text>

                                    <Text style={styles.templateText}>Start</Text>
                                    
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible2(!modalVisible2);
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.modalView}>

                                <View style={
                                    {
                                        flexDirection: 'row',
                                        gap: 75,
                                        display: "flex",
                                        width: "100%", 
                                        height: "auto", 
                                        marginBottom: "5%", 
                                        marginTop: "5%",
                                        }}>

                                    <Pressable onPress={() => setModalVisible2(false)}>
                                        <Image source={
                                            require("../assets/images/x_icon.png")} 
                                            style={{height: 25, width: 25}}/>
                                    </Pressable>

                                    <Text style={styles.templateText}>Template 2</Text>

                                    <Text style={styles.templateText}>Start</Text>
                                    
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible3}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible3(!modalVisible3);
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.modalView}>

                                <View style={
                                    {
                                        flexDirection: 'row',
                                        gap: 75,
                                        display: "flex",
                                        width: "100%", 
                                        height: "auto", 
                                        marginBottom: "5%", 
                                        marginTop: "5%",
                                        }}>

                                    <Pressable onPress={() => setModalVisible3(false)}>
                                        <Image source={
                                            require("../assets/images/x_icon.png")} 
                                            style={{height: 25, width: 25}}/>
                                    </Pressable>

                                    <Text style={styles.templateText}>Template 3</Text>

                                    <Text style={styles.templateText}>Start</Text>
                                    
                                </View>

                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible4}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible4(!modalVisible4);
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.modalView}>

                                <View style={
                                    {
                                        flexDirection: 'row',
                                        gap: 75,
                                        display: "flex",
                                        width: "100%", 
                                        height: "auto", 
                                        marginBottom: "5%", 
                                        marginTop: "5%",
                                        }}>

                                    <Pressable onPress={() => setModalVisible4(false)}>
                                        <Image source={
                                            require("../assets/images/x_icon.png")} 
                                            style={{height: 25, width: 25}}/>
                                    </Pressable>

                                    <Text style={styles.templateText}>Template 4</Text>

                                    <Text style={styles.templateText}>Start</Text>
                                    
                                </View>

                            </View>
                        </View>
                    </Modal>
        </SafeAreaView>
    )
}