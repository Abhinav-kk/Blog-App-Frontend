import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HeaderBack() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.headerView}>
            <Image source={require("../assets/images/BlogIcon.png")} style={styles.logo} />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <MaterialIcons name="arrow-back-ios" size={45} color="black" />
                </TouchableOpacity>
            </View>
            {editModal()}
        </View >
    )

    function editModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Do you want to logout?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={() => { setModalVisible(!modalVisible); navigation.navigate("Login") }}>
                                <Text style={styles.textStyle2}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>No</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    headerView: {
        marginTop: 20,
        paddingHorizontal: 25,
        height: 70,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'black'
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain"
    },
    modalView: {
        margin: 20,
        width: "80%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'black',
        borderWidth: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    TextInput: {
        height: 50,
        padding: 10,
        marginLeft: 20,
        fontSize: 18,
    },
    ContentTextInput: {
        height: 330,
        padding: 10,
        marginLeft: 20,
        fontSize: 18,
    },
    inputView: {
        backgroundColor: "lightgrey",
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginVertical: 15,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgrey',
        paddingHorizontal: 30,
        borderRadius: 20,
        paddingVertical: 10,
        marginLeft: 20,
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button2: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgrey',
        paddingHorizontal: 30,
        borderRadius: 20,
        paddingVertical: 10,
        marginRight: 20,
        alignContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    textStyle2: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    }

})