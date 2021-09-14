import React, { Component, Fragment } from 'react'
import { Button, Grid, Modal, Input, Icon, Table, Label, Loader, Dimmer } from 'semantic-ui-react'
import { history } from '../../..';
import moment from 'moment';
import axios from '../../../axios'
import { RegistrationStatus } from '../../../enums/enums';
import { updateItem } from '../../../utils/utils';

export default class SessionDetail extends Component {
    state = {
        search: '',
        usersFound: null,
        registrations: [],
        loading: {
            search: false,
            sessions: true,
            registerSession: false,
            confirmRegistration: false,
            cancelRegistration: false
        },
        target: {
            confirmRegistrationId: null,
            cancelRegistrationId: null,
            userFoundId: null
        }
    }

    setLoading = (attributes) => {
        this.setState({ loading: { ...this.state.loading, ...attributes } })
    }

    setTarget = (attributes) => {
        this.setState({ target: { ...this.state.target, ...attributes } })
    }

    componentDidMount() {
        const session = this.props.location && this.props.location.state && this.props.location.state.session;

        if (session) {
            const data = JSON.stringify(session.id);
            axios.post('api/registration/getbyscheduledetail', data, { headers: { 'Content-Type': 'application/json' } })
                .then(response => {
                    console.log(response);
                    if (response && response.data) {
                        const registrations = response.data;
                        this.setState({ registrations });
                    }
                })
                .catch(err => console.log(err))
                .finally(() => {
                    this.setLoading({ sessions: false });
                });
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

        this.setLoading({ registerSession: true });
        this.setTarget({ userFoundId: userId });
        axios.post('api/registration/create', data)
            .then(response => {
                console.log(response);
                if (response && response.data && response.data.registration) {
                    const { registration } = response.data;
                    this.setState({ registrations: [...this.state.registrations, registration], usersFound: null });
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setLoading({ registerSession: false });
                this.setTarget({ userFoundId: null });
            });
    }

    confirmRegistration = registrationId => {
        this.setLoading({ confirmRegistration: true });
        this.setTarget({ confirmRegistrationId: registrationId });
        axios.put('api/registration/confirmAttendance/' + registrationId)
            .then(response => {
                console.log(response);
                if (response && response.status === 204) {
                    const updatedRegistrations = updateItem(this.state.registrations, registrationId, { status: { value: RegistrationStatus.Attended, name: 'Đến lớp' } });
                    this.setState({ registrations: updatedRegistrations });
                }
            })
            .catch(error => console.log(error))
            .finally(() => {
                this.setLoading({ confirmRegistration: false });
                this.setTarget({ confirmRegistrationId: null });
            });
    }

    cancelRegistration = registrationId => {
        this.setLoading({ cancelRegistration: true });
        this.setTarget({ cancelRegistrationId: registrationId });
        axios.post('api/registration/cancel', { registrationId })
            .then(response => {
                console.log(response);
                if (response && response.data) {
                    this.setState({
                        registrations: [...this.state.registrations.filter(x => x.id !== registrationId)]
                    });
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setLoading({ cancelRegistration: false });
                this.setTarget({ cancelRegistrationId: null });
            })
    }

    search = () => {
        const { search } = this.state;
        if (!search) return;

        this.setLoading({ search: true });
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
            .finally(() => {
                this.setLoading({ search: false });
            })
    }

    render() {
        const {
            session
        } = this.props.location.state;

        const { schedule } = session;
        const date = moment(session.date).format('ddd DD/MM/YYYY hh:mm');

        const { usersFound, registrations, loading, target } = this.state;

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
                                            <Button size="mini" loading={loading.registerSession && user.id === target.userFoundId} onClick={() => this.registerSession(user.id)}>Đăng ký</Button>
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
                            <p><b>{registrations.length}</b></p>
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
                                            <Button disabled={loading.search} loading={loading.search} color="red" size="mini" icon onClick={this.hideSearchResults}>
                                                <Icon name="close" />
                                            </Button>
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                                {searchResults}
                                {
                                    loading.sessions ?
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Dimmer active inverted>
                                                    <Loader inline='centered' inverted>Loading</Loader>
                                                </Dimmer>
                                            </Grid.Column>
                                        </Grid.Row> :
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
                                                                                    <Button
                                                                                        loading={loading.confirmRegistration && registration.id === target.confirmRegistrationId}
                                                                                        size="mini" 
                                                                                        icon 
                                                                                        onClick={() => this.confirmRegistration(registration.id)}
                                                                                    >
                                                                                        <Icon name="check" /> Đến lớp
                                                                                    </Button>
                                                                                    <Button
                                                                                        loading={loading.cancelRegistration && registration.id === target.cancelRegistrationId} 
                                                                                        size="mini"
                                                                                        icon
                                                                                        onClick={() => this.cancelRegistration(registration.id)}
                                                                                    >
                                                                                        <Icon name="close" /> Hủy
                                                                                    </Button>
                                                                                </Fragment> :
                                                                                <Label>
                                                                                    <Icon name="check" /> {registration.status.name}
                                                                                </Label>
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
