import React from "react";
import { GiftedChat, Bubble, InputToolbar, SystemMessage, Day } from "react-native-gifted-chat";

// Import the functions you need from the SDKs you need
import firebase from 'firebase'
import 'firebase/firestore'
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';


import {
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy-h3k9l1PCfqnzLe3IluT5F9Lz8qkQGQ",
  authDomain: "chat-app-72494.firebaseapp.com",
  projectId: "chat-app-72494",
  storageBucket: "chat-app-72494.appspot.com",
  messagingSenderId: "1044212206610",
  appId: "1:1044212206610:web:d42b9d42fd2155ebf79ccb",
  measurementId: "G-NL636T5LWK"
};


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.refMsgsUser = null;
  }

  // get messages from AsyncStorage
async getMessages() {
    let messages = '';
    try {
        messages = await AsyncStorage.getItem('messages') || [];
        this.setState({
            messages: JSON.parse(messages)
        });
    } catch (error) {
        console.log(error.message);
    }
};

// save messages to AsyncStorage
async saveMessages() {
    try {
        await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
        console.log(error.message);
    }
};

async deleteMessages() {
    try {
        await AsyncStorage.removeItem('messages');
        this.setState({
            messages: []
        })
    } catch (error) {
        console.log(error.message);
    }
};

  componentDidMount() {

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages');

    // checks if the user is online
    NetInfo.fetch().then(connection => {
           if (connection.isConnected) {
               this.setState({ isConnected: true });
               console.log('online');

               // listens for updates in the collection
               this.unsubscribe = this.referenceChatMessages
               .orderBy('createdAt', 'desc')
               .onSnapshot(this.onCollectionUpdate);

               // listens to authentication
               this.authUnsubscribe = firebase
               .auth()
               .onAuthStateChanged(async user => {
               if (!user) {
                   return await firebase.auth().signInAnonymously();
               }
               this.setState({
                   uid: user.uid,
                   messages: [],
                   user: {
                       _id: user.uid,
                       name: name,
                       avatar: 'https://placeimg.com/140/140/any',
                   },
               });
               // referencing messages of current user
               this.refMsgsUser = firebase
                   .firestore()
                   .collection('messages')
                   .where('uid', '==', this.state.uid);
               });
               // save messages when user online
               this.saveMessages();
           } else {
               // if the user is offline
               this.setState({ isConnected: false });
               console.log('offline');
               // retrieve messages from AsyncStorage
               this.getMessages();
           }
       });


   }

  componentWillUnmount() {
    // stop listening for changes
    this.unsubcribe();
    // stop listening to authentication
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages
    });
    this.saveMessages();
  };

  addMessages() {
    const message = this.state.messages[0];
    //adds new message to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text:  message.text || '',
      user: this.state.user,
      image: message.image || '',
      location: message.location || null,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: 'white'
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return  (
      <SystemMessage
        {...props} textStyle={{ color: '#fff' }} />
    );
  }

  renderDay(props) {
    return (
      <Day
        {...props}
          textStyle={{
              color: '#fff',
              backgroundColor: 'gray',
              borderRadius: 15,
              padding: 10,
          }}
      />
    );
  }

  renderInputToolbar(props) {
     if (this.state.isConnected == false) {
     } else {
         return (
             <InputToolbar
                 {...props}
             />
         );
     }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // returns a mapview when user adds a location to current message
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {

    const { bgColor } = this.props.route.params;

    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView}
          renderSystemMessage={this.renderSystemMessage}
          renderUsernameOnMessage={true}
          renderDay={this.renderDay}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
