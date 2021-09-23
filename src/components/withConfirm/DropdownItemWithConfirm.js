import { Dropdown } from 'semantic-ui-react';
import withConfirm from './withConfirm';

const DropdownItemWithConfirm = withConfirm(Dropdown.Item)

export default DropdownItemWithConfirm