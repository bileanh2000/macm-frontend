import { useState } from 'react';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from '../CreateRule/CreateRule.module.scss';
import adminRuleAPI from 'src/api/adminRuleAPI';

const cx = classNames.bind(styles)

function CreateRule() {

    const history = useNavigate()
    const [rule, setRule] = useState('')



    const handleCreateRule = async () => {
        try {
            if (rule != null) {
                await adminRuleAPI.create({
                    description: rule,
                });
            }
            history("/admin/rules")
        } catch (error) {
            console.log("Error detected: " + error)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h1>Thêm nội quy mới của câu lạc bộ</h1>
                <span>
                    <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: 20 }}
                        onClick={handleCreateRule}
                    >
                        Xác nhận
                        {/* <Link to="/admin/rules">Xác nhận</Link> */}
                    </Button>
                    <Button variant="contained" color="error">
                        <Link to="/admin/rules">Hủy bỏ</Link>
                    </Button>
                </span>
            </div>
            <textarea
                className={cx('textArea')}
                rows={10}
                value={rule}
                onChange={e => setRule(e.target.value)}
                required
            >
            </textarea>
        </div >
    );
}

export default CreateRule;