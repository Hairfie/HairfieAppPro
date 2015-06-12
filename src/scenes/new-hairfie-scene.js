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
import HairfieImageEditor from '../components/hairfie-image-editor';
import HairfieBusinessMemberScene from './hairfie-business-member-scene';
import TagsPicker from '../components/tags-picker';
import HairfieInfos from '../components/hairfie-infos';

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

class TakePicture extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            image: null
        };
    }

    render() {
        if (this.state.image) {
            return (
                <HairfieImageEditor
                    style={this.props.style}
                    image={this.state.image}
                    onConfirm={() => this.props.onImage(this.state.image)}
                    onCancel={() => this.setState({ image: null }) }
                />
            );
        }

        return (
            <HairfieCamera
                style={this.props.style}
                onImage={(image) => this.setState({ image })}
            />
        );
    }
}

export default class NewHairfieScene extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderButton('Simple', () => this._takePictures(false))}
                {this._renderButton('Avant / Après', () => this._takePictures(true))}
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

    _takePictures(isBeforeAfter) {
        var hairfie = {
            businessId: this.props.businessId
        };

        if (isBeforeAfter) {
            this._takePicture('Photo "avant"', (beforeImage) => {
                this._takePicture('Photo "après"', (afterImage) => {
                    hairfie.images = [beforeImage, afterImage];
                    this._chooseHairdresser(hairfie);
                });
            });
        } else {
            this._takePicture('Photo', (image) => {
                hairfie.image = [image];
                this._chooseHairdresser(hairfie);
            });
        }
    }

    _takePicture(title, onImage) {
        this.props.navigator.push({
            title,
            component: TakePicture,
            passProps: {
                style: {
                    flex: 1,
                    paddingTop: 65,
                    paddingBottom: 50
                },
                onImage: onImage
            }
        });
    }

    _chooseHairdresser(hairfie) {
        this.props.navigator.push({
            title: 'Qui a réalisé la coupe ?',
            component: HairfieBusinessMemberScene,
            rightButtonTitle: 'Passer',
            onRightButtonPress: () => {
                hairfie.businessMemberId = null;
                this._chooseTags(hairfie);
            },
            passProps: {
                businessId: this.props.businessId,
                onSelect: (businessMember) => {
                    hairfie.businessMemberId = businessMember.id;
                    this._chooseTags(hairfie);
                }
            }
        });
    }

    _chooseTags(hairfie) {
        this.props.navigator.push({
            title: 'Taggez votre Hairfie',
            component: TagsPicker,
            rightButtonTitle: 'Continuer',
            onRightButtonPress: () => {
                this._enterInfos(hairfie);
            },
            passProps: {
                style: { flex: 1, marginTop: 65, marginBottom: 50 },
                automaticallyAdjustContentInsets: false,
                businessId: this.props.businessId,
                onChange: (tags) => {
                    hairfie.tags = tags;
                }
            }
        });
    }

    _enterInfos(hairfie) {
        this.props.navigator.push({
            title: 'Dernières informations',
            component: HairfieInfos,
            rightButtonTitle: 'Valider',
            onRightButtonPress: () => {
                this.context.flux.actions.hairfie.submit(hairfie);
                this.props.navigator.popToTop();
            },
            passProps: {
                values: {
                    price: hairfie.price,
                    customerEmail: hairfie.customerEmail
                },
                onChange: (data) => {
                    hairfie.price = data.price;
                    hairfie.customerEmail = data.customerEmail;
                }
            }
        });
    }
}
