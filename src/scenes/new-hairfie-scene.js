'use strict';

import _ from 'lodash';
import React from 'react-native';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Image
} from 'react-native';

import HairfieCamera from '../components/hairfie-camera';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
        paddingBottom: 50
    },
    kindButton: {
        flex: 1,
        margin: 10,
        backgroundColor: '#cccccc',
        borderRadius: 10,
        justifyContent: 'center'
    },
    kindButtonText: {
        textAlign: 'center'
    }
});

export default class NewHairfieScene extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                {this._renderButton('Simple', () => this._startHairfie(false))}
                {this._renderButton('Avant / Après', () => this._startHairfie(true))}
            </View>
        );
    }

    _renderButton(title, onPress) {
        return (
            <TouchableHighlight style={styles.kindButton} onPress={onPress}>
                <Text style={styles.kindButtonText}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _startHairfie(isBeforeAfter) {
        this.props.navigator.push({
            title: 'Photo',
            component: HairfieCamera,
            passProps: {
                style: {
                    flex: 1,
                    paddingTop: 65,
                    paddingBottom: 50
                }
            }
        });
    }
}
