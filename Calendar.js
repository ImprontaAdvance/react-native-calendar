import React, {Component, PropTypes, View, Text, Image, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import moment from 'moment';

const MAX_COLUMNS = 7;
const MAX_ROWS = 6;

export default class Calendar extends Component {
    static propTypes = {
        firstDayOfWeek: PropTypes.number.isRequired,
        nameOfDays: PropTypes.arrayOf(PropTypes.string),
        dateFormat: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ]),
        prevButton: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ]),
        nextButton: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ])
    };

    static defaultProps = {
        firstDayOfWeek: 0,
        nameOfDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        dateFormat: 'MMMM YYYY',
        prevButton: 'Prev',
        nextButton: 'Next'
    };

    constructor(props) {
        super(props);

        this.state = {
            currentMonth: moment(this.props.date)
        };
    }

    goToNextMonth() {
        this.setState({
            currentMonth: moment(this.state.currentMonth).add(1, 'month')
        });
    }

    goToPrevMonth() {
        this.setState({
            currentMonth: moment(this.state.currentMonth).subtract(1, 'month')
        });
    }

    renderMonthGrid(date) {
        var currentDay = moment(date).startOf('month'),
            filled = this.props.firstDayOfWeek,
            weekRows = [];

        
        var startIndex = currentDay.get('day'),
            endIndex = currentDay.daysInMonth() + startIndex;

        for (var i = 0; i < MAX_ROWS; i++) {
            let days = [];

            // Stop at the end of rows or when endIndex is reached
            for (var j = 0; j < MAX_COLUMNS && filled < endIndex; j++, filled++) {
                if (filled < startIndex) {
                    days.push(<Day key={`${i},${j}`} filler={true} />);
                    continue;
                }

                days.push(
                    <Day
                        key={`${i},${j}`}
                        onPress={this._selectDate}
                        currentDay={currentDay} />
                );

                // clone currentDay to avoid side effect
                currentDay = moment(currentDay).add(1, 'days');
            }


            // Fill remaining cells
            for(let x = days.length; x < 7; x++)
                days.push(<Day key={'filler-' + x} filler={true} />);


            weekRows.push(<View key={weekRows.length} style={[styles.weekRow]}>{days}</View>);
        }

        return <View key={date} style={styles.monthContainer}>{weekRows}</View>;
    }

    _renderPrevButton() {
        if(typeof this.props.prevButton === 'function')
            // give a clone of currentMonth to avoid side effects
            return this.props.prevButton(moment(this.state.currentMonth), () => this.goToPrevMonth())

        if(typeof this.props.prevButton === 'string')
            return (
                <TouchableOpacity onPress={() => this.goToPrevMonth()}>
                    <Text>{this.props.prevButton}</Text>
                </TouchableOpacity>
            );

        // return empty view to avoid layout error
        return <View />;
    }

    _renderNextButton() {
        if(typeof this.props.nextButton === 'function')
            // give a clone of currentMonth to avoid side effects
            return this.props.nextButton(moment(this.state.currentMonth), () => this.goToNextMonth());

        if(typeof this.props.nextButton === 'string')
            return (
                <TouchableOpacity onPress={() => this.goToNextMonth()}>
                    <Text>{this.props.nextButton}</Text>
                </TouchableOpacity>
            );

        // return empty view to avoid layout error
        return <View />;
    }

    _renderCurrentMonth() {
        if(typeof this.props.dateFormat === 'function')
            // give a clone of currentMonth to avoid side effects
            return this.props.dateFormat(moment(this.state.currentMonth))

        if(typeof this.props.dateFormat === 'string')
            return <Text>{this.state.currentMonth.format(this.props.dateFormat)}</Text>;

        return null;
    }

    renderHeading() {
        // Name of the days
        var names = [];
        for(let i = 0; i < 7; i++)
            names.push(
                <View key={`DayName-${i}`} style={styles.dayName}>
                    <Text>{this.props.nameOfDays[(this.props.firstDayOfWeek + i) % 7]}</Text>
                </View>
            );


        return (
            <View>
                <View style={styles.heading}>
                    {this._renderPrevButton()}
                    {this._renderCurrentMonth()}
                    {this._renderNextButton()}
                </View>
                <View style={styles.dayNames}>
                    {names}
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeading()}

                <View style={styles.grid}>
                {this.renderMonthGrid(this.state.currentMonth)}
                </View>
            </View>
        );
    }
};

class Day extends Component {
    render() {
        return (
            <View style={styles.day}>
                <Text>{this.props.filler ? '-' : this.props.currentDay.format('DD')}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayNames: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#000',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    dayName: {
        flex: 1,
        paddingHorizontal: 2,
        alignItems: 'center'
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#000',
        borderBottomWidth: 1,
    },
    day: {
        flex: 1,
        backgroundColor: 'yellow',
        alignItems: 'center'
    }
});