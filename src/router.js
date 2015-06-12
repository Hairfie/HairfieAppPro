'use strict';

import React from 'react-native';
import { StyleSheet, Text, NavigatorIOS, TabBarIOS } from 'react-native';
import ActionSheetIOS from 'ActionSheetIOS';

import connectToStores from './utils/connectToStores';

import LoginScene from './scenes/login-scene';
import ChooseBusinessScene from './scenes/choose-business-scene';
import BookingsScene from './scenes/bookings-scene';
import NewHairfieScene from './scenes/new-hairfie-scene';

const TAB_BOOKING = 'booking';
const TAB_HAIRFIE = 'hairfie';

class Authenticated extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            tab: TAB_BOOKING
        };
    }

    componentDidMount() {
        this.context.flux.actions.tag.loadAll();
    }

    render() {
        const { businessId } = this.props;

        return (
            <TabBarIOS style={styles.container}>
                {this._renderTab(
                    TAB_BOOKING,
                    require('image!Icon-Calendar'),
                    'Réservations',
                    BookingsScene,
                    { businessId }
                )}
                {this._renderTab(
                    TAB_HAIRFIE,
                    require('image!Icon-Camera'),
                    'Nouveau Hairfie',
                    NewHairfieScene,
                    { businessId }
                )}
            </TabBarIOS>
        );
    }

    _renderTab(tab, icon, title, scene, props) {
        return (
            <TabBarIOS.Item
                title={title}
                icon={icon}
                selected={this.state.tab == tab}
                onPress={() => this.setState({ tab })}
            >
                <NavigatorIOS
                    style={styles.container}
                    key={tab}
                    initialRoute={{
                        title: title,
                        backButtonTitle: 'Retour',
                        rightButtonTitle: 'Menu',
                        rightButtonIcon: require('image!Icon-Menu'),
                        onRightButtonPress: this._showMenu,
                        component: scene,
                        passProps: props
                    }}
                />
            </TabBarIOS.Item>
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

import HairfieCamera from './components/hairfie-camera';

class Router extends React.Component {

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

        return <Authenticated {...{ businessId }} />;
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
