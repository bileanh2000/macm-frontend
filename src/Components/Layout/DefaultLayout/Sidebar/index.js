import { Fragment } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <Fragment>
            <h2>Sidebar</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/admin">Trang chủ</Link>
                    </li>
                    <li>
                        <Link to="/admin/users">Quản lý thành viên</Link>
                    </li>
                </ul>
            </nav>
        </Fragment>
    );
}

export default Sidebar;
