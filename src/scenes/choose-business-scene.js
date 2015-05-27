'use strict';

var React = require('react-native');
var _ = require('lodash');
var connectToStores = require('../utils/connectToStores');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    TouchableHighlight
} = React

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    business: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'flex-start',
        backgroundColor: '#c6c6c6'
    },
    businessName: {
        color: '#ffffff',
        fontSize: 22,
        padding: 5,
        containerBackgroundColor: '#000000',
        opacity: .8
    },
    businessAddress: {
        marginTop: 10,
        color: '#aaaaaa',
        fontSize: 14,
        padding: 5,
        containerBackgroundColor: '#000000',
        opacity: .7
    }
});

var ChooseBusinessScene = React.createClass({
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    },
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id != r2.id
        });

        return {
            dataSource: dataSource.cloneWithRows(this.props.businesses)
        };
    },
    componentWillMount() {
        this.context.flux.actions.business.loadManaged(this.props.userId);
    },
    componentWillReceiveProps(nextProps) {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.businesses) });
    },
    render() {
        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                showsVerticalScrollIndicator={false}
            />
        );
    },
    _renderRow(business) {
        var address = business.address || {};

        return (
            <TouchableHighlight onPress={this._handleBusinessPress.bind(null, business.id)}>
                    <Image
                        style={styles.business}
                        source={{ uri: (_.first(business.pictures) || {}).url }}
                    >
                        <Text style={styles.businessName}>
                            {business.name}
                        </Text>
                        <Text style={styles.businessAddress}>
                            {address.street+', '+address.zipCode+' '+address.city}
                        </Text>
                    </Image>
            </TouchableHighlight>
        );
    },
    _handleBusinessPress(businessId) {
        this.context.flux.actions.auth.chooseBusiness(businessId);
    }
});

ChooseBusinessScene = connectToStores(ChooseBusinessScene, ['AuthStore', 'BusinessStore'], (stores) => ({
    userId    : stores.AuthStore.getUserId(),
    businesses: _.sortBy(stores.BusinessStore.getManaged(stores.AuthStore.getUserId()), 'name')
}));

module.exports = ChooseBusinessScene;
