import React from 'react-native';
import {
    Component,
    StyleSheet,
    TouchableHighlight,
    ListView,
    Image,
    View,
    Text
} from 'react-native';
import _ from 'lodash';

import RefreshableListView from '../components/refreshable-list-view';
import connectToStores from '../utils/connectToStores';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        marginBottom: 50
    },
    hairdresser: {
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center'
    },
    hairdresserPicture: {
        margin: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#bbbbbb'
    },
    hairdresserName: {
        margin: 10,
        marginLeft: 0
    }
});

class HairfieBusinessMemberScene extends Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 === r2 });

        this.state = {
            dataSource: ds.cloneWithRows(this.props.hairdressers)
        };
    }

    componentDidMount() {
        this._loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.hairdressers)
        });
    }

    render() {

        return (
            <RefreshableListView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                reloadData={this._loadData}
                emptyMessage="Vous n'avez configuré aucun coiffeur pour le salon."
                renderRow={this._renderRow}
            />
        );
    }

    _renderRow = (member) => {
        return (
            <View>
                <TouchableHighlight
                    underlayColor="#eeeeee"
                    onPress={() => this.props.onSelect(member)}
                >
                    <View style={styles.hairdresser}>
                        <Image
                            style={styles.hairdresserPicture}
                            source={{ uri: (member.picture || {}).url }}
                        />
                        <Text style={styles.hairdresserName}>
                            {member.firstName+' '+member.lastName}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _loadData = () => {
        this.context.flux.actions.businessMember.loadBusinessMembers(this.props.businessId);
    }
}

HairfieBusinessMemberScene = connectToStores(HairfieBusinessMemberScene, [
    'BusinessMemberStore'
], ({ BusinessMemberStore }, { businessId }) => ({
    hairdressers: _.sortByAll(BusinessMemberStore.getHairdressers(businessId), ['firstName', 'lastName'])
}));

export default HairfieBusinessMemberScene;
