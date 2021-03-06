import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  KeyboardAvoidingView
} from 'react-native';

import BackgroundImage from '../assets/BackgroundImage.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: this.colors.blue,
    };
  }

    changeBgColor = (newColor) => {
      this.setState({ bgColor: newColor });
    };

    colors = {
      darkblue: '#0e1a40',
      blue: '#222f5b',
      gray: '#5d5d5d',
      gold: '#946b2d',
      black: '#000000'
    };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.backgroundImage}
        >
        <View style={styles.titleBox}>
          <Text style={styles.title}>Chat App</Text>
        </View>

        <View style={styles.box1}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.name}
              placeholder='Name?'
            />
        </View>

        <View style={styles.colorBox}>
          <Text style={styles.chooseColor}>
            {''}
            Choose background color{''}
          </Text>
        </View>

        <View style={styles.colorArray}>
          <TouchableOpacity
            style={styles.color1}
            onPress={() => this.changeBgColor(this.colors.darkblue)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.color2}
            onPress={() => this.changeBgColor(this.colors.blue)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.color3}
            onPress={() => this.changeBgColor(this.colors.gray)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.color4}
            onPress={() => this.changeBgColor(this.colors.gold)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.color5}
            onPress={() => this.changeBgColor(this.colors.black)}
          ></TouchableOpacity>
        </View>

          <Pressable
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Chat', {
              name: this.state.name,
              bgColor: this.state.bgColor,
              })
            }
          >
            <Text style={styles.buttonText}>Begin Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      { Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='height' /> : null}
      </View>
    )
  }
}

// styles the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',

  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  titleBox: {
    height: '40%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 50,
  },

  title: {
    fontSize: 45,
    fontWeight: '100',
    color: '#ffffff',
    fontFamily: 'Verdana',
  },

  box1: {
    backgroundColor: 'white',
    height: '40%',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: '20%',

  },

  inputBox: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: 'gray',
    width: '85%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  input: {
    fontSize: 15,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
  },

  colorBox: {
    marginRight: 'auto',
    paddingLeft: 15,
    width: '85%',
  },

  chooseColor: {
    fontSize: 20,
    fontWeight: '400',
    marginTop: 20,
    marginLeft: 20,
    textAlign: 'center'
  },

  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  color1: {
    backgroundColor: '#0e1a40',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },

  color2: {
    backgroundColor: '#222f5b',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 30,
  },


  color3: {
    backgroundColor: '#5d5d5d',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 30,
  },

  color4: {
    backgroundColor: '#946b2d',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 30,
  },

  color5: {
    backgroundColor: '#000000',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },

  button: {
    width: '50%',
    height: 50,
    borderRadius: 8,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
