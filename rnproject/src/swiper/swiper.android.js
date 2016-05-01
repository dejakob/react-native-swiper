import React, { Component, View, ViewPagerAndroid } from 'react-native';
import STYLE from '../style/swiper';

const KEYBOARD_DISMISS_MODE_NONE = 'none';
const KEYBOARD_DISMISS_MODE_ON_DRAG = 'on-drag';

/**
 *
 */
class Swiper extends Component
{
    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageScroll (eventData) {

    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageScrollStateChanged (eventData) {

    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageSelected (eventData) {

    }

    /**
     *
     * @returns {XML}
     * @private
     */
    _renderViewPager () {
        return (
            <ViewPagerAndroid
                initialPage={this.state.initialPage}
                keyboardDismissMode={KEYBOARD_DISMISS_MODE_NONE}
                onPageScroll={this._onPageScroll.bind(this)}
                onPageScrollStateChanged={this._onPageScrollStateChanged.bind(this)}
                onPageSelected={this._onPageSelected.bind(this)}
            >
                {this.state.pages}
            </ViewPagerAndroid>
        )
    }

    /**
     * Render the Swiper
     * @returns {XML}
     */
    render () {
        return (
            <View
                style={[STYLE.container, { width: state.width, height: state.height }]}
            >
                {this._renderViewPager()}
            </View>
        );
    }
}

export default Swiper;
