'use strict';

import React from 'react-native';
import { StyleSheet, Text, NavigatorIOS } from 'react-native';
import ActionSheetIOS from 'ActionSheetIOS';

import connectToStores from './utils/connectToStores';

import LoginScene from './scenes/login-scene';
import ChooseBusinessScene from './scenes/choose-business-scene';
import BookingsScene from './scenes/bookings-scene';

class Router extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

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
                    rightButtonTitle: 'Menu',
                    rightButtonIcon: require('image!Topbar-Menu-Icon'),
                    onRightButtonPress: this._showMenu,
                    component: BookingsScene,
                    passProps: { businessId }
                }}
            />
        );
    }

    _showMenu = () => {
        var actions = [
            { id: 'changeBusiness', label: 'Changer d\'activité' },
            { id: 'logout', label: 'Se déconnecter' },
            { id: 'cancel', label: 'Annuler' }
        ];

        ActionSheetIOS.showActionSheetWithOptions({
            options: _.pluck(actions, 'label'),
            cancelButtonIndex: _.findIndex(actions, { id: 'cancel' })
        }, (index) => {
            const action = actions[index];
            switch (action.id) {
                case 'changeBusiness':
                    this.context.flux.actions.auth.chooseBusiness();
                    break;

                case 'logout':
                    this.context.flux.actions.auth.logout();
                    break;
            }
        });
    }
}

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
