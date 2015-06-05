'use strict';

import _ from 'lodash';
import React from 'react-native';
import {
    ActivityIndicatorIOS,
    CameraRoll,
    Image,
    ListView,
    StyleSheet,
    View
} from 'react-native';

export default class CameraRollView extends React.Component {

    static propTypes = {
        groupTypes: React.PropTypes.oneOf([
            'Album',
            'All',
            'Event',
            'Faces',
            'Library',
            'PhotoStream',
            'SavedPhotos',
        ]),
        batchSize: React.PropTypes.number,
        renderImage: React.PropTypes.func,
        imagesPerRow: React.PropTypes.number
    };

    static defaultProps = {
        groupTypes: 'All',
        batchSize: 11,
        renderImage: (asset) => (
            <Image
                style={styles.image}
                source={_.assign({}, asset.node.image, { width: 100, height: 100 })}
            />
        ),
        imagesPerRow: 3
    };

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({ rowHasChanged: this._rowHasChanged });

        this.state = this._getInitialState();
    }

    componentDidMount() {
        this._fetch();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.groupTypes !== nextProps.groupTypes) {
            this._fetch(true);
        }
    }

    render() {
        return (
            <ListView
                renderRow={this._renderRow}
                renderFooter={this._renderFooter}
                onEndReached={this._onEndReached}
                style={styles.container}
                dataSource={this.state.dataSource}
            />
       );
    }

    _renderRow = (rowData) => {
        return (
            <View style={styles.row}>
                {rowData.map((asset) => {
                    if (asset) {
                        return this.props.renderImage(asset);
                    }
                })}
            </View>
        );
    }

    _renderFooter = () => {
        if (this.state.isLoadingMore) {
            return this._renderFooterSpinner();
        }
    }

    _renderFooterSpinner = () => {
        if (!this.state.noMore) {
            return <ActivityIndicatorIOS style={styles.spinner} />;
        }
        return null;
    }

    _getInitialState = () => {
        const ds = new ListView.DataSource({ rowHasChanged: this._rowHasChanged });

        return {
            assets: [],
            lastCursor: null,
            noMore: false,
            loadingMore: false,
            dataSource: ds,
        }
    }

    _fetch = (clear) => {
        if (!this.state.loadingMore) {
            this._doFetch(clear);
        }
    }

    _doFetch = (clear) => {
        if (clear) {
            return this.setState(this._getInitialState(), this._fetch);
        }

        var fetchParams = {
            first: this.props.batchSize,
            groupTypes: this.props.groupTypes,
        };

        if (this.state.lastCursor) {
            fetchParams.after = this.state.lastCursor;
        }

        CameraRoll.getPhotos(fetchParams, this._appendAssets, (e) => {
            console.log('failed to get photos:', e.stack || e);
        });
    }

    _appendAssets = (data) => {
        const assets = data.edges;

        var newState = { loadingMore: false };

        if (!data.page_info.has_next_page) {
            newState.noMore = true;
        }

        if (assets.length > 0) {
            newState.lastCursor = data.page_info.end_cursor;
            newState.assets = _.union(this.state.assets, assets);
            newState.dataSource = this.state.dataSource.cloneWithRows(
                _.chunk(newState.assets, this.props.imagesPerRow)
            );
        }

        this.setState(newState);
    }

    _onEndReached = () => {
        if (!this.state.noMore) {
            this._fetch();
        }
    }

    _rowHasChanged = (r1, r2) => {
        if (r1.length !== r2.length) {
          return true;
        }

        for (var i = 0; i < r1.length; i++) {
          if (r1[i] !== r2[i]) {
            return true;
          }
        }

        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    image: {
        margin: 4
    }
});
