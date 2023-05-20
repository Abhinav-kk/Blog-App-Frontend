import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import HeaderBack from '../components/HeaderBack'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
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

function Post(props) {
    const sheetRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);
    const snapPoints = ['70%'];
    var post = props.route.params.postDetails;
    const userEmail = props.route.params.userEmail;
    const userName = props.route.params.userObj.userName;
    const [posts2, setPosts2] = useState({});

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [like, setLike] = useState(false);
    const [ifCurrentUser, setIfCurrentUser] = useState(false);

    const textInputRef = useRef(null);

    const [likedUsers, setLikedUsers] = useState([]);

    const [userObj, setUserObj] = useState({});

    const [modalVisible, setModalVisible] = useState(false);

    function likeModal() {
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
                        <Text style={styles.modalText}>Liked Users</Text>
                        {renderLikedUsers()}
                    </View>
                </View>
            </Modal>
        )
    }

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpened(true);
    }, []);

    const renderLikedUsers = () => {
        function renderItem(item) {
            return (
                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); props.navigation.navigate("Profile", { userObj: item, loggedInUser: userName }); }}>
                    <Text style={styles.likedUserText}>{item.userName}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <FlatList
                data={likedUsers}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={item => item._id}
            />
        )
    }


    function checkUser() {
        console.log("User Name: " + userName);
        console.log("Post User: " + post.userName);
        if (userName == post.userName) {
            setIfCurrentUser(true);
        }
    }

    async function getUserAPI() {
        try {
            console.log("Recieved username is:", post.userName);
            console.log("User Email is:", userEmail);
            const response = await axios.post("http://192.168.1.4:3000/user", {
                userName: post.userName
            });
            setUserObj(response.data);
            console.log("Response", response.status);
            console.log("OBJ:", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function getLikedPosts() {
        console.log(props.route.params.userLikedPosts);
        let userLikedPosts = props.route.params.userLikedPosts;
        try {
            for (let i = 0; i < userLikedPosts.length; i++) {
                if (userLikedPosts[i].postID == post._id) {
                    setLike(true);
                    break;
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function getLikedUsers() {
        try {
            console.log("POST ID", post._id);
            const response = await axios.post(`http://192.168.1.4:3000/post/${post._id}/liked-users`);
            console.log("Liked users array:", response.data);
            setLikedUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function likePostAPI() {
        try {
            console.log(userEmail);
            console.log("Post ID: " + post._id);
            let postID = post._id;
            const response = await axios.post(`http://192.168.1.4:3000/like-posts/${userEmail}`, {
                postID: postID,
            })
            console.log(response.data);
            console.log(response.status);
            console.log("Liked Post!");
        } catch (error) {
            console.log(error);
        }
    }

    async function unlikePostAPI() {
        try {
            console.log("Post ID: " + post._id);
            let postID = post._id;
            const response = await axios.post(`http://192.168.1.4:3000/unlike-posts/${userEmail}`, {
                postID: postID,
            })
            console.log(response.data);
            console.log(response.status);
            console.log("UnLiked Post!");
        } catch (error) {
            console.log(error);
        }
    }

    function handleLike() {
        if (!like) {
            setLike(true);
            likePostAPI();
        } else {
            setLike(false);
            unlikePostAPI();
        }
    }

    function checkLike() {
        console.log("LIKEDREAD:", posts2.likedPostsID);
        let likedPosts = posts2.likedPostsID;
        if (likedPosts) {
            for (let i = 0; i < likedPosts.length; i++) {
                if (likedPosts[i].postID == post._id) {
                    setLike(true);
                    console.log("LIKED");
                }
            }
        }
    }

    useEffect(() => {
        getLikedPosts();
        checkUser();
        getUserAPI();
        getLikedUsers();
    }, []);

    console.log("CURR USER:", ifCurrentUser);

    // useEffect(() => {
    //     checkLike();
    // }, []);


    // const refreshPage = props.navigation.addListener('focus', () => {
    //     getLikedPosts();
    //     checkLike();
    // });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBack />
            {renderPosts()}
            {/* <editPost /> */}
            {isOpened ? editPostSheet() : <></>}
            {likeModal()}
        </SafeAreaView>
    )

    async function deletePostAPI() {
        try {
            console.log("Post ID: " + post._id);
            let postID = post._id;
            const response = await axios.delete(`http://192.168.1.4:3000/post/${postID}`);
            console.log(response.data);
            console.log(response.status);
            console.log("Deleted!");
        } catch (error) {
            console.log(error);
        }
    }

    function handleDelete() {
        console.log("Delete Post");
        deletePostAPI();
        props.navigation.pop();
    };

    async function editPostAPI() {
        try {
            console.log("Post ID: " + post._id);
            let postID = post._id;
            const response = await axios.put(`http://192.168.1.4:3000/post/${postID}`, {
                title: title,
                content: content,
            })
            console.log(response.data);
            console.log(response.status);
            console.log("Updated!");
        } catch (error) {
            console.log(error);
        }
    }

    function handleEdit() {
        console.log("Edit Post");
        editPostAPI();
        props.navigation.pop();
    }

    function editPostSheet() {
        return (
            <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true} onClose={() => setIsOpened(false)}>
                <BottomSheetView style={styles.editPostView}>
                    <Text style={styles.editPostTitle}>Edit Blog Post</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Title"
                            value={title}
                            placeholderTextColor="#003f5c"
                            onChangeText={(val) => setTitle(val)}
                        />
                    </View>
                    <ScrollView style={styles.inputAreaView}>
                        <TextInput
                            ref={textInputRef}
                            style={{ ...styles.ContentTextInput, textAlignVertical: 'top' }}
                            placeholder="Content"
                            value={content}
                            placeholderTextColor="#003f5c"
                            onChangeText={(val) => setContent(val)}
                            multiline={true}
                        />
                    </ScrollView>
                    {savePost()}
                </BottomSheetView>
            </BottomSheet>
        )
    }

    function renderPosts() {
        return (
            <ScrollView style={styles.postTouchable} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}>
                <TouchableWithoutFeedback onPress={() => console.log("Liked Are", likedUsers)}>
                    <Text style={styles.postTitle} onPress={() => { getLikedPosts(); }}>{post.title}</Text>
                </TouchableWithoutFeedback>
                <View style={styles.postUserDetails}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { userObj: userObj, loggedInUser: userName })}>
                        <Text style={styles.postUser}>By {post.userName}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postDate}>{post.createdDate}</Text>
                </View>
                <Text style={styles.postContent}>
                    {post.content}
                </Text>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {ifCurrentUser ?
                            <TouchableOpacity onPress={() => handleSnapPress(0)} style={{ alignContent: 'center', alignSelf: 'center' }}>
                                <MaterialIcons name="edit" size={45} color="black" />
                            </TouchableOpacity>
                            :
                            <></>
                        }
                        <TouchableOpacity onPress={() => handleLike()} style={{ alignContent: 'center', alignSelf: 'center' }}>
                            {like ?
                                <MaterialCommunityIcons name="cards-heart" size={45} color="red" />
                                : <MaterialCommunityIcons name="cards-heart-outline" size={45} color="black" />}
                        </TouchableOpacity>

                        {ifCurrentUser ?
                            <TouchableOpacity onPress={() => handleDelete()} style={{ alignContent: 'center', alignSelf: 'center' }}>
                                <MaterialCommunityIcons name="trash-can" size={45} color="black" />
                            </TouchableOpacity>
                            :
                            <></>
                        }
                    </View>
                    {
                        likedUsers ?
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{ alignSelf: 'center', padding: 10 }}>
                                <Text style={styles.likeCount}>
                                    {likedUsers.length}
                                </Text>
                            </TouchableOpacity>
                            : <></>
                    }
                    {
                        content.length > 500 ?
                            <View style={{ marginBottom: 50 }}>
                            </View>
                            : <></>
                    }

                </View>
            </ScrollView >
        )
    }

    function savePost() {
        return (
            <View style={styles.savePost}>
                <TouchableOpacity onPress={() => handleEdit()}>
                    <MaterialIcons name="save" size={50} color="black" />
                </TouchableOpacity>
            </View >
        )
    }
}

export default Post;

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
        marginBottom: 20,
        paddingBottom: 50,
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
    editPost: {
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
    savePost: {
        paddingTop: 10,
        paddingBottom: 20,
        width: '100%',
        alignItems: 'center',

    },
    editPostView: {
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
    editPostTitle: {
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
        // height: 330,
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
    postContent: {
        fontSize: 18,
        marginVertical: 10,
    },
    likeCount: {
        fontSize: 22,
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
    likedUserText: {
        fontSize: 20,
        padding: 10,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
})