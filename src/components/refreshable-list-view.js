'use strict';

import React from 'react-native';
import { ScrollView, ListView, View, Text } from 'react-native';
const RCTRefreshControl = require('react-refresh-control/RCTRefreshControl.ios');

class NotEmpty extends React.Component {

    componentDidMount() {
        RCTRefreshControl.configure({
            node: this.refs.listView
        }, () => {
            this.props.reloadData();
            this._timeout = setTimeout(() => {
                RCTRefreshControl.endRefreshing(this.refs.listView);
            }, 1000);
        });
    }

    componentWillUnmount() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    render() {
        return (
            <ListView
                ref="listView"
                {...this.props}
            />
        );
    }
}

class Empty extends React.Component {

    componentDidMount() {
        RCTRefreshControl.configure({
            node: this.refs.listView
        }, () => {
            this.props.reloadData();
            this._timeout = setTimeout(() => {
                RCTRefreshControl.endRefreshing(this.refs.listView);
            }, 1000);
        });
    }

    componentWillUnmount() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    render() {
        return (
            <ScrollView ref="listView" {...this.props} contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ padding: 10, textAlign: 'center' }}>
                    {this.props.message}
                </Text>
                <Text style={{ padding: 10, textAlign: 'center', color: '#aaaaaa' }}>
                    Tirer pour actualiser.
                </Text>
            </ScrollView>
        );
    }
}


export default class RefreshableListView extends React.Component {

    static propTypes = {
        dataSource: React.PropTypes.object.isRequired,
        reloadData: React.PropTypes.func.isRequired,
        emptyMessage: React.PropTypes.string.isRequired
    }

    render() {
        const { dataSource, emptyMessage } = this.props;

        if (dataSource.getRowCount() > 0) {
            return <NotEmpty {...this.props} />;
        } else {
            return <Empty message={emptyMessage} {...this.props} />;
        }
    }
}
