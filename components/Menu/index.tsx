import React from 'react';
import Link from 'next/link';

const Menu: React.FC = () => {
    return (
        <nav className={'menu'}>
            <div className={'logoContainer'}>
                <img src="https://res.cloudinary.com/lastminute-contenthub/v1/DAM/Logos%20%2B%20fonts/SVG/lm_without%20border_NEW" alt="lastminute.com" className={'logo'}/>
            </div>
            <ul className={'menuList'}>
                <li className={'menuItem'}><Link href="/">Home</Link></li>
                <li className={'menuItem'}><Link href="/partite">Partite</Link></li>
                <li className={'menuItem'}><Link href="/classifica">Classifica generale</Link></li>
                <li className={'menuItem'}><Link href="/classifica/gironi">Classifica a gironi</Link></li>
            </ul>
        </nav>
    );
};

export default Menu;