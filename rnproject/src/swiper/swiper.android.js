import React, { Component, View, ViewPagerAndroid, Text, Dimensions } from 'react-native';
import STYLE from '../style/swiper';

const KEYBOARD_DISMISS_MODE_NONE = 'none';
const KEYBOARD_DISMISS_MODE_ON_DRAG = 'on-drag';

const PAGINATION_DIRECTION_HORIZONTAL = 'x';
const PAGINATION_DIRECTION_VERTICAL = 'y';

const DRAGGING_STATE_IDLE = 'idle';
const DRAGGING_STATE_DRAGGING = 'dragging';
const DRAGGING_STATE_SETTLING = 'setting';

/**
 * @Todo vertical android swiper
 * @source http://stackoverflow.com/questions/13477820/android-vertical-viewpager
 */
class Swiper extends Component
{
    constructor () {
        super();

        const { width, height } = Dimensions.get('window');
        this.state = {
            index: 0,
            paginationDirection: PAGINATION_DIRECTION_HORIZONTAL,
            draggingState: DRAGGING_STATE_IDLE,
            width,
            height
        };

    }

    componentDidMount () {
        this._updateState(this.props);
    }

    componentWillReceiveProps (newProps) {
        this._updateState(newProps);
    }

    _updateState (props) {
        let newState = {};

        if (typeof props.width === 'number') {
            newState.width = props.width;
        }

        if (typeof props.height === 'number') {
            newState.height = props.height;
        }

        this.setState(newState);
    }

    /**
     *
     * @param {Object} eventData
     * @private
     */
    _onPageScroll (eventData) {
        // console.log('page scroll', eventData);
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
        console.log('page selected', eventData);
    }

    /**
     *
     * @param {Object} page
     * @param {Number} index
     * @returns {XML}
     * @private
     */
    _renderPage (page, index) {
        const pageStyle = [{ width: this.state.width, height: this.state.height }, STYLE.slide];

        return (
            <View
                collapsable={false}
                style={pageStyle}
                key={index}
            >
                {page}
            </View>
        );
    }

    _renderDots () {
        let style = {
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'transparent'
        };

        if (this.state.paginationDirection === PAGINATION_DIRECTION_VERTICAL) {
            style = {
                position: 'absolute',
                right: 15,
                top: 0,
                bottom: 0,
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:'transparent'
            };
        }

        return (
            <View
                pointerEvents="none"
                style={style}
            >
                {this.props.children.map(this._renderDot.bind(this))}
            </View>
        );
    }

    _renderDot (page, index) {
        if (this.state.index === index) {
            return (
                <View
                    key={index}
                    style={STYLE.activeDot}
                />
            );
        }

        return (
            <View
                key={index}
                style={STYLE.dot}
            />
        );
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
                    initialPage={this.state.index}
                    ref="viewPager"
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
