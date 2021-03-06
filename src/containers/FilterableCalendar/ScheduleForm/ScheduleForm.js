import React, { Component, Fragment } from 'react'
import { Button, Form, Modal, TransitionablePortal } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'
import SelectInput from '../../../components/form/SelectInput';
import TextInput from '../../../components/form/TextInput';
import DateInput from '../../../components/form/DateInput';
import CheckboxInput from '../../../components/form/CheckboxInput';
import moment from 'moment';
import axios from '../../../axios';
import TimeInput from '../../../components/form/TimeInput';

export default class ScheduleForm extends Component {
    constructor(props) {
        super(props);

        if (props.session) {
            const { schedule } = props.session;
            this.state = {
                schedule: {
                    id: schedule.id,
                    className: schedule.classId.toString(),
                    song: schedule.song,
                    openingDate: new Date(schedule.openingDate),
                    startTime: schedule.startTime,
                    weekdays: schedule.daysPerWeek.split('').map(x => parseInt(x)).sort(),
                    sessions: schedule.sessions,
                    trainer: schedule.trainerId.toString(),
                    branch: schedule.branch
                }
            }
        } else {
            const { datetime: selectedDatetime } = props;
            const startTime = selectedDatetime ? moment(selectedDatetime).format('HH:mm') : '';
            const weekdays = selectedDatetime ? [selectedDatetime.getDay()] : [];
            const openingDate = selectedDatetime ? selectedDatetime : new Date();

            this.state = {
                schedule: {
                    id: '',
                    className: '',
                    song: '',
                    openingDate,
                    startTime,
                    weekdays,
                    sessions: '',
                    trainer: '',
                    branch: ''
                }
            }
        }
    }

    getLocalizedDay = (index) => {
        switch (index) {
            case 0: return "Ch??? nh???t";
            default: return "Th??? " + (index + 1);
        }
    }

    handleFormSubmit = (values) => {
        const schedule = {
            ...values,
            openingDate: moment(values.openingDate).format('MM-DD-YYYY'),
            daysPerWeek: values.weekdays.sort().join(''),
            classId: values.className,
            className: null,
            trainerId: values.trainer
        }

        const { session } = this.props;
        if (session) {
            axios.post('api/schedule/update', { schedule, selectedScheduleDetailId: session.id })
                .then(response => {
                    console.log(response);
                })
                .catch(err => console.log(err));
        } else {
            const getCreatedSessionsFrom = this.props.getCreatedSessionsFrom.date.toISOString();
            axios.post('api/schedule/create', { schedule, getCreatedSessionsFrom })
                .then(response => {
                    if (response && response.data && response.data.sessions) {
                        this.props.handleOnScheduleCreated(response.data.sessions);
                    }
                })
                .catch(error => console.error(error))
        }
    }

    render() {
        const { schedule } = this.state;
        const { open, onClose } = this.props;
        return (
            <TransitionablePortal open={open} transition={{ animation: 'fade', duration: 300 }}>
                <Modal
                    open={open}
                >
                    <Modal.Header>{schedule.id ? 'S???a' : 'T???o'} l???ch h???c</Modal.Header>
                    <FinalForm
                        initialValues={schedule}
                        onSubmit={this.handleFormSubmit}
                        subscription={{
                            submitting: true,
                            pristine: true,
                        }}
                        render={({ handleSubmit }) => (
                            <Fragment>
                                <Modal.Content>
                                    <Form>
                                        <Form.Group>
                                            <Field
                                                name="className"
                                                label="L???p"
                                                width={6}
                                                value={schedule.className}
                                                options={'api/class/dropdown'}
                                                component={SelectInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                            <Field
                                                name="song"
                                                label="B??i m??a"
                                                width={8}
                                                value={schedule.song}
                                                component={TextInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Field
                                                name="openingDate"
                                                label="Ng??y b???t ?????u"
                                                width={6}
                                                value={schedule.openingDate}
                                                component={DateInput}
                                                date={1}
                                                time={0}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                            <Field
                                                name="startTime"
                                                label="Gi???"
                                                width={6}
                                                value={schedule.startTime}
                                                component={TimeInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            {
                                                [...Array(7).keys()].map(key => (
                                                    <Field
                                                        key={key}
                                                        name={"weekdays"}
                                                        label={this.getLocalizedDay(key)}
                                                        width={2}
                                                        value={key}
                                                        type="checkbox"
                                                        component={CheckboxInput}
                                                        subscription={{
                                                            touched: true,
                                                            error: true,
                                                            value: true,
                                                        }}
                                                    />
                                                ))
                                            }
                                            <Field
                                                name="sessions"
                                                label="T???ng s??? bu???i"
                                                width={2}
                                                value={schedule.sessions}
                                                component={TextInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Field
                                                name="trainer"
                                                label="Gi??o vi??n"
                                                width={6}
                                                value={schedule.trainer}
                                                options={'api/trainer/dropdown'}
                                                component={SelectInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                            <Field
                                                name="branch"
                                                label="Chi nh??nh"
                                                width={3}
                                                value={schedule.branch}
                                                options={'api/branch/dropdown'}
                                                component={SelectInput}
                                                subscription={{
                                                    touched: true,
                                                    error: true,
                                                    value: true,
                                                }}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color="black" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        content="Done"
                                        type="submit"
                                        labelPosition="right"
                                        icon="checkmark"
                                        onClick={handleSubmit}
                                        positive
                                    />
                                </Modal.Actions>
                            </Fragment>
                        )}
                    />
                </Modal>
            </TransitionablePortal>
        )
    }
}
