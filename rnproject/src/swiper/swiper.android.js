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
 * @Todo infinite pages
 */
class Swiper extends Component
{
    static get propTypes () {
        return {
            // onPageChange: newPageIndex, oldPageIndex
            onPageChange: React.PropTypes.func,
            // onPageChangeDone: newPageIndex
            onPageChangeDone: React.PropTypes.func,

            dotsHeader: React.PropTypes.object,
            dotsFooter: React.PropTypes.object,

            // dotsStyle
            dotsStyle: React.PropTypes.object,
            dotStyle: React.PropTypes.object,
            activeDotStyle: React.PropTypes.object,

            autoPlay: React.PropTypes.bool,
            autoPlayTimeout: React.PropTypes.number
        }
    }

    constructor () {
        super();

        const { width, height } = Dimensions.get('window');
        this._autoPlayInterval = null;
        this.state = {
            index: 0,
            paginationDirection: PAGINATION_DIRECTION_HORIZONTAL,
            draggingState: DRAGGING_STATE_IDLE,
            autoPlay: false,
            width,
            height
        };

    }

    /**
     *
     */
    componentDidMount () {
        this._updateState(this.props);
    }

    /**
     *
     * @param newProps
     */
    componentWillReceiveProps (newProps) {
        this._updateState(newProps);
    }

    /**
     *
     * @param props
     * @private
     */
    _updateState (props) {
        let newState = {};

        if (typeof props.width === 'number') {
            newState.width = props.width;
        }

        if (typeof props.height === 'number') {
            newState.height = props.height;
        }

        if (typeof props.autoPlay === 'boolean') {
            newState.autoPlay = props.autoPlay;

            if (props.autoPlay === true) {
                this._startAutoPlay(this.props.autoPlayTimeout || 2000);
            }
            else {
                this._stopAutoPlay();
            }
        }

        this.setState(newState);
    }

    _startAutoPlay (timeout) {
        if (this._autoPlayInterval === null) {
            this._autoPlayInterval = setInterval(() => {
                if (this.state.draggingState !== DRAGGING_STATE_DRAGGING) {
                    this.refs.viewPager.setPage((this.state.index + 1) % this.props.children.length);
                }
            }, timeout);
        }
    }

    _stopAutoPlay () {
        if (this._autoPlayInterval !== null) {
            clearInterval(this._autoPlayInterval);
        }

        this._autoPlayInterval = null;
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

    /**
     *
     * @returns {XML}
     * @private
     */
    _renderDots () {
        const style = {
            position: 'absolute',
            bottom: 25,
            left: 0,
            right: 0,
            backgroundColor: 'transparent'
        };

        let navStyle = {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
        };

        if (this.state.paginationDirection === PAGINATION_DIRECTION_VERTICAL) {
            style.flexDirection = 'column'
        }

        return (
            <View
                style={style}
            >
                {this.props.dotsHeader}
                <View style={this.props.dotsStyle || navStyle}>
                    {this.props.children.map(this._renderDot.bind(this))}
                </View>
                {this.props.dotsFooter}
            </View>
        );
    }

    /**
     *
     * @param page
     * @param index
     * @returns {XML}
     * @private
     */
    _renderDot (page, index) {
        if (this.state.index === index) {
            return (
                <View
                    key={index}
                    style={this.props.activeDotStyle || STYLE.activeDot}
                />
            );
        }

        return (
            <View
                key={index}
                style={this.props.dotStyle || STYLE.dot}
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
