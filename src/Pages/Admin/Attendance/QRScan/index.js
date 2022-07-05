import React, { Fragment, useState } from 'react';
import { QrReader } from 'react-qr-reader';
function QRScanner() {
    const [data, setData] = useState('No result');
    return (
        <Fragment>
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '100%' }}
            />
            <p>{data}</p>
        </Fragment>
    );
}

export default QRScanner;
