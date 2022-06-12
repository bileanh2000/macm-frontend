import { Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../CreateRule/CreateRule.module.scss';
import { useState } from 'react';
import adminRuleAPI from 'src/api/adminRuleAPI';

const cx = classNames.bind(styles)

function EditRule() {

    const location = useLocation()
    const _rule = location.state?.rule;
    const history = useNavigate()

    const [rule, setRule] = useState(_rule.description)

    const handleUpdateRule = async () => {
        try {
            if (rule != null) {
                await adminRuleAPI.update({
                    id: _rule.id,
                    description: rule,
                });
            }
            history('/admin/rules')
        } catch (error) {
            console.log("Error detected: " + error)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h1>Sửa nội quy của câu lạc bộ</h1>
                <span>
                    <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: 20 }}
                        onClick={handleUpdateRule}
                    >
                        Xác nhận
                    </Button>
                    <Button variant="contained" color="error">
                        <Link to="/admin/rules">Hủy bỏ</Link>
                    </Button>
                </span>
            </div>
            <textarea
                className={cx('textArea')}
                rows={10}
                value={rule == null ? '' : rule}
                onChange={e => setRule(e.target.value)}
                required
            >
            </textarea>
        </div >
    );
}

export default EditRule;