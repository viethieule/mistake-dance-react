import React, { Fragment, useState } from 'react';
import { Confirm } from 'semantic-ui-react';

const withConfirm = (WrappedComponent) => {
    return ({
        onConfirm,
        onCancel = () => { },
        content,
        ...props
    }) => {
        const [open, setOpen] = useState(false);

        const openConfirm = () => setOpen(true);
        const handleCancel = () => {
            onCancel();
            setOpen(false);
        }
        const handleConfirm = () => {
            onConfirm();
            setOpen(false);
        }
        
        return (
            <Fragment>
                <WrappedComponent onClick={openConfirm} {...props} />
                <Confirm
                    open={open}
                    cancelButton="Hủy"
                    confirmButton="Đồng ý"
                    content={content}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            </Fragment>
        )
    }
}

export default withConfirm;