import React, { Component } from 'react'
import { Button, Grid } from 'semantic-ui-react'
import styles from './CalendarControls.module.css'
import moment from 'moment'

export default class CalendarControls extends Component {
    formatDDMM = (date) => {
        return moment(date).format('DD/MM')
    }

    render() {
        const {
            weekdays,
            toggleCreateModal
        } = this.props;
        return (
            <Grid>
                <div className="sixteen column row">
                    <div className="eight wide column">
                        <button>&lt;</button>
                        {weekdays.map(weekday => (
                            <button key={weekday.date.getDate()} className={styles.Circle}>{weekday.date.getDate()}</button>
                        ))}
                        <button>&gt;</button>
                    </div>
                    <div className="two wide column"><p>{this.formatDDMM(weekdays[0].date)} - {this.formatDDMM(weekdays[weekdays.length - 1].date)}</p></div>
                    <div className="four wide column"></div>
                    <div className="two wide column">
                        <Button>Lịch ngày</Button>
                        <Button onClick={toggleCreateModal}>Tạo lịch học</Button>
                    </div>
                </div>
            </Grid>
        )
    }
}
