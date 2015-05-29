'use strict';

import _ from 'lodash';
import {
    Component,
    StyleSheet,
    ScrollView,
    Text,
    TouchableHighlight
} from 'react-native';

const styles = StyleSheet.create({
    message: {
        padding: 10,
        textAlign: 'center'
    },
    refreshButton: {
        margin: 10,
        padding: 20
    },
    refreshButtonTitle: {
        color: 'blue',
        textAlign: 'center'
    }
});

export default class EmptyList extends Component {

    static propTypes = {
        message: React.PropTypes.string.isRequired,
        onRefreshButtonPress: React.PropTypes.func.isRequired,
        refreshButtonTitle: React.PropTypes.string.isRequired
    }

    render() {
        const { message, refreshButtonTitle, onRefreshButtonPress } = this.props;

        return (
            <ScrollView style={styles.container} centerContent={true}>
                <Text style={styles.message}>
                    {message}
                </Text>
                { !!onRefreshButtonPress && (
                    <TouchableHighlight
                        style={styles.refreshButton}
                        onPress={onRefreshButtonPress}
                        underlayColor="#eeeeee"
                    >
                        <Text style={styles.refreshButtonTitle}>
                            {refreshButtonTitle}
                        </Text>
                    </TouchableHighlight>
                ) }
            </ScrollView>
        );
    }

}
