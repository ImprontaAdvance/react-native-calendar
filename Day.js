import React, {Component, View, TouchableOpacity, Text, PropTypes, StyleSheet} from 'react-native';
import moment from 'moment';

export default class Day extends Component {
    static propTypes = {
        filler: PropTypes.bool,
        isSelected: PropTypes.bool,
        currentDay: PropTypes.instanceOf(moment),
        events: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(moment)
            ])
        ),
        onPress: PropTypes.func,
        dayStyle: React.PropTypes.object,
    };

    static defaultProps = {
        dayStyle: {}
    };

    render() {
        if(this.props.filler)
            return <View style={[styles.day, this.props.dayStyle.day, this.props.dayStyle.filler]}><Text>{' '}</Text></View>;

        const isToday = this.props.currentDay.isSame(moment(), 'd');
        const hasEvents = this.props.events.length > 0;

        let style = [];
        style.push(styles.day);
        style.push(this.props.dayStyle.day);
        isToday && style.push(styles.today);
        isToday && style.push(this.props.dayStyle.today);
        hasEvents && style.push(styles.dayWithEvents);
        hasEvents && style.push(this.props.dayStyle.dayWithEvents);
        this.props.isSelected && style.push(styles.daySelected);
        this.props.isSelected && style.push(this.props.dayStyle.daySelected);

        return (
            <View style={style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Text style={this.props.dayStyle.text}>{this.props.currentDay.format('DD')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    day: {
        flex: 1,
        alignItems: 'center'
    },
    today: {
    },
    dayWithEvents: {
    },
    daySelected: {
    }
});