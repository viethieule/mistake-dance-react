import React, { Component } from 'react'
import CalendarControls from './CalendarControls/CalendarControls'
import CalendarTable from './CalendarTable/CalendarTable'
import axios from '../../axios';
import moment from 'moment';
import ScheduleForm from './ScheduleForm/ScheduleForm';
import { Container, Loader } from 'semantic-ui-react';
import { history } from '../../';
import { Route } from 'react-router';
import SessionDetail from './SessionDetail/SessionDetail';
import styles from './FilterableCalendar.module.css'

export default class FilterableCalendar extends Component {
    state = {
        weekdays: this.initWeekdays(),
        sessions: [],
        selectedSession: null,
        singleDayMode: false,
        loading: true,
        openCreateSchedule: false,
        selectedDateTimeForCreate: null
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
        const end = this.state.weekdays[6].date.toISOString();
        axios.get(`api/schedules/sessions/?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
            .then(response => {
                console.log(response);
                if (response && response.data) {
                    const sessions = response.data;
                    this.setState({ sessions, loading: false })
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                console.log(error);
            })
    }

    toggleCreateModal = (date) => {
        this.setState(state => {
            const newState = { openCreateSchedule: !state.openCreateSchedule };
            if (!state.openCreateSchedule) {
                newState.selectedDateTimeForCreate = date;
            }
            return newState;
        });
    }

    handleEditSchedule = () => {
        this.setState({ openCreateSchedule: true })
    }

    toggleSessionDetailModal = (session) => {
        this.setState({ selectedSession: session });
        history.push('/sessions/' + session.id);
    }

    handleCloseSessionDetailModal = () => {
        history.goBack();
        this.setState({ selectedSession: null });
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

    buildScheduleFormKey = () => {
        const { selectedSession: session, selectedDateTimeForCreate } = this.state;
        if (session) {
            return session.id;
        } else if (selectedDateTimeForCreate) {
            return selectedDateTimeForCreate.getTime();
        }

        return null;
    }

    handlePostDeleteSchedule = () => {
        this.setState({ sessions: [...this.state.sessions.filter(x => x.schedule.id !== this.state.selectedSession.schedule.id)] });
        this.handleCloseSessionDetailModal();
    }

    handlePostDeleteSession = () => {
        this.setState({
            sessions: [...this.state.sessions.filter(x =>
                x.schedule.id !== this.state.selectedSession.schedule.id ||
                (x.schedule.id === this.state.selectedSession.schedule.id && x.sessionNo < this.state.selectedSession.sessionNo)
            )]
        });
        this.handleCloseSessionDetailModal();
    }

    render() {
        const { weekdays, sessions, loading, openCreateSchedule, singleDayMode, selectedDateTimeForCreate, selectedSession } = this.state;
        const scheduleFormKey = this.buildScheduleFormKey();
        return (
            <div>
                <Container className={styles.Container}>
                    <h3>Lịch các lớp</h3>
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
                                toggleCreateModal={this.toggleCreateModal}
                            />
                    }
                </Container>

                <ScheduleForm
                    handleOnScheduleCreated={this.handleOnScheduleCreated}
                    getCreatedSessionsFrom={weekdays[0]}
                    open={openCreateSchedule}
                    onClose={this.toggleCreateModal}
                    datetime={selectedDateTimeForCreate}
                    session={selectedSession}
                    key={scheduleFormKey}
                />

                <Route path="/sessions/:id" render={routeProps => (
                    <SessionDetail
                        session={selectedSession}
                        onEdit={this.handleEditSchedule}
                        onClose={this.handleCloseSessionDetailModal}
                        handlePostDeleteSchedule={this.handlePostDeleteSchedule}
                        handlePostDeleteSession={this.handlePostDeleteSession}
                        {...routeProps}
                    />
                )} />
            </div>
        )
    }
}
