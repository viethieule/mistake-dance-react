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
    state = {
        session: {
            id: '',
            className: '',
            song: '',
            openingDate: '',
            startTime: '',
            weekdays: [],
            sessions: '',
            trainer: '',
            branch: ''
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
            trainerId: values.trainer,
            startTime: '09:00'
        }

        const getCreatedSessionsFrom = this.props.getCreatedSessionsFrom.date.toISOString();

        axios.post('api/schedule/create', { schedule, getCreatedSessionsFrom })
            .then(response => {
                if (response && response.data && response.data.sessions) {
                    this.props.handleOnScheduleCreated(response.data.sessions);
                }
            })
            .catch(error => console.error(error))
    }

    render() {
        const { session } = this.state;
        const { open, onClose } = this.props;
        return (
            <Modal
                open={open}
            >
                <Modal.Header>Tạo lịch học</Modal.Header>
                <FinalForm
                    initialValues={session}
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
                                            value={session.className}
                                            options={'api/class/dropdown'}
                                            component={SelectInput}
                                        />
                                        <Field
                                            name="song"
                                            label="Bài múa"
                                            width={8}
                                            value={session.song}
                                            component={TextInput}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Field
                                            name="openingDate"
                                            label="Ngày bắt đầu"
                                            width={6}
                                            value={session.openingDate}
                                            component={DateInput}
                                            date={1}
                                            time={0}
                                        />
                                        <Field
                                            name="startTime"
                                            label="Giờ"
                                            width={6}
                                            value={session.startTime}
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
                                            value={session.sessions}
                                            component={TextInput}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Field
                                            name="trainer"
                                            label="Giáo viên"
                                            width={6}
                                            value={session.traner}
                                            options={'api/trainer/dropdown'}
                                            component={SelectInput}
                                        />
                                        <Field
                                            name="branch"
                                            label="Chi nhánh"
                                            width={3}
                                            value={session.branch}
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
