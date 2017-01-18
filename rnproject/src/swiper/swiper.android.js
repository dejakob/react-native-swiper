import React from "react";
import {View, ViewPagerAndroid, Dimensions} from "react-native";
import SwiperAbstract from './swiper.abstract';
import {
    KEYBOARD_DISMISS_MODE_NONE,
    KEYBOARD_DISMISS_MODE_ON_DRAG,

    PAGINATION_DIRECTION_HORIZONTAL,
    PAGINATION_DIRECTION_VERTICAL,

    DRAGGING_STATE_IDLE,
    DRAGGING_STATE_DRAGGING,
    DRAGGING_STATE_SETTLING
} from '../config/constants';
import STYLE from '../style/swiper';

/**
 * @Todo vertical android swiper
 * @source http://stackoverflow.com/questions/13477820/android-vertical-viewpager
 * @Todo infinite pages
 * @extends SwiperAbstract
 */
class Swiper extends SwiperAbstract
{
    /**
     *
     * @private
     */
    _onIntervalTick () {
        if (this.state.draggingState !== DRAGGING_STATE_DRAGGING) {
          this._setPage(this.state.index + 1)
        }
    }

    _setPage(index) {
        this.viewPager.setPage((index) % this.sizeOfChildren);
    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageScroll (eventData) {
        const newIndex = eventData.nativeEvent.position +
            Math.round(eventData.nativeEvent.offset);
        this.setState({ index: newIndex });

        if (newIndex !== this.state.index) {
            if (typeof this.props.onPageChange === 'function') {
                this.props.onPageChange(newIndex, this.state.index);
            }
        }
    }

    /**
     *
     * @param {String} state
     * @private
     */
    _onPageScrollStateChanged (state) {
        this.setState({
            draggingState: state
        });
    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageSelected (eventData) {
        if (typeof this.props.onPageChangeDone === 'function') {
            this.props.onPageChangeDone(this.state.index);
        }
    }

    /**
     * Render the Swiper
     * @returns {XML}
     */
    render () {
        return (
            <View
                style={[STYLE.container, { width: this.state.width, height: this.state.height }]}
            >
                <ViewPagerAndroid
                    initialPage={this.state.defaultIndex || this.state.index}
                    ref={(ref) => {this.viewPager = ref}}
                    keyboardDismissMode={KEYBOARD_DISMISS_MODE_NONE}
                    onPageScroll={this._onPageScroll.bind(this)}
                    onPageScrollStateChanged={this._onPageScrollStateChanged.bind(this)}
                    onPageSelected={this._onPageSelected.bind(this)}
                    style={STYLE.viewPager}
                >
                    {this.props.children.map(this._renderPage.bind(this))}
                </ViewPagerAndroid>

                {this._renderDots()}
            </View>
        );

    }
}

export default Swiper;
