import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import HeaderBackExit from '../components/HeaderBackExit'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';

const posts = [
    {
        id: 1,
        title: "10 Essential Tips for Beginner Photographers",
        content: "This is my first post",
        user: "John Doe 1",
        date: "10/05/2023",
    },
    {
        id: 2,
        title: "The Benefits of Yoga for Mind and Body",
        content: "This is my second post",
        user: "John Doe 2",
        date: "11/05/2023",
    },
]

function Profile(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [posts2, setPosts2] = useState({});
    const loggedInUser = props.route.params.loggedInUser;
    const userObj = props.route.params.userObj;
    const userEmail = props.route.params.userObj.email;
    const [userName, setUserName] = useState(props.route.params.userObj.userName);
    const likedPostsCount = props.route.params.userObj.likedPosts.length;
    const [newUserName, setNewUserName] = useState(userName);

    const [ifCurrentUser, setIfCurrentUser] = useState(false);


    async function getPosts() {
        try {
            console.log(props.route.params);
            const response = await axios.get(`http://192.168.1.4:3000/${userEmail}/posts`);
            console.log(response.data);
            setPosts2(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function checkUser() {
        console.log("PROPPY:", props.route.params);
        console.log("User Name: " + loggedInUser);
        console.log("Post User: " + userName);
        if (userName == loggedInUser) {
            setIfCurrentUser(true);
        }
    }


    useEffect(() => {
        getPosts();
        checkUser();
    }, []);

    const refreshPage = navigation.addListener('focus', () => {
        getPosts();
    });

    async function editUsernameAPI() {
        try {
            let userID = userObj._id;
            const response = await axios.put(`http://192.168.1.4:3000/user/${userID}`, {
                userName: newUserName
            })
            console.log(response.data);
            console.log(response.status);
            console.log("Updated!");
            if (response.data.success == true) {
                setModalVisible(!modalVisible);
                setUserName(newUserName);
                getPosts();
            } else {
                alert("Username already exists!");
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function editPostUsernameAPI() {
        try {
            console.log("OLD USERNAME", userName);
            console.log("NEW USERNAME", newUserName);
            const response = await axios.put(`http://192.168.1.4:3000/posts/update-usernames`, {
                oldUsername: userName,
                newUsername: newUserName
            })
            console.log(response.data);
            console.log(response.status);
            console.log("Updated!");
        } catch (error) {
            console.log(error);
        }
    }

    function handleEditUsername() {
        console.log("Edit Username");
        editUsernameAPI();
        editPostUsernameAPI();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBackExit />
            {profileDetails()}
            <Image source={require("../assets/images/BlogTextIcon.png")} style={styles.blogText} />
            {renderPosts()}
            {editModal()}
        </SafeAreaView>
    )

    function editModal() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Edit UserName</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                value={newUserName}
                                placeholder="Title"
                                placeholderTextColor="#003f5c"
                                onChangeText={(val) => setNewUserName(val)}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleEditUsername()}>
                            <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    function profileDetails() {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between', marginVertical: 20 }}>
                <Image source={require("../assets/images/BlogIcon.png")} style={styles.profileIcon} />
                <View style={{ width: 220 }}>
                    <View style={{ flexDirection: 'row', alignSelf: "center" }}>
                        <Text style={styles.profileName}>{userName}</Text>
                        {
                            ifCurrentUser ?
                                <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(!modalVisible)}>
                                    <MaterialIcons name="edit" size={28} color="white" />
                                </TouchableOpacity>
                                : <></>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <View style={styles.counterElement}>
                            <Text style={styles.blogCount}>{posts2.length}</Text>
                            <Text style={styles.countTitle}>Blogs</Text>
                        </View>
                        <View style={styles.counterElement}>
                            <Text style={styles.blogCount}>{likedPostsCount}</Text>
                            <Text style={styles.countTitle}>Liked</Text>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    function renderPosts() {
        function renderItem(item) {
            return (
                <TouchableOpacity style={styles.postTouchable} onPress={() => navigation.navigate("Post", { postDetails: item, userEmail: userObj.email, userLikedPosts: userObj.likedPosts, userObj: userObj })}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <View style={styles.postUserDetails}>
                        <Text style={styles.postUser}>By {item.userName}</Text>
                        <Text style={styles.postDate}>{item.createdDate}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        return (
            <FlatList
                data={posts2}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={item => item._id.toString()}
                ListFooterComponent={<View style={{ marginBottom: 80 }} ></View>}
            />
        )
    }
}

export default Profile;

const styles = StyleSheet.create({
    blogText: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        alignSelf: 'center',
        margin: -20
    },
    postTouchable: {
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 30,
        backgroundColor: '#F4FBFD',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgrey',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 10,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    postUserDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postUser: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    postDate: {
        fontSize: 15,
        fontWeight: 'light',
        color: 'grey',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10
    },
    editButton: {
        backgroundColor: '#000',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'lightgrey',
        padding: 5,
        marginHorizontal: 10,
        alignContent: 'center',
        alignSelf: 'center',
    },
    blogCount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center'
    },
    countTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    counterElement: {
        marginHorizontal: 20
    },
    profileIcon: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        alignSelf: 'center',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'black'
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
        marginHorizontal: 10,
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
    }
})