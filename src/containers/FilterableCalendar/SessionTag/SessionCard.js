import React, { Component } from 'react'
import styles from './SessionCard.module.css'

const BRANCH_NAME = {
    'LVS': 'LVS',
    'Q3': 'Q3',
    'PN': 'PN',
}

export default class SessionCard extends Component {
    render() {
        const { session, toggleSessionDetailModal } = this.props;

        let branchClassName = styles.SessionCardRed;
        if (session.schedule.branch === BRANCH_NAME.LVS) {
            branchClassName = styles.SessionCardYellow;
        } else if (session.schedule.branch === BRANCH_NAME.Q3) {
            branchClassName = styles.SessionCardGreen;
        }

        return (
            <div className={`${styles.SessionCard} ${branchClassName}`} onClick={toggleSessionDetailModal}>
                <p className={styles.ClassName}>{session.schedule.className}</p>
                <p className={styles.Song}>{session.schedule.song}</p>
                {/* <br /> */}
                <p className={styles.Info}>{session.sessionNo}/{session.schedule.sessions} - {session.totalRegistered}/20 - {session.schedule.branch}</p>
            </div>
        )
    }
}
