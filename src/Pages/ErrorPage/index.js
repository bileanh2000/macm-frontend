import ghostImage from './ghost.png';
import classNames from 'classnames/bind';
import styles from './errorPage.module.scss';
import { useEffect } from 'react';
import { Box } from '@mui/system';

function ErrorPage() {
    const cx = classNames.bind(styles);
    return (
        <Box
            sx={{
                height: '100vh',
                background:
                    'linear-gradient(0deg, rgba(153,178,255,0.36) 0%, rgba(189,205,255,0.36) 19%, rgba(204,216,255,0.2049194677871149) 43%, rgba(255,255,255,1) 100%)',
            }}
        >
            <div className={cx('ghost')}>
                <img width="190px" src={ghostImage} alt="ghost" />
                <div className={cx('eyes')}>
                    <div className={cx('eye')}>
                        <div
                            className="ball"
                            style={{
                                width: '25px',
                                height: '25px',
                                backgroundColor: 'rgb(51, 51, 51)',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                            }}
                        ></div>
                    </div>
                    <div className={cx('eye')}>
                        <div
                            className="ball"
                            style={{
                                width: '25px',
                                height: '25px',
                                backgroundColor: 'rgb(51, 51, 51)',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className={cx('error')}>
                <h1 className={cx('error-code')}>404</h1>
                <h2 className={cx('error-des')}>Oops, có vẻ như bạn đang lạc đường !</h2>
                {/* <a className={cx('btn')} href="/Thuedi"></a> */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Box
                        component="a"
                        href="/"
                        sx={{
                            display: 'flex',
                            // border: '1px solid black',
                            backgroundColor: '#1163c7',
                            boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
                            borderRadius: '25px',
                            width: 'fit-content',
                            padding: 1.5,
                            color: 'white',
                        }}
                    >
                        Quay về trang chủ
                    </Box>
                </Box>
            </div>
        </Box>
    );
}

export default ErrorPage;
