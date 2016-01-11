# @improntaadvance/react-native-calendar
`<Calendar />` component for react-native iOS and Android, responsive and fully customizable

Suggestions and PR's are welcome!

## Installation
```sh
$ npm install --save https://github.com/ImprontaAdvance/react-native-calendar
```

## Usage
```jsx
import Calendar from '@improntaadvance/react-native-calendar';

<Calendar
    firstDayOfWeek={1} // Start week from Sunday, Monday, or any other
    nameOfDays={['S', 'M', 'T', 'W', 'T', 'F', 'S']} // Name of days 
    eventDates={['2016-01-07']} // Days where show that they are busy
    dateFormat='MMMM YYYY' // Format string displayed or function that returns React node
    prevButton='Prev' // Text for previous button or function that returns React node; null to hide
    nextButton='Next' // Text for next button or function that returns React node; null to hide
    calendarStyle={calendarStyles} // Custom styles for calendar container and grids
    dayStyle={dayStyles}  // Custom styles for single day cell
    />
    
const calendarStyle = StyleSheet.create({
    calendarContainer: {},
    gridContainer: {},
    monthContainer: {},
    weekRow: {},
});

const dayStyle = StyleSheet.create({
    filler: {},
    day: {},
    today: {},
    dayWithEvents: {},
    daySelected: {},
});
```

## To do

- [ ] Support swipe gesture


## License
MIT

**Free Software, Hell Yeah!**