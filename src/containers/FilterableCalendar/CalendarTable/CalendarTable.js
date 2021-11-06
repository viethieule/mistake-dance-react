import React, { Component, Fragment, memo } from 'react'
import { Table } from 'semantic-ui-react'
import SessionCard from '../SessionTag/SessionCard'
import moment from 'moment'
import styles from './CalendarTable.module.css'
import HoverableTableCell from './HoverableTableCell'
import { connect } from 'react-redux'

const DEFAULT_TIME_SLOTS = [
    { hours: 9, minutes: 0 },
    { hours: 10, minutes: 0 },
    { hours: 11, minutes: 0 },
    { hours: 12, minutes: 0 },
    { hours: 17, minutes: 0 },
    { hours: 18, minutes: 0 },
    { hours: 18, minutes: 30 },
    { hours: 19, minutes: 0 },
    { hours: 19, minutes: 35 },
    { hours: 20, minutes: 0 },
]

class CalendarTable extends Component {
    timeSlotComparer(t1, t2) {
        const { hours: h1, minutes: m1 } = t1;
        const { hours: h2, minutes: m2 } = t2;
        return h1 > h2 ? 1 : h1 < h2 ? -1 : m1 > m2 ? 1 : m1 < m2 ? -1 : 0;
    }

    groupSessions = (sessions) => {
        const timeSlots = DEFAULT_TIME_SLOTS.map(s => ({ ...s, sessions: [] }));
        const groupedSessions = sessions
            .reduce((result, session) => {
                let [hours, minutes] = session.schedule.startTime.split(':');
                hours = parseInt(hours);
                minutes = parseInt(minutes);

                let group = result.find(g => g.hours === hours && g.minutes === minutes);
                if (group) {
                    group.sessions.push(session);
                } else {
                    result.push({
                        hours, minutes, sessions: [session]
                    })
                }

                return result;
            }, timeSlots)
            .sort(this.timeSlotComparer);

        return groupedSessions;
    }

    openCreateModal = ({ date, hours, minutes }) => {
        date = new Date(date.getTime());
        date.setHours(hours);
        date.setMinutes(minutes);

        this.props.toggleCreateModal(date);
    }

    render() {
        const {
            weekdays,
            singleDayMode,
            toggleSessionDetailModal,
            sessions
        } = this.props;

        const groupedSessions = this.groupSessions(sessions);
        return (
            <div>
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                            {weekdays.filter(weekday => singleDayMode ? weekday.selected : true).map(weekday => (
                                <Table.HeaderCell width={2} key={weekday.date.getDate()}>{moment(weekday.date).format('ddd D/M')}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {groupedSessions && groupedSessions.length > 0 && groupedSessions.map(group => (
                            <Table.Row key={group.hours.toString() + group.minutes.toString()}>
                                <Table.Cell>
                                    <div className={styles.CellTime}>
                                        {group.hours.toString().padStart(2, "0") + ':' + group.minutes.toString().padStart(2, "0")}
                                        <br />
                                        - {(group.hours + 1).toString().padStart(2, "0") + ':' + group.minutes.toString().padStart(2, "0")}
                                    </div>
                                </Table.Cell>
                                {
                                    weekdays.filter(weekday => singleDayMode ? weekday.selected : true).map(weekday => {
                                        const day = weekday.date.getDay();

                                        const sessions = group.sessions.filter(session => (new Date(session.date)).getDay() === day);
                                        const haveSessions = !!sessions && sessions.length
                                        if (!haveSessions) {
                                            return (
                                                <HoverableTableCell
                                                    key={day}
                                                    day={day}
                                                    hours={group.hours}
                                                    minutes={group.minutes}
                                                    onClick={() => this.openCreateModal({
                                                        date: weekday.date,
                                                        hours: group.hours,
                                                        minutes: group.minutes
                                                    })}
                                                >
                                                    <p>Tạo<br />lịch học</p>
                                                </HoverableTableCell>
                                            )
                                        }

                                        return (
                                            <Table.Cell
                                                verticalAlign="top"
                                                key={day}
                                                className={styles.TableCell}
                                            >
                                                <Fragment>
                                                    {sessions.map(session => (
                                                        <SessionCard key={session.id} session={session} toggleSessionDetailModal={() => toggleSessionDetailModal(session)} />
                                                    ))}
                                                </Fragment>
                                            </Table.Cell>
                                        )
                                    })
                                }
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sessions: state.sessions
})

export default memo(connect(mapStateToProps)(CalendarTable))