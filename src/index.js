/**
 * react-native-swiper
 * Original creator:
 * @author leecade<leecade@163.com>
 * Also edited by:
 * @author dejakob
 */
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ViewPagerAndroid,
  Platform
} from 'react-native';

console.log('index');

const STYLE = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative'
    },

    wrapper: {
        backgroundColor: 'transparent'
    },

    slide: {
        backgroundColor: 'transparent'
    },

    pagination_x: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent'
    },

    pagination_y: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent'
    },

    title: {
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        paddingLeft: 10,
        bottom: -30,
        left: 0,
        flexWrap: 'nowrap',
        width: 250,
        backgroundColor: 'transparent'
    },

    buttonWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 50,
        color: '#007aff',
        fontFamily: 'Arial'
    },

    dot: {
        backgroundColor:'rgba(0,0,0,.2)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },

    activeDot: {
        backgroundColor: '#007aff',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    }
});


// Using bare setTimeout, setInterval, setImmediate
// and requestAnimationFrame calls is very dangerous
// because if you forget to cancel the request before
// the component is unmounted, you risk the callback
// throwing an exception.
import TimerMixin from 'react-timer-mixin'

let { width, height } = Dimensions.get('window');
let _autoplayTimer = null;

/**
 * Swiper Component
 */
class Swiper extends Component {

    /**
     * Props Validation
     * @type {Object}
     */
    static get propTypes () {
        return {
            horizontal: React.PropTypes.bool,
            children: React.PropTypes.node.isRequired,
            style: View.propTypes.style,
            pagingEnabled: React.PropTypes.bool,
            showsHorizontalScrollIndicator: React.PropTypes.bool,
            showsVerticalScrollIndicator: React.PropTypes.bool,
            bounces: React.PropTypes.bool,
            scrollsToTop: React.PropTypes.bool,
            removeClippedSubviews: React.PropTypes.bool,
            automaticallyAdjustContentInsets: React.PropTypes.bool,
            showsPagination: React.PropTypes.bool,
            showsButtons: React.PropTypes.bool,
            loop: React.PropTypes.bool,
            autoplay: React.PropTypes.bool,
            autoplayTimeout: React.PropTypes.number,
            autoplayDirection: React.PropTypes.bool,
            index: React.PropTypes.number,
            renderPagination: React.PropTypes.func
        };
    };

    /**
     * Mixins
     * @returns {Object}
     */
    static get mixins () {
        return [ TimerMixin ];
    }

    /**
     * @returns {Number}
     */
    get autoplayTimer () {
        return _autoplayTimer;
    }

    /**
     * @param {Number} val
     */
    set autoplayTimer (val) {
        _autoplayTimer = val;
    }

    /**
     *
     */
    constructor () {
        super();

        /**
         * Default props
         * @return {object} props
         * @see http://facebook.github.io/react-native/docs/scrollview.html
         */
        this.props = {
            horizontal: true,
            pagingEnabled: true,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            bounces: false,
            scrollsToTop: false,
            removeClippedSubviews: true,
            automaticallyAdjustContentInsets: false,
            showsPagination: true,
            showsButtons: false,
            loop: true,
            autoplay: false,
            autoplayTimeout: 2.5,
            autoplayDirection: true,
            index: 0
        };

        // Set initial state
        this.state = this._initState(this.props);
    }

    componentWillMount () {
        this.props = this._injectState(this.props);
    }

    componentWillReceiveProps (props) {
        this.setState(this._initState(props));
    }

    componentDidMount () {
        this._autoplay()
    }

    _initState (props) {
        let initState = {
            isScrolling: false,
            autoplayEnd: false,
        }

        initState.total = props.children ? props.children.length || 1 : 0
        initState.index = initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0

        // Default: horizontal
        initState.dir = props.horizontal == false ? 'y' : 'x'
        initState.width = props.width || width
        initState.height = props.height || height
        initState.offset = {}

        if (initState.total > 1) {
            var setup = props.loop ? 1 : initState.index
            initState.offset[initState.dir] = initState.dir == 'y'
                ? initState.height * setup
                : initState.width * setup
        }
        return initState
    }

