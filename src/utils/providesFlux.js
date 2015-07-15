var React = require('react-native');

function providesFlux(Component, flux) {
    var componentName = Component.displayName || Component.name;
    var FluxProvider = React.createClass({
        displayName: componentName+'FluxProvider',
        childContextTypes: {
            flux: React.PropTypes.object.isRequired
        },
        getChildContext() {
            return { flux };
        },
        render() {
            return <Component props={this.props} />;
        }
    });

    return FluxProvider;
}

module.exports = providesFlux;
