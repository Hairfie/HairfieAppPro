'use strict';

import React from 'react-native';
import {
    StyleSheet,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import Dimensions from 'Dimensions';

const styles = StyleSheet.create({
    controls: {
        flex: 1,
        backgroundColor: '#222222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    cancelButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#d9534f'
    },
    cancelButtonImage: {
        flex: 1,
        margin: 5,
        tintColor: '#ffffff'
    },
    confirmButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        padding: 10,
        backgroundColor: '#449d44'
    },
    confirmButtonImage: {
        flex: 1,
        margin: 5,
        tintColor: '#ffffff'
    }
});

export default class HairfieImageEditor extends React.Component {

    static propTypes = {
        onConfirm: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            width: Dimensions.get('window').width
        };
    }

    render() {
        return (
            <View style={this.props.style}>
                <Image
                    style={{
                        backgroundColor: '#000000',
                        width: this.state.width,
                        height: this.state.width
                    }}
                    source={{ uri: this.props.image.uri }}
                />
                <View style={styles.controls}>
                    <TouchableHighlight
                        style={styles.cancelButton}
                        onPress={() => this.props.onCancel()}
                        underlayColor="#ca302c"
                    >
                        <Image
                            style={styles.cancelButtonImage}
                            source={require('image!Icon-Cancel')}
                            resizeMode="contain"
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.confirmButton}
                        onPress={() => this.props.onConfirm()}
                        underlayColor="#357935"
                    >
                        <Image
                            style={styles.confirmButtonImage}
                            source={require('image!Icon-Confirm')}
                            resizeMode="contain"
                        />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
