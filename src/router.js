'use strict';

var React = require('react-native');
var { StyleSheet, Text, NavigatorIOS } = React;
var connectToStores = require('./utils/connectToStores');

var LoginScene = require('./scenes/login-scene');
var ChooseBusinessScene = require('./scenes/choose-business-scene');
var BookingsScene = require('./scenes/bookings-scene');

var Router = React.createClass({
    render() {
        var { loggedIn, businessId } = this.props;

        if (!loggedIn) {
            return (
                <NavigatorIOS
                    key="login"
                    style={styles.container}
                    initialRoute={{
                        component: LoginScene,
                        title: 'Connexion'
                    }}
                />
            );
        }

        if (!businessId) {
            return (
                <NavigatorIOS
                    key="chooseBusiness"
                    style={styles.container}
                    initialRoute={{
                        component: ChooseBusinessScene,
                        title: 'Mes activités'
                    }}
                />
            );
        }

        return (
            <NavigatorIOS
                key="bookings"
                style={styles.container}
                initialRoute={{
                    title: 'Réservations à confirmer',
                    backButtonTitle: 'Retour',
                    component: BookingsScene,
                    passProps: { businessId }
                }}
            />
        );
    }
});

Router = connectToStores(Router, ['AuthStore'], ({ AuthStore }) => ({
    loggedIn    : AuthStore.isLoggedIn(),
    businessId  : AuthStore.getBusinessId()
}));

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

module.exports = Router;
