import React from 'react-native';
import {
    Component,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TextInput
} from 'react-native';
import _ from 'lodash';

const styles = StyleSheet.create({
    label: {
        padding: 10,
        paddingBottom: 0
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#cccccc',
        margin: 10
    },
    fieldSuffix: {
        marginRight: 10,
        padding: 5
    },
    fieldInput: {
        flex: 1,
        height: 30
    }
});


export default class HairfieInfos extends Component {

    static propTypes = {
        onChange: React.PropTypes.func.isRequired,
        values: React.PropTypes.obj
    }

    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            values: props.values || {}
        };
    }

    render() {
        return (
            <ScrollView {...this.props}>
                <Text style={styles.label}>
                    Prix payé par le client :
                </Text>
                <View style={styles.field}>
                    <TextInput
                        ref="priceAmount"
                        style={styles.fieldInput}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        placeholder="Prix de la coupe"
                        value={_.get(this.props.values, 'price.amount')}
                        onChangeText={this._onChange.bind(this, 'price.amount')}
                    />
                    <Text style={styles.fieldSuffix}>€</Text>
                </View>
                <Text style={styles.label}>
                    Addresse email du client :
                </Text>
                <View style={styles.field}>
                    <TextInput
                        ref="customerEmail"
                        style={styles.fieldInput}
                        keyboardType="email-address"
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect="false"
                        placeholder="Email du client"
                        value={_.get(this.props.values, 'customerEmail')}
                        onChangeText={this._onChange.bind(this, 'customerEmail')}
                    />
                </View>
            </ScrollView>
        );
    }

    _onChange = (path, value) => {
        const newValue = '' == value ? null : value;
        const newValues = _.set(this.state.values, path, newValue);

        this.setState({ values: newValues }, () => {
            this.props.onChange(newValues);
        });
    }
}
