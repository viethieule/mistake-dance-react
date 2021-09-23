import React, { Component, Fragment } from 'react'
import { Table } from 'semantic-ui-react'
import SessionCard from '../SessionTag/SessionCard'
import moment from 'moment'
import styles from './CalendarTable.module.css'

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

export default class CalendarTable extends Component {
    state = {
        cellEntered: {
            day: null, hours: null, minutes: null
        }
    }
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

    handleMouseEnterCell = (cellDatetimeData) => {
        this.setState({ cellEntered: cellDatetimeData })
    }

    handleMouseLeaveCell = () => {
        this.setState({ cellEntered: {} })
    }

    openCreateModal = ({ date, hours, minutes, haveSessions }) => {
        if (haveSessions) {
            return;
        }

        date = new Date(date.getTime());
        date.setHours(hours);
        date.setMinutes(minutes);

        this.props.toggleCreateModal(date);
    }

    render() {
        const { 
            weekdays, 
            singleDayMode, 
            toggleSessionDetailModal
        } = this.props;

        const { cellEntered } = this.state;

        const groupedSessions = this.groupSessions(this.props.sessions);
        return (
            <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            {weekdays.filter(weekday => singleDayMode ? weekday.selected : true).map(weekday => (
                                <Table.HeaderCell key={weekday.date.getDate()}>{moment(weekday.date).format('ddd D/M')}</Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {groupedSessions && groupedSessions.length > 0 && groupedSessions.map(group => (
                            <Table.Row key={group.hours.toString() + group.minutes.toString()}>
                                <Table.Cell textAlign="center">
                                    {group.hours.toString().padStart(2, "0") + ':' + group.minutes.toString().padStart(2, "0")}
                                    <br />
                                    - {(group.hours + 1).toString().padStart(2, "0") + ':' + group.minutes.toString().padStart(2, "0")}
                                </Table.Cell>
                                {
                                    weekdays.filter(weekday => singleDayMode ? weekday.selected : true).map(weekday => {
                                        const day = weekday.date.getDay();
                                        const sessions = group.sessions.filter(session => (new Date(session.date)).getDay() === day);
                                        const isHovered = !!cellEntered && day === cellEntered.day && group.hours === cellEntered.hours && group.minutes === cellEntered.minutes;
                                        
                                        let card = null;
                                        let textAlign = null;
                                        let verticalAlign = null;
                                        const haveSessions = !!sessions && sessions.length
                                        if (haveSessions) {
                                            card = (
                                                <Fragment>
                                                    {sessions.map(session => (
                                                        <SessionCard key={session.id} session={session} toggleSessionDetailModal={() => toggleSessionDetailModal(session)} />
                                                    ))}
                                                </Fragment>
                                            )
                                        } else if (isHovered) {
                                            card = <p>Tạo<br/>lịch học</p>
                                            textAlign = 'center'
                                            verticalAlign = 'middle'
                                        }

                                        return (
                                            <Table.Cell 
                                                verticalAlign={verticalAlign} 
                                                textAlign={textAlign} 
                                                key={day} 
                                                onMouseEnter={() => this.handleMouseEnterCell({ day, hours: group.hours, minutes: group.minutes })} 
                                                onMouseLeave={() => this.handleMouseLeaveCell()}
                                                onClick={() => this.openCreateModal({ 
                                                    date: weekday.date, 
                                                    hours: group.hours, 
                                                    minutes: group.minutes, 
                                                    haveSessions 
                                                })}
                                                className={styles.TableCell}
                                            >
                                                {card}
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
