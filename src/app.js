'use strict';

import React from 'react-native';
import Router from './router';
import flux from './flux';
import providesFlux from './utils/providesFlux';

class App extends React.Component {

    componentDidMount() {
        flux.actions.app.start();
    }

    render() {
        return <Router />
    }
}

App = providesFlux(App, flux);

module.exports = App;
