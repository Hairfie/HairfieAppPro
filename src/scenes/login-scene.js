'use strict';

import React from 'react-native';
import {
    Component,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image
} from 'react-native';
import t from 'tcomb-form-native';

const { Form } = t.form;

const Credentials = t.struct({
    email   : t.Str,
    password: t.Str
});

const credentialsOptions = {
    auto: 'placeholders',
    fields: {
        email: {
            autoCapitalize: 'none',
            keyboardType: 'email-address'
        },
        password: {
            placeholder: 'Mot de passe',
            password: true
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        padding: 10
    },
    logo: {
        height: 50,
        margin: 20
    },
    submitButton: {
        backgroundColor: '#fe5b5f',
        padding: 10
    },
    submitButtonText: {
        color: '#ffffff',
        textAlign: 'center'
    },
    facebookLogin: {
        paddingTop: 10,
        borderRadius: 5
    },
    facebookLoginTitle: {
        textAlign: 'center',
        padding: 20
    },
    facebookLoginButton: {
        backgroundColor: '#3b5998',
        padding: 10
    },
    facebookLoginButtonText: {
        color: '#ffffff',
        textAlign: 'center'
    }
});

class LoginScene extends Component {

    static contextTypes = {
        flux: React.PropTypes.object
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require('image!LoginLogo')}
                />
                <Form
                    ref="form"
                    type={Credentials}
                    options={credentialsOptions}
                />
                <TouchableHighlight
                    style={styles.submitButton}
                    onPress={this._handleSubmit}
                    underlayColor='#99d9f4'
                >
                    <Text style={styles.submitButtonText}>
                        {this.props.loggingIn ? 'Connexion en cours...' : 'Se connecter'}
                    </Text>
                </TouchableHighlight>
                <View style={styles.facebookLogin}>
                    <Text style={styles.facebookLoginTitle}>
                        ou
                    </Text>
                    <TouchableHighlight
                        style={styles.facebookLoginButton}
                        onPress={this._handleFacebookLoginPress}
                    >
                        <Text style={styles.facebookLoginButtonText}>
                            Se connecter via Facebook
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    _handleSubmit = () => {
        if (this.props.loggingIn) return;
        var credentials = this.refs.form.getValue();
        if (!credentials) return;
        this.context.flux.actions.auth.submitLoginForm(credentials.email, credentials.password);
    }

    _handleFacebookLoginPress = () => {
        this.context.flux.actions.auth.loginWithFacebook();
    }
}

export default LoginScene;
