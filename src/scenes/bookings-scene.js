'use strict';

import React from 'react-native';

import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    ListView,
    SegmentedControlIOS,
    TouchableHighlight
} from 'react-native';

import RefreshableListView from 'react-native-refreshable-listview';
import connectToStores from '../utils/connectToStores';
import BookingScene from './booking-scene';
import { formatDate } from '../utils/date-utils';
import EmptyList from '../components/empty-list';


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
});

const TAB_REQUESTS = 'requests';
const TAB_ALL = 'all';

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
            tab: TAB_REQUESTS,
            bookingsDataSource: dataSource.cloneWithRows(props.bookings),
            requestsDataSource: dataSource.cloneWithRows(props.requests)
        };
    }

    componentWillMount() {
        this._refreshData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookingsDataSource: this.state.bookingsDataSource.cloneWithRows(nextProps.bookings),
            requestsDataSource: this.state.requestsDataSource.cloneWithRows(nextProps.requests)
        });
    }

    render() {
        const tabs = [
            { id: TAB_REQUESTS, title: 'À confirmer' },
            { id: TAB_ALL, title: 'Toutes' }
        ];

        return (
            <View style={styles.container}>
                <SegmentedControlIOS
                    style={{margin: 10, marginTop: 70}}
                    values={_.pluck(tabs, 'title')}
                    selectedIndex={_.findIndex(tabs, {id: this.state.tab})}
                    onValueChange={title => this.setState({ tab: tabs[_.findIndex(tabs, { title })].id })}
                />
                {this.state.tab === TAB_ALL ?
                    this._renderList(
                        this.state.bookingsDataSource,
                        "Aucune réservation à afficher"
                    ) :
                    this._renderList(
                        this.state.requestsDataSource,
                        "Toutes les réservations ont bien été confirmées :)"
                    )
                }
            </View>
        );
    }

    _renderList(dataSource, emptyMessage) {
        if (0 === dataSource.getRowCount()) {
            return (
                <EmptyList
                    message={emptyMessage}
                    refreshButtonTitle="Rafraichir"
                    onRefreshButtonPress={this._refreshData}
                />
            );
        }

        return (
            <RefreshableListView
                dataSource={dataSource}
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
                        {formatDate(booking.dateTime, 'LLLL')}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _refreshData = () => {
        this.context.flux.actions.booking.loadAll(this.props.businessId);
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
    requests: BookingStore.getRequests(businessId),
    bookings: BookingStore.getAll(businessId)
}));

export default BookingsScene;
