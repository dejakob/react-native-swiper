import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
    },

    wrapper: {
        backgroundColor: 'transparent',
    },

    slide: {
        backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
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
        fontFamily: 'Arial',
    },

    viewPager: {
        flex: 1
    },

    activeDot: {
        backgroundColor: '#ffffff',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    dot: {
        backgroundColor:'rgba(0,0,0,.2)',
        width: 4,
        height: 4,
        borderRadius: 2,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    }
});