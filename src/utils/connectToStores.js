'use strict';

var React = require('react-native');
var _ = require('lodash');

function connectToStores(Component, stores, getProps) {
    var componentName = Component.displayName || Component.name;
    var StoreConnector = React.createClass({
        displayName: componentName + 'StoreConnector',
        contextTypes: {
            flux: React.PropTypes.object.isRequired
        },
        getInitialState() {
            return this.getStateFromStores(this.props);
        },
        componentDidMount() {
            stores.forEach(Store => {
                this.getFlux().store(Store).on('change', this._onStoreChange);
            });
        },
        componentWillUnmount() {
            stores.forEach(Store => {
                this.getFlux().store(Store).removeListener('change', this._onStoreChange);
            });
        },
        getStateFromStores(props) {
            if ('function' === typeof getProps) {
                var storeInstances = {};
                stores.forEach(function (store) {
                    var storeName = store.name || store.storeName || store;
                    storeInstances[storeName] = this.getFlux().store(store);
                }, this);
                return getProps(storeInstances, props);
            }
            var state = {};
            return state;
        },
        getFlux() {
            return this.props.flux || this.context.flux;
        },
        _onStoreChange() {
            this.setState(this.getStateFromStores(this.props));
        },
        render() {
            return React.createElement(Component, _.assign({}, this.props, this.state));
        }
    });

    return StoreConnector;
}

module.exports = connectToStores;
