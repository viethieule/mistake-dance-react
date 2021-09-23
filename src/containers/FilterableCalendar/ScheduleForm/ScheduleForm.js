import React, { Component, Fragment } from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'
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
            case 0: return "Chủ nhật";
            default: return "Thứ " + (index + 1);
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
            <Modal
                open={open}
            >
                <Modal.Header>{schedule.id ? 'Sửa' : 'Tạo'} lịch học</Modal.Header>
                <FinalForm
                    initialValues={schedule}
                    onSubmit={this.handleFormSubmit}
                    render={({ handleSubmit }) => (
                        <Fragment>
                            <Modal.Content>
                                <Form>
                                    <Form.Group>
                                        <Field
                                            name="className"
                                            label="Lớp"
                                            width={6}
                                            value={schedule.className}
                                            options={'api/class/dropdown'}
                                            component={SelectInput}
                                        />
                                        <Field
                                            name="song"
                                            label="Bài múa"
                                            width={8}
                                            value={schedule.song}
                                            component={TextInput}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Field
                                            name="openingDate"
                                            label="Ngày bắt đầu"
                                            width={6}
                                            value={schedule.openingDate}
                                            component={DateInput}
                                            date={1}
                                            time={0}
                                        />
                                        <Field
                                            name="startTime"
                                            label="Giờ"
                                            width={6}
                                            value={schedule.startTime}
                                            component={TimeInput}
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
                                                />
                                            ))
                                        }
                                        <Field
                                            name="sessions"
                                            label="Tổng số buổi"
                                            width={2}
                                            value={schedule.sessions}
                                            component={TextInput}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Field
                                            name="trainer"
                                            label="Giáo viên"
                                            width={6}
                                            value={schedule.trainer}
                                            options={'api/trainer/dropdown'}
                                            component={SelectInput}
                                        />
                                        <Field
                                            name="branch"
                                            label="Chi nhánh"
                                            width={3}
                                            value={schedule.branch}
                                            options={'api/branch/dropdown'}
                                            component={SelectInput}
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
        )
    }
}
