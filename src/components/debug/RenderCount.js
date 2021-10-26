import React from 'react'
import styles from './RenderCount.module.css'

export default function RenderCount() {
    const renders = React.useRef(0);

    if (false)  {
        return <span className={styles.Circle}>{++renders.current}</span>
    }

    return null;
}
