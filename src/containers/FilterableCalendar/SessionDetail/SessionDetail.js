import React, { Component, Fragment } from 'react'
import { Button, Grid, Modal, Input, Icon, Table, Label } from 'semantic-ui-react'
import { history } from '../../..';
import moment from 'moment';
import axios from '../../../axios'
import { RegistrationStatus } from '../../../enums/enums';

export default class SessionDetail extends Component {
    state = {
        search: '',
        usersFound: null,
        registrations: []
    }

    componentDidMount() {
        const session = this.props.location && this.props.location.state && this.props.location.state.session;

        if (session) {
            const data = JSON.stringify(session.id);
            axios.post('api/registration/getbyscheduledetail', data, { headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                    console.log(response);
                    if (response && response.data) {
                        const registrations = response.data
                        this.setState({ registrations })
                    }
                })
                .catch(err => console.log(err));
        }
    }

    searchOnChange = (e) => {
        this.setState({ search: e.target.value })
    }

    hideSearchResults = () => {
        this.setState({ usersFound: null })
    }

    registerSession = (userId) => {
        const { session } = this.props.location.state;
        const data = {
            registration: {
                scheduleDetailId: session.id,
                userId
            }
        };
        axios.post('api/registration/create', data)
            .then(response => {
                console.log(response);
                if (response && response.data && response.data.registration) {
                    const { registration } = response.data;
                    this.setState({ registration: [...this.state.registrations, registration] });
                }
            })
            .catch(err => console.log(err));
    }

    confirmRegistration = registrationId => {
        axios.put('api/registration/confirmAttendance/' + registrationId)
            .then(response => {
                console.log(response);
                if (response && response.status === 200) {
                    
                }
            })
            .catch(error => console.log(error))
    }

    cancelRegistration = registrationId => {
        axios.post('api/registration/cancel', { registrationId })
            .then(response => {
                console.log(response);
                if (response && response.data) {

                }
            })
    }

    search = () => {
        const { search } = this.state;
        if (!search) return;

        axios.post('api/user/searchMember', { query: this.state.search })
            .then((response) => {
                console.log(response);
                if (response && response.data && response.data.members) {
                    const usersFound = response.data.members;
                    this.setState({ usersFound })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const {
            session
        } = this.props.location.state;

        const { schedule } = session;
        const date = moment(session.date).format('ddd DD/MM/YYYY hh:mm');

        const { usersFound, registrations } = this.state;

        let searchResults;
        if (!usersFound) {
            searchResults = null;
        } else if (usersFound.length === 0) {
            searchResults = (
                <Grid.Row>
                    <Grid.Column><p>Không tìm thấy hội viên nào</p></Grid.Column>
                </Grid.Row>
            )
        } else {
            searchResults = (
                <Grid.Row>
                    <Grid.Column>
                        <Table>
                            <Table.Body>
                                {usersFound.map(user => (
                                    <Table.Row key={user.id}>
                                        <Table.Cell>{user.fullName}</Table.Cell>
                                        <Table.Cell>{user.userName}</Table.Cell>
                                        <Table.Cell>{user.phoneNumber}</Table.Cell>
                                        <Table.Cell>
                                            <Button size="mini" onClick={() => this.registerSession(user.id)}>Đăng ký</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            )
        }

        return (
            <Modal open={true}>
                <Modal.Header>{schedule.className} - {date}</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Column width={4}>
                            <label>Bài múa</label>
                            <p><b>{schedule.song}</b></p>
                            <label>Buổi</label>
                            <p><b>{session.sessionNo} / {schedule.sessions}</b></p>
                            <label>Buổi / tuần</label>
                            <p><b>{schedule.daysPerWeekString}</b></p>
                            <label>Thời gian</label>
                            <p><b>{date}</b></p>
                            <label>Địa điểm</label>
                            <p><b>{schedule.branch}</b></p>
                            <label>Giáo viên</label>
                            <p><b>{schedule.trainer.name}</b></p>
                            <label>Số học viên đăng ký</label>
                            <p><b>{session.totalRegistered}</b></p>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={10}>
                                        <label>Danh sách đăng ký</label>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <Input
                                            onChange={this.searchOnChange}
                                            icon={<Icon name="search" circular link onClick={this.search} />}
                                            placeholder="Tim kiếm..."
                                            size="mini"
                                            fluid={!usersFound}
                                        />
                                        {' '}
                                        {!!usersFound &&
                                            <Button color="red" size="mini" icon onClick={this.hideSearchResults}>
                                                <Icon name="close" />
                                            </Button>
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                                {searchResults}
                                {
                                    registrations.length > 0 ?
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Table>
                                                    <Table.Body>
                                                        {registrations.map((registration, index) => (
                                                            <Table.Row key={registration.id}>
                                                                <Table.Cell>{index + 1}</Table.Cell>
                                                                <Table.Cell>{registration.user.fullName}</Table.Cell>
                                                                <Table.Cell>
                                                                    {
                                                                        registration.status.value === RegistrationStatus.Registered ?
                                                                            <Fragment>
                                                                                <Button size="mini" icon onClick={() => this.confirmRegistration(registration.id)}><Icon name="check" /> Đến lớp</Button>
                                                                                <Button size="mini" icon onClick={() => this.cancelRegistration(registration.id)}><Icon name="close" /> Hủy</Button>
                                                                            </Fragment> :
                                                                            <Label><Icon name="check" /> {registration.status.name}</Label>
                                                                    }
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table>
                                            </Grid.Column>
                                        </Grid.Row> :
                                        null
                                }
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => history.goBack()}>
                        Đóng
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
