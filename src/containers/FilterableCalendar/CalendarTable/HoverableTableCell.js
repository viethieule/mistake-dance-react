import React, { useState } from 'react'
import { Table } from 'semantic-ui-react'
import styles from './CalendarTable.module.css'

const HoverableTableCell = ({ day, hours, minutes, children: hoveredChildren, ...props }) => {
    const [cellEntered, setCellEntered] = useState({
        day: null, hours: null, minutes: null
    });

    const isHovered = day === cellEntered.day && hours === cellEntered.hours && minutes === cellEntered.minutes;

    return (
        <Table.Cell
            textAlign="center"
            verticalAlign="middle"
            onMouseEnter={() => setCellEntered({ day, hours, minutes })}
            onMouseLeave={() => setCellEntered({})}
            className={styles.TableCell}
            {...props}
        >
            {isHovered && hoveredChildren}
        </Table.Cell>
    )
}

export default HoverableTableCell