import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import CalendarControls from './CalendarControls/CalendarControls'
import CalendarTable from './CalendarTable/CalendarTable'
import axios from '../../axios';
import moment from 'moment';
import ScheduleForm from './ScheduleForm/ScheduleForm';

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

export default class FilterableCalendar extends Component {
    state = {
        weekdays: this.initWeekdays(),
        groupedSessions: [],
        selectedSchedule: null,
        selectedSession: null,
        singleDayMode: false,

        openCreateSchedule: false,
    }

    initWeekdays() {
        const currentDate = moment(new Date());
        const weekStart = currentDate.clone().startOf('isoWeek');

        const weekdays = [];
        for (var i = 0; i <= 6; i++) {
            const date = moment(weekStart).add(i, 'days');
            weekdays.push({
                date: date.toDate(),
                selected: false
            });
        }

        return weekdays;
    }

    componentDidMount() {
        const start = this.state.weekdays[0].date.toISOString();
        axios.post('api/schedule/getdetail', { start })
            .then(response => {
                console.log(response);
                if (response && response.data && response.data.scheduleDetails) {
                    const timeSlots = DEFAULT_TIME_SLOTS.map(s => ({ ...s, sessions: [] }));
                    const sessions = response.data.scheduleDetails;
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

                    this.setState({
                        groupedSessions
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    timeSlotComparer(t1, t2) {
        const { hours: h1, minutes: m1 } = t1;
        const { hours: h2, minutes: m2 } = t2;
        return h1 > h2 ? 1 : h1 < h2 ? -1 : m1 > m2 ? 1 : m1 < m2 ? -1 : 0;
    }

    toggleCreateModal = () => {
        this.setState((state) => {
            return { openCreateSchedule: !state.openCreateSchedule };
        });
    }

    render() {
        const { weekdays, groupedSessions, openCreateSchedule } = this.state;
        return (
            <div>
                <h3>Lịch các lớp</h3>
                <div>
                    <CalendarControls weekdays={weekdays} toggleCreateModal={this.toggleCreateModal} />
                    <CalendarTable weekdays={weekdays} groupedSessions={groupedSessions} />
                </div>
                <ScheduleForm openCreateSchedule={openCreateSchedule} open={openCreateSchedule} onClose={this.toggleCreateModal} />
            </div>
        )
    }
}
