import React, { Component } from 'react'

export default class SessionCard extends Component {
    render() {
        const { session, toggleSessionDetailModal } = this.props;
        return (
            <div onClick={toggleSessionDetailModal}>
                <p>{session.schedule.className}</p>
                <p>{session.schedule.song}</p>
                <br />
                <p>1/6 - 0/20 - LVS</p>
            </div>
        )
    }
}
