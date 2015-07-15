import React from 'react-native';
import {
    Component,
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    ActivityIndicatorIOS
} from 'react-native';
import Dimensions from 'Dimensions';
import _ from 'lodash';
import RefreshableListView from '../components/refreshable-list-view';
import connectToStores from '../utils/connectToStores';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 65,
        marginBottom: 50,
        padding: 5
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    hairfieSecondPicture: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 5,
        right: 5,
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 3
    },
    hairfiePrice: {
        position: 'absolute',
        top: 5,
        left: 5,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fc5a5f',
        justifyContent: 'center'
    },
    hairfiePriceText: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 11,
        color: '#ffffff',
        textAlign: 'center',
    },
    hairfieCaption: {
        height: 30,
        borderTopWidth: 2,
        borderColor: '#f95e62',
        backgroundColor: '#f3eded',
        flexDirection: 'row'
    },
    hairfieAuthorPicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ffffff',
        top: -10,
        left: 5
    },
    hairfieAuthorName: {
        margin: 5,
        marginLeft: 10,
        color: '#666666'
    },
    hairfieUploadingText: {
        margin: 5,
        color: '#666666'
    }
});

class HairfiesScene extends Component {

    static contextTypes = {
        flux: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => !_.isEqual(r1, r2)
        });

        this.state = {
            dataSource,
            hairfieWidth: Dimensions.get('window').width / 2 - 15
        };
    }

    componentDidMount() {
        this._updateDataSource(this.props);
        this._loadData();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.businessId != nextProps.businessId) {
            this._loadData(nextProps.businessId);
        }

        this._updateDataSource(nextProps);
    }

    render() {
        return (
            <RefreshableListView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                reloadData={this._loadData}
                renderRow={this._renderRow}
                emptyMessage="Vous n'avez pas encore posté de Hairfie."
            />
        );
    }

    _renderRow = (hairfies) => {
        return (
            <View style={styles.row}>
                {hairfies.map(hairfie =>
                    hairfie.isUpload ?
                        this._renderUpload(hairfie) :
                        this._renderHairfie(hairfie)
                )}
            </View>
        );
    }

    _renderHairfie = (hairfie) => {
        return (
            <View
                style={{
                    margin: 5,
                    width: this.state.hairfieWidth
                }}
            >
                <Image
                    style={{
                        width: this.state.hairfieWidth,
                        height: this.state.hairfieWidth,
                    }}
                    source={{ uri: _.last(hairfie.pictures).url }}
                >
                    { hairfie.pictures.length > 1 && (
                        <Image
                            style={styles.hairfieSecondPicture}
                            source={{ uri: _.first(hairfie.pictures).url }}
                            defaultSource={require('image!DefaultUserPicture')}
                        />
                    ) }

                    { (parseInt(_.get(hairfie, 'price.amount')) || 0) > 0 && (
                        <View style={styles.hairfiePrice}>
                            <Text style={styles.hairfiePriceText}>
                                {hairfie.price.amount}€
                            </Text>
                        </View>
                    ) }
                </Image>
                { !!hairfie.businessMember && ( /* show business member */
                    <View style={styles.hairfieCaption}>
                        <Image
                            style={styles.hairfieAuthorPicture}
                            source={{ uri: _.get(hairfie, 'businessMember.picture.url') }}
                            defaultSource={require('image!DefaultUserPicture')}
                        />
                        <Text style={styles.hairfieAuthorName}>
                            {_.get(hairfie, 'businessMember.firstName', '')+
                                ' '+
                                _.get(hairfie, 'businessMember.lastName', '').substr(0, 1)+
                                '.'
                            }
                        </Text>
                    </View>
                ) || ( /* show author */
                    <View style={styles.hairfieCaption}>
                        <Image
                            style={styles.hairfieAuthorPicture}
                            source={{ uri: _.get(hairfie, 'author.picture.url') }}
                        />
                        <Text style={styles.hairfieAuthorName}>
                            {_.get(hairfie, 'author.firstName', '')+
                                ' '+
                                _.get(hairfie, 'author.lastName', '').substr(0, 1)+
                                '.'
                            }
                        </Text>
                    </View>
                ) }
            </View>
        );
    }

    _renderUpload = ({ values }) => {
        return (
            <View
                style={{
                    margin: 5,
                    width: this.state.hairfieWidth
                }}
            >
                <Image
                    style={{
                        width: this.state.hairfieWidth,
                        height: this.state.hairfieWidth,
                    }}
                    source={{ uri: _.last(values.images).uri }}
                >
                    { values.images.length > 1 && (
                        <Image
                            style={styles.hairfieSecondPicture}
                            source={{ uri: _.first(values.images).uri }}
                            defaultSource={require('image!DefaultUserPicture')}
                        />
                    ) }

                    <ActivityIndicatorIOS
                        style={{
                            flex: 1,
                            width: this.state.hairfieWidth,
                            backgroundColor: 'rgba(0,0,0,.5)'
                        }}
                        size="large"
                        animating={true}
                    />
                </Image>
                <View style={styles.hairfieCaption}>
                    <Text style={styles.hairfieAuthorName}>
                        Envoi en cours...
                    </Text>
                </View>
            </View>
        );
    }

    _updateDataSource = (props) => {
        const rows = _.chunk(_.union(props.uploads, props.hairfies), 2);

        this.setState({ dataSource: this.state.dataSource.cloneWithRows(rows) });
    }

    _loadData = (businessId) => {
        this.context.flux.actions.hairfie.loadAllByBusiness(businessId || this.props.businessId);
    }
}

HairfiesScene = connectToStores(
    HairfiesScene,
    ['HairfieStore'],
    ({ HairfieStore }, { businessId }) => ({
        uploads: _.map(HairfieStore.getUploadsInProgress(), u => _.assign({}, u, { isUpload: true })),
        hairfies: _.sortByOrder(HairfieStore.getAllByBusiness(businessId), ['createdAt'], [false])
    })
);


export default HairfiesScene;
