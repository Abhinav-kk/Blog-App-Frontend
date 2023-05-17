import { StyleSheet, Text, SafeAreaView, Image, View, TextInput, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup(props) {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function signupAPI() {
        const response = await axios.post("http://192.168.1.24:3000/signup", {
            userName: userName,
            email: email,
            password: password
        })
        console.log(response.data);
        if (response.data.message == "User signed up successfully") {
            await AsyncStorage.setItem("userEmail", email);
            props.navigation.navigate("Home");
        } else if (response.data.message == 'User already exists with that email!') {
            alert("User already exists with that email!");
        } else if (response.data.message == 'User already exists with that username!') {
            alert("User already exists with that username!")
        }
    }

    const handleSignUp = (() => {
        console.log("Signing in");
        signupAPI();
    });

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("../assets/images/BlogLogo.png")} style={styles.logo} />
            <View style={styles.inputView}>
                <View style={styles.iconView}>
                    <MaterialIcons name="person" size={50} color="black" />
                </View>
                <TextInput style={styles.input}
                    placeholder="Username"
                    value={userName}
                    onChangeText={(text) => setUserName(text)}
                />
            </View>
            <View style={styles.inputView}>
                <View style={styles.iconView}>
                    <MaterialIcons name="email" size={50} color="black" />
                </View>
                <TextInput style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address" />
            </View>
            <View style={styles.inputView}>
                <View style={styles.iconView}>
                    <MaterialIcons name="lock" size={50} color="black" />
                </View>
                <TextInput style={styles.input}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    textContentType='password' />
            </View>
            <TouchableOpacity style={styles.signupBtn} onPress={() => handleSignUp()}>
                <Text style={{ fontSize: 24, color: 'white' }}>Sign Up</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <Text style={{ fontSize: 20 }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => props.navigation.pop()}>
                    <Text style={{ fontSize: 20, textDecorationLine: 'underline', color: 'blue' }}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#85AACC',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 250,
        height: 250,
        resizeMode: "contain",
    },
    input: {
        paddingLeft: 60,
        paddingRight: 20,
        height: 61,
        width: 300,
        borderRadius: 20,
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: 'lightgrey',
        textAlign: 'left',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
        zIndex: 0
    },
    inputView: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    iconView: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 5,
        position: 'absolute',
        left: -10,
        top: 0,
        zIndex: 1
    },
    signupBtn: {
        width: 310,
        borderRadius: 30,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#333333",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 10,
    }

})