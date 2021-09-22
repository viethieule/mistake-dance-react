import React, { Component } from 'react'
import { Button, Grid } from 'semantic-ui-react'
import styles from './CalendarControls.module.css'
import moment from 'moment'

export default class CalendarControls extends Component {
    formatDDMM = (date) => {
        return moment(date).format('DD/MM')
    }

    navigatePreviousWeek = () => {
        return this.props.handleOnWeekNavigating(false);
    }

    navigateNextWeek = () => {
        return this.props.handleOnWeekNavigating(true);
    }

    render() {
        const {
            weekdays,
            toggleCreateModal,
            singleDayMode,
            toggleViewMode,
            handleOnSelectWeekday
        } = this.props;
        return (
            <Grid>
                <div className="sixteen column row">
                    <div className="eight wide column">
                        <button onClick={this.navigatePreviousWeek}>&lt;</button>
                        {weekdays.map((weekday, dayIndex) => {
                            const btnStyle = singleDayMode && weekday.selected ? styles.Circle : styles.CircleInactive;
                            return (
                                <button key={weekday.date.getDate()} className={btnStyle} onClick={() => handleOnSelectWeekday(dayIndex)}>{weekday.date.getDate()}</button>
                            )
                        })}
                        <button onClick={this.navigateNextWeek}>&gt;</button>
                    </div>
                    <div className="two wide column"><p>{this.formatDDMM(weekdays[0].date)} - {this.formatDDMM(weekdays[weekdays.length - 1].date)}</p></div>
                    <div className="four wide column"></div>
                    <div className="two wide column">
                        <Button onClick={toggleViewMode}>{singleDayMode ? "Lịch tuần" : "Lịch ngày"}</Button>
                        <Button onClick={() => toggleCreateModal()}>Tạo lịch học</Button>
                    </div>
                </div>
            </Grid>
        )
    }
}
