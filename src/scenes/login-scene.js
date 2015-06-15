'use strict';

import React from 'react-native';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import t from 'tcomb-form-native';
import FacebookLoginButton from '../components/facebook-login-button';

const { Form } = t.form;

const Credentials = t.struct({
    email   : t.Str,
    password: t.Str
});

const credentialsOptions = {
    fields: {
        email: {
            autoCapitalize: 'none',
            keyboardType: 'email-address'
        },
        password: {
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
    submitButton: {
        backgroundColor: '#fe5b5f',
        padding: 10
    },
    submitButtonText: {
        color: '#ffffff',
        textAlign: 'center'
    },
    facebookLogin: {
        paddingTop: 10
    },
    facebookLoginTitle: {
        textAlign: 'center',
        padding: 30
    }
});

class LoginScene extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object
    }

    render() {
        return (
            <View style={styles.container}>
                <Form
                    ref="form"
                    type={Credentials}
                    options={credentialsOptions}
                />
                {this.renderSubmitButton()}
                <View style={styles.facebookLogin}>
                    <Text style={styles.facebookLoginTitle}>ou</Text>
                    <FacebookLoginButton />
                </View>
            </View>
        );
    }

    renderSubmitButton() {
        return (
            <TouchableHighlight
                style={styles.submitButton}
                onPress={this._handleSubmit}
                underlayColor='#99d9f4'
            >
                <Text style={styles.submitButtonText}>
                    {this.props.loggingIn ? 'Connexion en cours...' : 'Se connecter'}
                </Text>
            </TouchableHighlight>
        );
    }

    _handleSubmit = () => {
        if (this.props.loggingIn) return;
        var credentials = this.refs.form.getValue();
        if (!credentials) return;
        this.context.flux.actions.auth.submitLoginForm(credentials.email, credentials.password);
    }
}

export default LoginScene;
