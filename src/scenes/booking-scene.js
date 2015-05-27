'use strict';

import React from 'react-native';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import connectToStores from '../utils/connectToStores';
import { formatDate } from '../utils/date-utils';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    info: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    infoTitle: {
        flex: 1,
        padding: 5,
        fontWeight: '900'
    },
    infoValue: {
        flex: 2,
        padding: 5
    },
    confirmContainer: {
        padding: 10,
        backgroundColor: '#fff3f3'
    },
    confirmText: {
        textAlign: 'center'
    },
    confirmButton: {
        padding: 10,
        backgroundColor: '#fe5b5e',
        marginTop: 10,
        borderRadius: 5
    },
    confirmButtonText: {
        textAlign: 'center',
        color: '#ffffff'
    }
});

class Info extends React.Component {
    render() {
        const { title, children } = this.props;

        return (
            <View style={styles.info}>
                <Text style={styles.infoTitle}>
                    {title}
                </Text>
                <Text style={styles.infoValue}>
                    {children}
                </Text>
            </View>
        );
    }
}


class BookingScene extends React.Component {
    render() {
        const { booking } = this.props;
        const discount = parseInt(booking.discount) || 0;

        return (
            <ScrollView style={styles.container}>
                { booking.confirmed || (
                    <View style={styles.confirmContainer}>
                        <Text style={styles.confirmText}>
                            Cette réservation est en attente de confirmation.
                        </Text>
                        <TouchableHighlight style={styles.confirmButton} onPress={this._confirm}>
                            <Text style={styles.confirmButtonText}>
                                Confirmer la réservation
                            </Text>
                        </TouchableHighlight>
                    </View>
                ) }
                <Info title="Client">
                    { (booking.gender == 'MALE' ? 'M' : 'Mme')+' '+booking.firstName+' '+booking.lastName }
                </Info>
                <Info title="Date">
                    { formatDate(booking.timeslot, 'LLLL') }
                </Info>
                <Info title="Status">
                    { booking.confirmed ? 'confirmé' : 'en attente de confirmation' }
                </Info>
                { discount && (
                    <Info title="Promo">
                        { 'réduction de '+discount+'%' }
                    </Info>
                ) }
                {booking.comment && (
                    <Info title="Message du client">
                        { booking.comment }
                    </Info>
                )}
            </ScrollView>
        );
    }

    _confirm = () => {

    }
}

BookingScene = connectToStores(BookingScene, ['BookingStore'], ({ BookingStore }, { bookingId }) => ({
    booking: BookingStore.getById(bookingId)
}));

export default BookingScene;
