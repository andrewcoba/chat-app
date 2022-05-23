import React from 'react';
import { View, Text, Button, ScrollView, TextInput } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', };
    }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <View>
          <Text>Welcome!</Text>
        </View>

        <View>
          <TextInput
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder='Name?'
          />
        </View>

        <View>
          <Button
            title='Tap to Chat'
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
            />
        </View>
      </View>
      /*<ScrollView>
        <Text style={{fontSize:110}}>This text is so big! And so long! You have to scroll!</Text>
      <ScrollView>*/
    );
  }
}
