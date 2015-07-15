import React from 'react-native';
import {
    Component,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    Text
} from 'react-native';
import _ from 'lodash';
import RefreshableListView from './refreshable-list-view';
import connectToStores from '../utils/connectToStores';

const styles = StyleSheet.create({
    categoryName: {
        padding: 5,
        backgroundColor: '#eeeeee',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tag: {
        margin: 5,
        padding: 5,
        backgroundColor: '#fafafa',
        borderRadius: 5
    },
    tagActive: {
        margin: 5,
        padding: 5,
        backgroundColor: '#90ee90',
        borderRadius: 5
    },
    tagText: {
        color: '#666666'
    }
});

class TagsPicker extends Component {

    static propTypes = {
        onChange: React.PropTypes.func.isRequired
    }

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });

        this.state = {
            dataSource: ds.cloneWithRows(props.tags),
            selectedIds: []
        };
    }

    componentDidMount() {
        this._loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.tags) });
    }

    render() {
        return (
            <RefreshableListView
                {...this.props}
                dataSource={this.state.dataSource}
                reloadData={this._loadData}
                emptyMessage="Les tags n'ont pas encore été chargés..."
                renderRow={this._renderRow}
            />
        );
    }

    _renderRow = (tags) => {
        const category = (_.first(tags) || {}).category || {};

        return (
            <View style={styles.category}>
                <Text style={styles.categoryName}>
                    {category.name}
                </Text>
                <View style={styles.tags}>
                    {tags.map(tag => (
                        <TouchableHighlight
                            key={tag.id+(this._isSelected(tag.id) && 'selected')}
                            style={this._isSelected(tag.id) ? styles.tagActive : styles.tag}
                            underlayColor="#cccccc"
                            onPress={() => this._switchTag(tag.id)}
                        >
                            <Text style={styles.tagText}>
                                {tag.name}
                            </Text>
                        </TouchableHighlight>
                    ))}
                </View>
            </View>
        );
    }

    _switchTag(id) {
        const newSelectedIds = this._isSelected(id) ?
            _.without(this.state.selectedIds, id) :
            _.union(this.state.selectedIds, [id]);

        this.setState({ selectedIds: newSelectedIds }, () => {
            const TagStore = this.context.flux.store('TagStore');
            const tags = this.state.selectedIds.map(id => TagStore.getById(id));
            this.props.onChange(tags);
        });
    }

    _isSelected(id) {
        return _.includes(this.state.selectedIds, id);
    }

    _loadData = () => {
        this.context.flux.actions.tag.loadAll();
    }
}

TagsPicker = connectToStores(TagsPicker, ['TagStore'], ({ TagStore }) => ({
    tags: TagStore.getAllGroupedByCategory()
}));

export default TagsPicker;
