import React from 'react';
import Link from 'next/link';

const Menu: React.FC = () => {
    return (
        <nav className={'menu'}>
            <ul className={'menuList'}>
                <li className={'menuItem'}><Link href="/">Home</Link></li>
                <li className={'menuItem'}><Link href="/partite">Partite</Link></li>
            </ul>
        </nav>
    );
};

export default Menu;