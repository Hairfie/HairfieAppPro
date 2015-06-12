'use strict';

import React from 'react-native';
import {
    CameraRoll,
    StyleSheet,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    Image,
    AlertIOS
} from 'react-native';
import Dimensions from 'Dimensions';
import Camera from 'react-native-camera';
import { ImagePickerManager, HairfieImageManager } from 'NativeModules';

const styles = StyleSheet.create({
    cameraTypeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 20,
        width: 70,
        height: 70,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    cameraTypeButtonIcon: {
        width: 30,
        height: 30,
        tintColor: '#ffffff'
    },
    controls: {
        flex: 1,
        backgroundColor: '#222222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    pickerButton: {
        width: 50,
        height: 50,
        margin: 25
    },
    pickerButtonImage: {
        flex: 1,
        borderRadius: 5,
        width: 50,
        height: 50,
        backgroundColor: '#999999'
    },
    captureButton: {
        width: 80,
        height: 80,
        margin: 10,
        borderRadius: 40,
        backgroundColor:  '#fe5b5f'
    },
    captureButtonImage: {
        flex: 1,
        margin: 20,
        tintColor: '#ffc0c2'
    },
    rightButton: {
        width: 80,
        height: 80,
        margin: 10,
        backgroundColor: 'rgba(0,0,0,0)'
    }
});

export default class HairfieCamera extends React.Component {

    static propTypes = {
        onImage: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            cameraWidth: Dimensions.get('window').width,
            cameraType: Camera.constants.Type.back,
            cameraRollImage: null
        };
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: 1,
            groupTypes: 'All'
        }, (r) => {
            const edge = _.first(r.edges);
            if (edge) {
                this.setState({ cameraRollImage: edge.node.image });
            }
        }, (e) => {
            console.log('failed to get camera roll photos:', e.stack || e);
        });
    }

    render() {
        return (
            <View {...this.props}>
                <Camera
                    ref="camera"
                    style={{
                        backgroundColor: '#000000',
                        height: this.state.cameraWidth
                    }}
                    aspect="fill"
                    type={this.state.cameraType}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                >
                    <View style={styles.cameraTypeButton}>
                        <TouchableOpacity onPress={this._switchCameraType}>
                            <Image
                                style={styles.cameraTypeButtonIcon}
                                source={require('image!Icon-Rotate')}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </Camera>
                <View style={styles.controls}>
                    <TouchableHighlight
                        style={styles.pickerButton}
                        onPress={this._openCameraRollPicker}
                    >
                        <Image
                            style={styles.pickerButtonImage}
                            source={this.state.cameraRollImage}
                            resizeMode="cover"
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.captureButton}
                        onPress={this._capture}
                        underlayColor="#fe393e"
                    >
                        <Image
                            style={styles.captureButtonImage}
                            source={require('image!Icon-Camera')}
                            resizeMode="contain"
                        />
                    </TouchableHighlight>
                    <View style={styles.rightButton} />
                </View>
            </View>
        );
    }

    _switchCameraType = () => {
        const cameraType = this.state.cameraType === Camera.constants.Type.back ?
            Camera.constants.Type.front :
            Camera.constants.Type.back;

        this.setState({ cameraType });
    }

    _capture = () => {
        if (this.state.capturing) {
            return;
        }

        this.setState({ capturing: true });

        this.refs.camera.capture((err, uri) => {
            if (err) {
                console.log('failed to capture', err);
                this.setState({ capturing: false });
                return;
            }

            HairfieImageManager.moveCapturedImage(uri, (err, image) => {
                if (err) {
                    console.log('failed to move captured image', err);
                    return;
                } else {
                    this.props.onImage(image);
                    this.setState({ capturing: false });
                }
            });
        });
    }

    _openCameraRollPicker = () => {
        ImagePickerManager.presentImagePicker((image) => {
            if (image) {
                if (image.width < 640 || image.height < 640) {
                    AlertIOS.alert(
                        'Image trop petite',
                        'L\image doit faire au moins 640 pixels de haut et 640 pixels de large'
                    );
                }

                HairfieImageManager.createScaledCopyOfImage(image.uri, (err, image) => {
                    if (err) {
                        console.log('failed to create scaled copy', err);
                        return;
                    }

                    this.props.onImage(image);
                });
            }
        });
    }
}
