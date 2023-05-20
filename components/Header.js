import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Header() {
    const navigation = useNavigation();
    const [userEmail, setUserEmail] = useState("");
    const [userObj, setUserObj] = useState({});

    async function getUser() {
        let email = await AsyncStorage.getItem('userEmail');
        setUserEmail(email);
        getUserAPI(email);
    }

    async function getUserAPI(email) {
        try {
            console.log("Recieved email is:", email);
            const response = await axios.post("http://192.168.1.4:3000/users", {
                email: email
            });
            setUserObj(response.data);
            console.log("OBJ:", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const refreshPage = navigation.addListener('focus', () => {
        getUserAPI(userEmail);
        console.log("REFRESHED");
    });

    return (
        <View style={styles.headerView}>
            <Image source={require("../assets/images/BlogIcon.png")} style={styles.logo} />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("Profile", { userObj: userObj, loggedInUser: userObj.userName })}>
                    <MaterialIcons name="person" size={45} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Liked", { emailUser: userEmail, userObj: userObj })}>
                    <MaterialCommunityIcons name="heart" size={45} color="black" />
                </TouchableOpacity>

            </View>
        </View >
    )
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
    }

})