import React, { Component } from 'react'
import { Button, Grid, Modal, Input, Icon } from 'semantic-ui-react'
import { history } from '../../..';
import moment from 'moment';
import axios from '../../../axios'

export class TextInput extends Component {

}

export default class SessionDetail extends Component {
    state = {
        search: '',
        usersFound: null,
        registrations: []
    }

    componentDidMount() {
        const session = this.props.location && this.props.location.state && this.props.location.state.session;

        if (session) {
            axios.post('api/registration/getbyscheduledetail', { '': session.id })
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

        return (
            <Modal
                open={true}
            >
                <Modal.Header>{schedule.className} - {date}</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Column width={4}>
                            <label basic>Bài múa</label>
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
                                        <Input onChange={this.searchOnChange} icon={<Icon name="search" circular link onClick={this.search} />} placeholder="Tim kiếm..." />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>

                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => history.goBack()}>
                        Đóng
                    </Button>
                    {/* <Button
                        content="Yep, that's me"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={}
                        positive
                    /> */}
                </Modal.Actions>
            </Modal>
        )
    }
}