    /**
     * Automatic rolling
     */
    _autoplay () {
        if(!Array.isArray(this.props.children)
            || !this.props.autoplay
            || this.state.isScrolling
            || this.state.autoplayEnd) return

        clearTimeout(this.autoplayTimer)

        this.autoplayTimer = this.setTimeout(() => {
            if(!this.props.loop && (this.props.autoplayDirection
                    ? this.state.index == this.state.total - 1
                    : this.state.index == 0)) return this.setState({
                autoplayEnd: true
            })
            this._scrollTo(this.props.autoplayDirection ? 1 : -1)
        }, this.props.autoplayTimeout * 1000)
    }

    /**
     * Scroll begin handle
     * @param  {object} e native event
     */
    _onScrollBegin (e) {
        // update scroll state
        this.setState({
            isScrolling: true
        });

        this.setTimeout(() => {
            this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.state, this)
        })
    }

    /**
     * Scroll end handle
     * @param  {object} e native event
     */
    _onScrollEnd (e) {

        // update scroll state
        this.setState({
            isScrolling: false
        });

        // making our events coming from android compatible to updateIndex logic
        if (!e.nativeEvent.contentOffset) {
            if (this.state.dir == 'x') {
                e.nativeEvent.contentOffset = {x: e.nativeEvent.position * this.state.width}
            } else {
                e.nativeEvent.contentOffset = {y: e.nativeEvent.position * this.state.height}
            }
        }

        this._updateIndex(e.nativeEvent.contentOffset, this.state.dir);

        // Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
        // in setTimeout to ensure synchronous update `index`
        this.setTimeout(() => {
            this._autoplay()

            // if `onMomentumScrollEnd` registered will be called here
            this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.state, this)
        })
    }

    /**
     * Update index after scroll
     * @param  {object} offset content offset
     * @param  {string} dir    'x' || 'y'
     */
    _updateIndex (offset, dir) {

        let state = this.state
        let index = state.index
        let diff = offset[dir] - state.offset[dir]
        let step = dir == 'x' ? state.width : state.height

        // Do nothing if offset no change.
        if(!diff) return

        // Note: if touch very very quickly and continuous,
        // the variation of `index` more than 1.
        index = index + diff / step

        if(this.props.loop) {
            if(index <= -1) {
                index = state.total - 1
                offset[dir] = step * state.total
            }
            else if(index >= state.total) {
                index = 0
                offset[dir] = step
            }
        }

        this.setState({
            index: index,
            offset: offset,
        })
    }

    /**
     * Scroll by index
     * @param  {number} index offset index
     */
    _scrollTo (index) {
        if (this.state.isScrolling || this.state.total < 2) return
        let state = this.state
        let diff = (this.props.loop ? 1 : 0) + index + this.state.index
        let x = 0
        let y = 0
        if(state.dir == 'x') x = diff * state.width
        if(state.dir == 'y') y = diff * state.height
        this.refs.scrollView && this.refs.scrollView._scrollTo(y, x)

        // update scroll state
        this.setState({
            isScrolling: true,
            autoplayEnd: false,
        })
    }

    /**
     * Render pagination
     * @return {object} react-dom
     */
    _renderPagination () {

        // By default, dots only show when `total` > 2
        if(this.state.total <= 1) return null

        let dots = [];
        let ActiveDot = this.props.activeDot ||
            <View style={STYLE.activeDot} />;
        let Dot = this.props.dot ||
            <View style={STYLE.dot} />;

        console.log('IINDEEEXX', this.state.index);

        for(let i = 0; i < this.state.total; i++) {
            dots.push(i === this.state.index
                ?
                React.cloneElement(ActiveDot, {key: i})
                :
                React.cloneElement(Dot, {key: i})
            )
        }

        return (
            <View pointerEvents='none' style={[STYLE['pagination_' + this.state.dir], this.props.paginationStyle]}>
                {dots}
            </View>
        )
    }

    /**
     *
     * @returns {XML}
     */
    _renderTitle () {
        let child = this.props.children[this.state.index]
        let title = child && child.props.title
        return title
            ? (
            <View style={STYLE.title}>
                {this.props.children[this.state.index].props.title}
            </View>
        )
            : null;
    }

    /**
     *
     * @returns {XML}
     */
    _renderNextButton () {
        let button;

        if (this.props.loop || this.state.index != this.state.total - 1) {
            button = this.props.nextButton || <Text style={STYLE.buttonText}>›</Text>
        }

        return (
            <TouchableOpacity onPress={() => button !== null && this._scrollTo.call(this, 1)}>
                <View>
                    {button}
                </View>
            </TouchableOpacity>
        )
    }

    /**
     *
     * @returns {XML}
     * @private
     */
    _renderPrevButton () {
        let button = null;

        if (this.props.loop || this.state.index != 0) {
            button = this.props.prevButton || <Text style={STYLE.buttonText}>‹</Text>
        }

        return (
            <TouchableOpacity onPress={() => button !== null && this._scrollTo.call(this, -1)}>
                <View>
                    {button}
                </View>
            </TouchableOpacity>
        )
    }

    /**
     *
     * @returns {XML}
     * @private
     */
    _renderButtons () {
        return (
            <View pointerEvents='box-none' style={[STYLE.buttonWrapper, {width: this.state.width, height: this.state.height}, this.props.buttonWrapperStyle]}>
                {this._renderPrevButton()}
                {this._renderNextButton()}
            </View>
        )
    }

    /**
     *
     * @param pages
     * @returns {XML}
     * @private
     */
    _renderScrollView (pages) {
        if (Platform.OS === 'ios')
            return (
                <ScrollView ref="scrollView"
                    {...this.props}
                            contentContainerStyle={[STYLE.wrapper, this.props.style]}
                            contentOffset={this.state.offset}
                            onScrollBeginDrag={this._onScrollBegin}
                            onMomentumScrollEnd={this._onScrollEnd}>
                    {pages}
                </ScrollView>
            );
        return (
            <ViewPagerAndroid ref="scrollView"
                              onPageSelected={this._onScrollEnd}
                              style={{flex: 1}}>
                {pages}
            </ViewPagerAndroid>
        );
    }

    /**
     * Inject state to ScrollResponder
     * @param  {object} props origin props
     * @return {object} props injected props
     */
    _injectState (props) {
        /*    const scrollResponders = [
         'onMomentumScrollBegin',
         'onTouchStartCapture',
         'onTouchStart',
         'onTouchEnd',
         'onResponderRelease',
         ]*/

        for(let prop in props) {
            // if(~scrollResponders.indexOf(prop)
            if(typeof props[prop] === 'function'
                && prop !== 'onMomentumScrollEnd'
                && prop !== 'renderPagination'
                && prop !== 'onScrollBeginDrag'
            ) {
                let originResponder = props[prop]
                props[prop] = (e) => originResponder(e, this.state, this)
            }
        }

        return props
    }

    /**
     * Default render
     * @return {object} react-dom
     */
    render () {
        console.log('render');

        let state = this.state
        let props = this.props
        let children = props.children
        let index = state.index
        let total = state.total
        let loop = props.loop
        let dir = state.dir
        let key = 0

        let pages = []
        let pageStyle = [{width: state.width, height: state.height}, STYLE.slide]

        // For make infinite at least total > 1
        if(total > 1) {

            // Re-design a loop model for avoid img flickering
            pages = Object.keys(children)
            if(loop) {
                pages.unshift(total - 1)
                pages.push(0)
            }

            pages = pages.map((page, i) =>
                <View style={pageStyle} key={i}>{children[page]}</View>
            )
        }
        else pages = <View style={pageStyle}>{children}</View>

        return (
            <View style={[STYLE.container, {
        width: state.width,
        height: state.height
      }]}>
                {this._renderScrollView(pages)}
                {props.showsPagination && (props._renderPagination
                    ? this.props._renderPagination(state.index, state.total, this)
                    : this._renderPagination())}
                {this._renderTitle()}
                {this.props.showsButtons && this._renderButtons()}
            </View>
        )
    }
}

export default Swiper;
