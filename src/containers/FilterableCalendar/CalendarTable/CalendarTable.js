import React, { Component, Fragment } from 'react'
import { Table } from 'semantic-ui-react'
import SessionCard from '../SessionTag/SessionCard'
import moment from 'moment'

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

    render() {
        const { weekdays, singleDayMode } = this.props;
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
                                <Table.Cell>
                                    {group.hours.toString() + ':' + group.minutes.toString()} - {(group.hours + 1).toString() + ':' + group.minutes.toString()}
                                </Table.Cell>
                                {
                                    weekdays.filter(weekday => singleDayMode ? weekday.selected : true).map(weekday => {
                                        const day = weekday.date.getDay();
                                        const sessions = group.sessions.filter(session => (new Date(session.date)).getDay() === day);
                                        
                                        let card = null;
                                        if (sessions && sessions.length) {
                                            card = (
                                                <Fragment>
                                                    {sessions.map(session => (
                                                        <SessionCard key={session.id} session={session} />
                                                    ))}
                                                </Fragment>
                                            )
                                        }

                                        return (
                                            <Table.Cell key={day}>
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
