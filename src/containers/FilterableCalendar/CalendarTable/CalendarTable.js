import React, { Component, Fragment } from 'react'
import { Table } from 'semantic-ui-react'
import SessionCard from '../SessionTag/SessionCard'
import moment from 'moment'

export default class CalendarTable extends Component {
    render() {
        const { groupedSessions, weekdays } = this.props;
        return (
            <div>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            {weekdays.map(weekday => (
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
                                    weekdays.map(weekday => {
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
