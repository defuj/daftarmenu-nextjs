import React from "react";
import Image from "next/image";
import IconSadigit from '../assets/icons/sadigit.svg';

const Footer = React.memo(() => {
    return (
        <footer style={{ maxHeight: '300px', minHeight: '100px' }} className={'container-footer w-100 p-3 flex-row justify-content-center col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 ml-auto mr-auto mb-0'}>
            <div className="container-footer-button d-flex justify-content-center">
                <a className="button-footer mx-2 my-2" href="https://sadigit.co.id" target="_blank" rel='noopener noreferrer'>
                    <Image src={IconSadigit} alt="sadigit" title="sadigit" style={{ maxHeight: '16px' }} />
                </a>
            </div>
            <div className="container-footer-copyright d-flex justify-content-center flex-wrap">
                <p className="copyright color-black300 caption">Copyright © 2022
                    <a href="https://daftarmenu.com" target="_blank" rel="noopener noreferrer" className="mx-2 semibold color-green500">daftarmenu.com</a>
                </p>
            </div>
        </footer>
    )
})

Footer.displayName = 'Footer';
export default Footer;