import React, { Dimensions, View, ScrollView } from 'react-native';
import SwiperAbstract from './swiper.abstract';
import STYLE from '../style/swiper';
import {
    KEYBOARD_DISMISS_MODE_NONE,
    KEYBOARD_DISMISS_MODE_ON_DRAG,

    PAGINATION_DIRECTION_HORIZONTAL,
    PAGINATION_DIRECTION_VERTICAL,

    DRAGGING_STATE_IDLE,
    DRAGGING_STATE_DRAGGING,
    DRAGGING_STATE_SETTLING
} from '../config/constants';

/**
 * @Todo vertical iOS swiper
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
            const x = this.state.width * ((this.state.index + 1) % this.props.children.length);

            this.refs.viewPager.scrollTo({ x });
        }
    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageScroll (eventData) {
        const width = this.state.width;
        const index = Math.round(eventData.nativeEvent.contentOffset.x / width);

        if (index !== this.state.index) {
            if (typeof this.props.onPageChange === 'function') {
                this.props.onPageChange(index, this.state.index);
            }
        }

        if (eventData.nativeEvent.contentOffset.x % width === 0) {
            this._onPageSelected(eventData);
            this.setState({ index });
        }
        else {
            this.setState({ index, draggingState: DRAGGING_STATE_DRAGGING });
        }
    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageSelected (eventData) {
        this.setState({
            draggingState: DRAGGING_STATE_IDLE
        });

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
                <ScrollView
                    ref="viewPager"
                    contentContainerStyle={{}}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    pagingEnabled={true}
                    onScroll={this._onPageScroll.bind(this)}
                    scrollEventThrottle={16}
                >
                    {this.props.children.map(this._renderPage.bind(this))}
                </ScrollView>

                {this._renderDots()}
            </View>
        )
    }
}

export default Swiper;