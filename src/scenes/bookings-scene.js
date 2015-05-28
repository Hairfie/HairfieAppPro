'use strict';

import React from 'react-native';

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    ListView,
    TouchableHighlight
} from 'react-native';

import RefreshableListView from 'react-native-refreshable-listview';
import connectToStores from '../utils/connectToStores';
import BookingScene from './booking-scene';
import { formatDate } from '../utils/date-utils';


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    booking: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        padding: 10
    },
    bookingName: {
        fontSize: 16,
        padding: 5
    },
    bookingDate: {
        padding: 5
    },
    emptyText: {
        padding: 10,
        textAlign: 'center'
    },
    emptyRefresh: {
        margin: 10,
        padding: 20
    },
    emptyRefreshText: {
        color: 'blue',
        textAlign: 'center'
    }
});

class BookingsScene extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id != r2.id
        });

        this.state = {
            dataSource: dataSource.cloneWithRows(props.bookings)
        };
    }

    componentWillMount() {
        this._refreshData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.bookings)
        });
    }

    render() {
        if (0 === this.state.dataSource.getRowCount()) {
            return (
                <ScrollView style={styles.container} centerContent={true}>
                    <Text style={styles.emptyText}>
                        Toutes les réservations ont bien été confirmées :)
                    </Text>
                    <TouchableHighlight
                        style={styles.emptyRefresh}
                        onPress={this._refreshData}
                        underlayColor="#eeeeee"
                    >
                        <Text style={styles.emptyRefreshText}>
                            Rafraichir
                        </Text>
                    </TouchableHighlight>
                </ScrollView>
            );
        }

        return (
            <RefreshableListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                loadData={this._refreshData}
                refreshDescription="Rafraichissement des réservations..."
            />
        );
    }

    _renderRow = (booking) => {
        return (
            <TouchableHighlight style={styles.booking} onPress={this._openBooking.bind(this, booking.id)}>
                <View>
                    <Text style={styles.bookingName}>
                        {booking.firstName+' '+booking.lastName}
                    </Text>
                    <Text style={styles.bookingDate}>
                        {formatDate(booking.timeslot, 'LLLL')}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _refreshData = () => {
        this.context.flux.actions.booking.loadNotConfirmed(this.props.businessId);
    }

    _openBooking = (bookingId) => {
        this.props.navigator.push({
            title: 'Détails de la réservation',
            component: BookingScene,
            passProps: { bookingId }
        });
    }
}

BookingsScene = connectToStores(BookingsScene, [
    'BusinessStore',
    'BookingStore'
], ({ BusinessStore, BookingStore }, { businessId }) => ({
    business: BusinessStore.getById(businessId),
    bookings: BookingStore.getAllNotConfirmed(businessId)
}));

export default BookingsScene;
