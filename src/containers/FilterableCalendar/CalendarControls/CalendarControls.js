import React, { Component } from 'react'
import { Button, Grid, Icon } from 'semantic-ui-react'
import styles from './CalendarControls.module.css'
import moment from 'moment'

class CalendarControls extends Component {
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
                <Grid.Row className={styles.CalendarControls}>
                    <Grid.Column width={12}>
                        <button onClick={this.navigatePreviousWeek}>&lt;</button>
                        {weekdays.map((weekday, dayIndex) => {
                            const btnStyle = singleDayMode && weekday.selected ? styles.Circle : styles.CircleInactive;
                            return (
                                <button key={weekday.date.getDate()} className={btnStyle} onClick={() => handleOnSelectWeekday(dayIndex)}>{weekday.date.getDate()}</button>
                            )
                        })}
                        <button onClick={this.navigateNextWeek}>&gt;</button>
                        <p className={styles.Weekdays}>{this.formatDDMM(weekdays[0].date)} - {this.formatDDMM(weekdays[weekdays.length - 1].date)}</p>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div class={styles.Buttons}>
                            <Button onClick={toggleViewMode}>{singleDayMode ? "Lịch tuần" : "Lịch ngày"}</Button>
                            <Button icon color="green" labelPosition='left' onClick={() => toggleCreateModal()}><Icon name="add" />Tạo lịch học</Button>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default React.memo(CalendarControls)
