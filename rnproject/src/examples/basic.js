import React from 'react-native';
import AndroidSwiper from '../swiper/swiper.android';

console.log('android swiper', AndroidSwiper);

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
  render: function() {
    return (
      <AndroidSwiper
          style={styles.wrapper}
          showsButtons={false}
          autoPlay={true}
          autoPlayTimeout={5000}
      >
          {[
              <View style={styles.slide1} key="0">
                  <Text style={styles.text}>Slide 1</Text>
              </View>,
              <View style={styles.slide2} key="1">
              <Text style={styles.text}>Slide 2</Text>
              </View>,
              <View style={styles.slide3} key="2">
              <Text style={styles.text}>Slide 3</Text>
              </View>
          ]}
      </AndroidSwiper>
    )
  }
})

module.exports = swiper;

