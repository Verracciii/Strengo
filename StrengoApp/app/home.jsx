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
    FlatList, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Link, router } from 'expo-router'
import { StrengoContext } from '../global/AppContext.js'
import databaseHelper from '../service/databasehelper.js'

const styles = StyleSheet.create({

        // These are the styles for all of the components in the home screen
        templateContainer: {
                flexDirection: 'row',
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center', 
                backgroundColor: '#d6d6d4',
                borderColor: 'black',
                borderWidth: 5,
                width: '90%',
                height: 'auto',
                marginTop: 150,
                flexWrap: 'wrap',
                gap: 10,
                padding: 10,
                borderRadius: 25
        },
        templateBox: {
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'flex-start', 
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 2,
                width: '45%',
                height: 'auto',
                maxHeight: 175,
                margin: 1,
                borderRadius: 25,
                paddingBottom: 11,
                padding: 10
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
            backgroundColor: "grey",
            borderRadius: 5,
            width: "80%",
            height: "auto",
            paddingHorizontal: 20,
        },
        pressableBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            width: "133px",
            height: "133px",
        },
        historyButton: {
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 10,
            backgroundColor: 'white',
            padding: 10,
            paddingHorizontal: 20,
        },
        exerciseText: {
            fontSize: 12,
            color: '#1f96ff'
        },


})

export default function home() {
    
    // Initialising the modal states
    // This could possibly be done in a better way and needs to be revisited
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const {
        template1,
        setTemplate1,
        template2,
        setTemplate2,
        isLoading,
        setIsLoading,
      } = useContext(StrengoContext);
    
      if (isLoading) {
        return <Text>Loading...</Text>;
      }

    return (
        <StrengoContext.Provider value={{ template1, template2, isLoading }}>
            {/*Use SafeAreaView to avoid the notch on the most new iphone*/}
            <SafeAreaView style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                    }}>

                        <Link href='history' asChild>
                            <TouchableOpacity>
                                <View style={styles.historyButton}>
                                    <Text style={{fontWeight:'bold'}}>History</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>

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
                            {template2 ? (
                                <FlatList
                                    data={template1}
                                    renderItem={({ item }) => (
                                        <View>
                                            <Text style={styles.exerciseText}>{item.workoutName}</Text>

                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index}
                                />
                            ) : (
                                <Text>Loading...</Text>
                            )}
                            </Pressable>

                            <Pressable style={styles.templateBox} onPress={() => setModalVisible2(true)}>
                                    {!isLoading && <Text style={styles.templateText}>{template2[0]?.templateName}</Text>}
                                {template2 ? (
                                    <FlatList
                                        data={template2}
                                        renderItem={({ item }) => (
                                            <View>
                                                <Text style={styles.exerciseText    }>{item.workoutName}</Text>

                                            </View>
                                        )}
                                        keyExtractor={(item, index) => index}
                                    />
                                ) : (
                                    <Text>Loading...</Text>
                                )}
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

                                            
                                        <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible1(false);
                                            router.push({
                                                pathname: '/workout/[template]',
                                                params: { templateId: 1 }
                                            });
                                        }}>

                                            <Text style={styles.templateText}>Start</Text>

                                        </TouchableOpacity>
                                        
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

                                        <Text style={styles.templateText}>{template2[0]?.templateName}</Text>

                                        <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible2(false);
                                            router.push({
                                                pathname: '/workout/[template]',
                                                params: { templateId: 2 }
                                            });
                                        }}>

                                            <Text style={styles.templateText}>Start</Text>

                                        </TouchableOpacity>
                                        
                                    </View>

                                </View>
                            </View>
                        </Modal>
            </SafeAreaView>
        </StrengoContext.Provider>
    )
}