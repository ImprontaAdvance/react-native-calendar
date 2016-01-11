import React, {Component, PropTypes, View, Text, Image, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Day from './Day';
import moment from 'moment';

const MAX_COLUMNS = 7;
const MAX_ROWS = 6;

export default class Calendar extends Component {
    static propTypes = {
        firstDayOfWeek: PropTypes.number.isRequired,
        nameOfDays: PropTypes.arrayOf(PropTypes.string),
        eventDates: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(moment)
            ])
        ),
        dateFormat: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        prevButton: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        nextButton: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        calendarStyle: React.PropTypes.shape({
            calendarContainer: React.PropTypes.object,
            gridContainer: React.PropTypes.object,
            monthContainer: React.PropTypes.object,
            weekRow: React.PropTypes.object,
        }),
        dayStyle: React.PropTypes.object
    };

    static defaultProps = {
        firstDayOfWeek: 0,
        nameOfDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        eventDates: [],
        dateFormat: 'MMMM YYYY',
        prevButton: 'Prev',
        nextButton: 'Next',
        customStyle: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            currentMonth: moment(this.props.date),
            selectedDate: moment()
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

    selectDate(date) {
        this.setState({
            selectedDate: moment(date)
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
                        key={`${i}x${j}`}
                        events={this.props.eventDates.filter(d => moment(d).isSame(currentDay, 'd'))}
                        isSelected={currentDay.isSame(this.state.selectedDate, 'd')}
                        onPress={this.selectDate.bind(this, moment(currentDay))}
                        dayStyle={this.props.dayStyle}
                        currentDay={currentDay} />
                );

                // clone currentDay to avoid side effect
                currentDay = moment(currentDay).add(1, 'days');
            }


            // Fill remaining cells
            for(let x = days.length; x < 7; x++)
                days.push(<Day key={'filler-' + x} filler={true} />);

            weekRows.push(<View key={weekRows.length} style={[styles.weekRow, this.props.customStyle.weekRow]}>{days}</View>);
        }

        return <View key={date} style={[styles.monthContainer, this.props.customStyle.monthContainer]}>{weekRows}</View>;
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
            <View style={[styles.container, this.props.customStyle.calendarContainer]}>
                {this.renderHeading()}

                <View style={[styles.grid, this.props.customStyle.gridContainer]}>
                    {this.renderMonthGrid(this.state.currentMonth)}
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {

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
    }
});