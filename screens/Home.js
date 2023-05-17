import { SafeAreaView, StyleSheet, RefreshControl, Text, View, Image, TouchableOpacity, FlatList, TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import Header from '../components/Header'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import moment from 'moment/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    {
        id: 3,
        title: "Exploring the Wonders of Deep-Sea Diving",
        content: "This is my third post",
        user: "John Doe 3",
        date: "12/05/2023",
    },
    {
        id: 4,
        title: "The Art of Home Brewing: A Beginner's Guide",
        content: "This is my fourth post",
        user: "John Doe 4",
        date: "13/05/2023",
    },
]

function Home() {
    const navigation = useNavigation();
    const sheetRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);
    const snapPoints = ['70%'];

    const [posts2, setPosts2] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userEmail, setUserEmail] = useState("");
    const [userObj, setUserObj] = useState({});

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpened(true);
    }, []);

    async function getUser() {
        let email = await AsyncStorage.getItem('userEmail');
        setUserEmail(email);
        getUserAPI(email);
    }

    async function getUserAPI(email) {
        try {
            console.log("Recieved email is:", email);
            const response = await axios.post("http://192.168.1.24:3000/users", {
                email: email
            });
            setUserObj(response.data);
            console.log("OBJ", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // console.log("The logged in user is:", userEmail);
    // console.log("The logged in userobj is:", userObj);

    const handleSubmit = (() => {
        console.log("Submit Post");
        submitPostAPI();
        setIsOpened(false);
        setTitle('');
        setContent('');
        onRefresh();
    });

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getPosts();
        }, 2000);
    }, []);

    async function getPosts() {
        try {
            const response = await axios.get("http://192.168.1.24:3000/posts");
            setPosts2(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser();
        getUserAPI(userEmail);
        getPosts();
    }, []);


    async function submitPostAPI() {
        var date = moment();
        var currentDate = date.format('DD/MM/YYYY');
        const response = await axios.post("http://192.168.1.24:3000/post", {
            title: title,
            content: content,
            userName: userObj.userName,
            createdDate: currentDate,
            email: userEmail
        })
        console.log(response.data);
    }

    const refreshPage = navigation.addListener('focus', () => {
        getPosts();
        getUserAPI(userEmail);
    });


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <Header /> */}
            {Header()}
            {renderPosts()}
            {/* <AddPost /> */}
            {addPost()}
            {isOpened ? addPostSheet() : <></>}
        </SafeAreaView>
    )

    function Header() {
        return (
            <View style={styles.headerView}>
                <TouchableWithoutFeedback onPress={() => getUserAPI(userEmail)}>
                    <Image source={require("../assets/images/BlogIcon.png")} style={styles.logo} />
                </TouchableWithoutFeedback>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("Profile", { userObj: userObj })}>
                        <MaterialIcons name="person" size={45} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Liked", { emailUser: userEmail, userObj: userObj })}>
                        <MaterialCommunityIcons name="heart" size={45} color="black" />
                    </TouchableOpacity>

                </View>
            </View >
        )
    }

    function addPostSheet() {
        return (
            <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpened(false)}>
                <BottomSheetView style={styles.addPostView}>
                    <Text style={styles.addPostTitle}>Add Blog Post</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Title"
                            placeholderTextColor="#003f5c"
                            onChangeText={(val) => setTitle(val)}
                        />
                    </View>
                    <View style={styles.inputAreaView}>
                        <TextInput
                            style={{ ...styles.ContentTextInput, textAlignVertical: 'top' }}
                            placeholder="Content"
                            placeholderTextColor="#003f5c"
                            onChangeText={(val) => setContent(val)}
                            multiline={true}
                            numberOfLines={20}
                        />
                    </View>
                    {submitPost()}
                </BottomSheetView>
            </BottomSheet>
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
                keyExtractor={item => item._id}
                ListHeaderComponent={<Image source={require("../assets/images/BlogTextIcon.png")} style={styles.blogText} />}
                ListFooterComponent={<View style={{ marginBottom: 80 }} ></View>}
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        )
    }

    function addPost() {
        return (
            <View style={styles.addPost}>
                <TouchableOpacity onPress={() => handleSnapPress(0)}>
                    <MaterialIcons name="add-circle" size={45} color="black" />
                </TouchableOpacity>
            </View >
        )
    }

    function submitPost() {
        return (
            <View style={styles.submitPost}>
                <TouchableOpacity onPress={() => handleSubmit()}>
                    <MaterialCommunityIcons name="sticker-plus" size={50} color="black" />
                </TouchableOpacity>
            </View >
        )
    }
}

export default Home;

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
    addPost: {
        position: 'absolute',
        bottom: 0,
        // right: 20,
        backgroundColor: '#FFBBDC',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 10,
        width: '100%',
        alignItems: 'center',

    },
    submitPost: {
        backgroundColor: '#FFBBDC',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
        paddingBottom: 35,
        width: '100%',
        alignItems: 'center',

    },
    addPostView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputAreaView: {
        backgroundColor: "lightgrey",
        borderRadius: 30,
        width: "90%",
        height: 330,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    addPostTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
    nameInput: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
    inputView: {
        backgroundColor: "lightgrey",
        borderRadius: 30,
        width: "90%",
        height: 45,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    // Header
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