import React, { Component } from 'react'
import CalendarControls from './CalendarControls/CalendarControls'
import CalendarTable from './CalendarTable/CalendarTable'
import axios from '../../axios';
import moment from 'moment';
import ScheduleForm from './ScheduleForm/ScheduleForm';
import { Loader } from 'semantic-ui-react';
import { history } from '../../';

export default class FilterableCalendar extends Component {
    state = {
        weekdays: this.initWeekdays(),
        sessions: [],
        selectedSchedule: null,
        selectedSession: null,
        singleDayMode: false,
        loading: true,
        openCreateSchedule: false
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

    toggleSessionDetailModal = (session) => {
        history.push('/sessions/' + session.id, {
            session
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

    isFetchSchedulesOnWeekNavigating(isNext) {
        const selectedDayIndex = this.state.weekdays.findIndex(x => x.selected);
        const isNotFetch = this.state.singleDayMode && (
            (!isNext && selectedDayIndex > 0) ||
            (isNext && selectedDayIndex < this.state.weekdays.length - 1)
        );
        return !isNotFetch;
    }

    handleOnWeekNavigating = (isNext) => {
        const isFetch = this.isFetchSchedulesOnWeekNavigating(isNext);
        this.setState(state => {
            if (isFetch) {
                const weekdays = state.weekdays.map((weekday, index, arr) => {
                    if (isNext) {
                        const date = moment(weekday.date).clone().add(7, 'days').toDate();
                        return {
                            date,
                            selected: state.singleDayMode && index === 0
                        }
                    } else {
                        const date = moment(weekday.date).clone().subtract(7, 'days').toDate();
                        return {
                            date,
                            selected: state.singleDayMode && index === arr.length - 1
                        }
                    }
                });

                return { weekdays, sessions: [], loading: true }
            } else {
                const weekdays = [...state.weekdays];
                const selectedDayIndex = weekdays.findIndex(x => x.selected);
                const selectedDay = { ...weekdays[selectedDayIndex], selected: false };
                const nextSelectedDay = { ...weekdays[selectedDayIndex + (isNext ? 1 : -1)], selected: true };
                weekdays[selectedDayIndex] = selectedDay;
                weekdays[selectedDayIndex + (isNext ? 1 : -1)] = nextSelectedDay;
                return { weekdays }
            }
        }, () => {
            if (isFetch) {
                this.fetchSchedules()
            }
        });
    }

    handleOnSelectWeekday = (dayIndex) => {
        const updatedState = {};
        if (!this.state.singleDayMode) {
            updatedState.singleDayMode = true;
        }

        const weekdays = [...this.state.weekdays];
        let incomingSelectedDay;
        const currentSelectedDayIndex = weekdays.findIndex(x => x.selected);
        if (currentSelectedDayIndex === -1) {
            incomingSelectedDay = { ...weekdays[dayIndex], selected: true };
        } else if (currentSelectedDayIndex !== dayIndex) {
            incomingSelectedDay = { ...weekdays[dayIndex], selected: true };
            weekdays[currentSelectedDayIndex] = { ...weekdays[currentSelectedDayIndex], selected: false };
        }

        if (incomingSelectedDay) {
            weekdays[dayIndex] = incomingSelectedDay;
            updatedState.weekdays = weekdays;
        }

        this.setState(updatedState);
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
                        handleOnSelectWeekday={this.handleOnSelectWeekday}
                    />
                    {
                        loading ?
                            <Loader active inline='centered'>Loading</Loader> :
                            sessions && <CalendarTable
                                weekdays={weekdays}
                                singleDayMode={singleDayMode}
                                sessions={sessions} 
                                toggleSessionDetailModal={this.toggleSessionDetailModal}
                            />
                    }
                </div>

                <ScheduleForm
                    handleOnScheduleCreated={this.handleOnScheduleCreated}
                    getCreatedSessionsFrom={weekdays[0]}
                    open={openCreateSchedule}
                    onClose={this.toggleCreateModal}
                />
            </div>
        )
    }
}
