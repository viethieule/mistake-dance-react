import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import styles from './Layout.module.css'

class Layout extends Component {
    state = {
        sidebarCollapsed: false
    }

    toggleSidebar = () => {
        this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed })
    }

    render() {
        const { sidebarCollapsed } = this.state;
        return (
            <div>
                <Menu fixed="top">
                    <Menu.Item link header className={styles.Logo + ' ' + (sidebarCollapsed ? styles.LogoCollapsed : '')}>
                        <Link to="/">
                            {sidebarCollapsed ? 'MD' : 'Mistake Dance'}
                        </Link>
                    </Menu.Item>
                    <Menu.Item link onClick={this.toggleSidebar}>
                        <Icon name="bars" />
                    </Menu.Item>
                </Menu>
                <Sidebar.Pushable className={styles.SideBarPushable}>
                    <Sidebar
                        as={Menu}
                        animation="overlay"
                        visible
                        vertical
                        inverted
                        width="thin"
                        className={styles.SideBar + ' ' + (sidebarCollapsed ? styles.SideBarCollapsed : '')}
                    >
                        <Menu.Item as="a">
                            <Icon name="calendar outline" className={styles.MenuItemIcon} />{!sidebarCollapsed ? 'Lịch học' : ''}
                        </Menu.Item>
                        <Menu.Item as="a">
                            <Icon name="gamepad" className={styles.MenuItemIcon} />{!sidebarCollapsed ? 'Game' : ''}
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher className={styles.SideBarPusher + ' ' + (!sidebarCollapsed ? styles.SideBarPusherCollapsed : styles.SideBarPusherExpanded)}>
                        {this.props.children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div >
        )
    }
}

export default Layout;