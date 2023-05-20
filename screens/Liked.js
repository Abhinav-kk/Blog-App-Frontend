import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderBack from '../components/HeaderBack'
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

function Liked(props) {

    const navigation = useNavigation();
    const [posts2, setPosts2] = useState({});
    const [userEmail, setUserEmail] = useState(props.route.params.emailUser);

    const [userObj, setUserObj] = useState(props.route.params.userObj);

    console.log("USER OBJ", props.route.params.userObj);

    console.log("PROPS!!!", props.route.params);
    async function getLikedPosts() {
        try {
            const response = await axios.get(`http://192.168.1.4:3000/liked-posts/${userEmail}`);
            console.log(response.data);
            setPosts2(response.data.postsObjs);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLikedPosts();
    }, []);

    const refreshPage = props.navigation.addListener('focus', () => {
        getLikedPosts();
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBack />
            {renderPosts()}
        </SafeAreaView>
    )

    function renderPosts() {
        function renderItem(item) {
            return (
                <TouchableOpacity style={styles.postTouchable} onPress={() => navigation.navigate("Post", { postDetails: item, userLikedPosts: userObj.likedPosts, userEmail: userObj.email, userObj: userObj })}>
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
                ListHeaderComponent={<Text style={styles.blogText} onPress={getLikedPosts}>Liked Blogs</Text>}
                ListFooterComponent={<View style={{ marginBottom: 80 }} ></View>}
            />
        )
    }
}

export default Liked;

const styles = StyleSheet.create({
    blogText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10
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
        paddingBottom: 20,
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

})