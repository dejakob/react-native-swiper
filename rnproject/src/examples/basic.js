import React from 'react-native';
import Swiper from './../index';

var {
  StyleSheet,
  Text,
  View,
} = React

var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

var swiper = React.createClass({
  _onMomentumScrollEnd: function (e, state, context) {
    // you can get `state` and `this`(ref to swiper's context) from params
    console.log(state, context.state)
  },
  render: function() {
    return (
      <Swiper style={styles.wrapper}
      onMomentumScrollEnd={this._onMomentumScrollEnd}
      showsButtons={false}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Slide 1</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Slide 2</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>Slide 3</Text>
        </View>
      </Swiper>
    )
  }
})

module.exports = swiper;

