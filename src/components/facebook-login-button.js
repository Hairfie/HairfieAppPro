'use strict';

var React = require('react-native');
var { StyleSheet, TouchableHighlight, Text } = React;

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#3b5998',
        padding: 10
    },
    text: {
        color: '#ffffff',
        textAlign: 'center'
    }
});

var FacebookLoginButton = React.createClass({
    contextTypes: {
        flux: React.PropTypes.object
    },
    render() {
        return (
            <TouchableHighlight style={styles.container} onPress={this._handlePress}>
                <Text style={styles.text}>Se connecter via Facebook</Text>
            </TouchableHighlight>
        );
    },
    _handlePress: function () {
        this.context.flux.actions.auth.loginWithFacebook();
    }
});

module.exports = FacebookLoginButton;
