import Footer from "./Footer/Footer";
import SlideShow from "./Slideshow/Slideshow";
import classNames from 'classnames/bind';

import styles from '../Contact.module.scss';
const cx = classNames.bind(styles)

function ViewContact() {
    return (
        <div className={cx('slideshow')}>
            <SlideShow />
            <Footer />
        </div>

    );
}

export default ViewContact;