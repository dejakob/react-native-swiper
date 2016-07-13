import React, {Component} from "react";
import {Dimensions, View} from "react-native";
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

class SwiperAbstract extends Component
{
    /**
     * propTypes
     * @returns {Object}
     */
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
            autoPlayTimeout: React.PropTypes.number,
            index: React.PropTypes.number
        }
    }

    /**
     *
     */
    constructor () {
        super();

        const { width, height } = Dimensions.get('window');
        this._autoPlayInterval = null;
        this.state = {
            index: 0,
            paginationDirection: PAGINATION_DIRECTION_HORIZONTAL,
            draggingState: DRAGGING_STATE_IDLE,
            autoPlay: false,
            height,
            width
        };
    }

    /**
     * When the Swiper mounted
     */
    componentDidMount () {
        if (typeof this.props.index === 'number') {
          this.state.index = this.props.index;
        }

        this._updateState(this.props);
    }

    /**
     * When the Swiper mounted
     * @param newProps
     */
    componentWillReceiveProps (newProps) {
        this._updateState(newProps);
    }

    componentWillUnmount () {
        this._stopAutoPlay();
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

    /**
     * Start the autoplay interval
     * @param {Number} timeout
     * @protected
     */
    _startAutoPlay (timeout) {
        if (this._autoPlayInterval === null) {
            this._autoPlayInterval = setInterval(this._onIntervalTick.bind(this), timeout);
        }
    }

    /**
     * Stop the autoplay interval
     * @protected
     */
    _stopAutoPlay () {
        if (this._autoPlayInterval !== null) {
            clearInterval(this._autoPlayInterval);
        }

        this._autoPlayInterval = null;
    }

    /**
     *
     * @param {Object} page
     * @param {Number} index
     * @returns {XML}
     * @protected
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
     * @protected
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
                style={[style, this.props.dotsStyle]}
            >
                {this.props.dotsHeader}
                <View style={navStyle}>
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
     * @protected
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

    render () {
        throw new Error('Cannot render Swiper Abstract, please use implementation');
    }
}

export default SwiperAbstract;
