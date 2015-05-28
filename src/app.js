'use strict';

import React from 'react-native';
import Router from './router';
import flux from './flux';
import providesFlux from './utils/providesFlux';

class App extends React.Component {
    render() {
        return <Router />
    }
}

App = providesFlux(App, flux);

module.exports = App;
