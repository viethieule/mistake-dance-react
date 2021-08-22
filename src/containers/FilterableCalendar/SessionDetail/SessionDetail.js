import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class SessionDetail extends Component {
    render() {
        const {
            open,
            onClose
        } = this.props;
        return (
            <Modal
                open={open}
            >
                <Modal.Header></Modal.Header>
                <Modal.Content>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={onClose}>
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
