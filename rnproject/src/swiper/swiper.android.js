import React, { Component, View, ViewPagerAndroid, Dimensions } from 'react-native';
import STYLE from '../style/swiper';

const KEYBOARD_DISMISS_MODE_NONE = 'none';
const KEYBOARD_DISMISS_MODE_ON_DRAG = 'on-drag';

/**
 *
 */
class Swiper extends Component
{
    constructor () {
        super();

        const { width, height } = Dimensions.get('window');
        this.state = {
            initialPage: 0,
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
     * @param {Object} page
     * @param {Number} index
     * @returns {XML}
     * @private
     */
    _renderPage (page, index) {
        console.log('render page', page);

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
     * Render the Swiper
     * @returns {XML}
     */
    render () {
        return (
            <View
                style={[STYLE.container, { width: this.state.width, height: this.state.height }]}
            >
                <ViewPagerAndroid
                    initialPage={this.state.initialPage}
                    ref="viewPager"
                    keyboardDismissMode={KEYBOARD_DISMISS_MODE_NONE}
                    onPageScroll={this._onPageScroll.bind(this)}
                    onPageScrollStateChanged={this._onPageScrollStateChanged.bind(this)}
                    onPageSelected={this._onPageSelected.bind(this)}
                    style={STYLE.viewPager}
                >
                    {this.props.children.map(this._renderPage.bind(this))}
                </ViewPagerAndroid>
            </View>
        );
    }
}

export default Swiper;
