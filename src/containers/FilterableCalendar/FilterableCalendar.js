import React, { Component } from 'react'
import CalendarControls from './CalendarControls/CalendarControls'
import CalendarTable from './CalendarTable/CalendarTable'
import axios from '../../axios';
import moment from 'moment';
import ScheduleForm from './ScheduleForm/ScheduleForm';
import { Loader } from 'semantic-ui-react';

export default class FilterableCalendar extends Component {
    state = {
        weekdays: this.initWeekdays(),
        sessions: [],
        selectedSchedule: null,
        selectedSession: null,
        singleDayMode: false,
        loading: true,
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
        this.fetchSchedules();
    }

    fetchSchedules() {
        const start = this.state.weekdays[0].date.toISOString();
        axios.post('api/schedule/getdetail', { start })
            .then(response => {
                console.log(response);
                if (response && response.data && response.data.scheduleDetails) {
                    const sessions = response.data.scheduleDetails;
                    this.setState({ sessions, loading: false })
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log(error);
            })
    }

    toggleCreateModal = () => {
        this.setState((state) => {
            return { openCreateSchedule: !state.openCreateSchedule };
        });
    }

    toggleViewMode = () => {
        this.setState(state => {
            let weekdays = [...state.weekdays];
            if (!state.singleDayMode) {
                let selectedIndex = weekdays.findIndex(weekday => moment(weekday.date).isSame(new Date(), 'day'));
                selectedIndex = selectedIndex !== -1 ? selectedIndex : 0;
                let selectedWeekday = { ...weekdays[selectedIndex] };
                selectedWeekday.selected = true;
                weekdays[selectedIndex] = selectedWeekday;
            } else {
                let selectedIndex = weekdays.findIndex(weekday => weekday.selected);
                if (selectedIndex !== -1) {
                    let selectedWeekday = { ...weekdays[selectedIndex] }
                    selectedWeekday.selected = false;
                    weekdays[selectedIndex] = selectedWeekday;
                }
            }
            return { singleDayMode: !state.singleDayMode, weekdays }
        })
    }

    handleOnScheduleCreated = sessionsCreated => {
        this.setState(state => {
            return {
                sessions: [...sessionsCreated, ...state.sessions],
                openCreateSchedule: !state.openCreateSchedule
            }
        })
    }

    handleOnWeekNavigating = (isNext) => {
        this.setState(state => {
            const weekdays = state.weekdays.map(weekday => {
                if (isNext) {
                    const date = moment(weekday.date).clone();
                    return {
                        ...weekday,
                        date: date.add(7, 'days').toDate(),
                    }
                } else {
                    const date = moment(weekday.date).clone().subtract(7, 'days').toDate();
                    return {
                        ...weekday,
                        date,
                    }
                }
            });

            return { weekdays, sessions: [], loading: true }
        }, () => this.fetchSchedules());
    }

    render() {
        const { weekdays, sessions, loading, openCreateSchedule, singleDayMode } = this.state;
        return (
            <div>
                <h3>Lịch các lớp</h3>
                <div>
                    <CalendarControls
                        weekdays={weekdays}
                        toggleCreateModal={this.toggleCreateModal}
                        singleDayMode={singleDayMode}
                        toggleViewMode={this.toggleViewMode}
                        handleOnWeekNavigating={this.handleOnWeekNavigating}
                    />
                    {
                        loading ?
                            <Loader active inline='centered'>Loading</Loader> :
                            sessions && <CalendarTable weekdays={weekdays} singleDayMode={singleDayMode} sessions={sessions} />
                    }
                </div>

                <ScheduleForm
                    openCreateSchedule={openCreateSchedule}
                    handleOnScheduleCreated={this.handleOnScheduleCreated}
                    getCreatedSessionsFrom={weekdays[0]}
                    open={openCreateSchedule}
                    onClose={this.toggleCreateModal}
                />
            </div>
        )
    }
}
