import { FC } from 'react';
import { GitHub } from 'react-feather';
import getIconSize from '../utils/IconSize';

import '../styles/Banner.css';

export const Banner: FC<{ title: string, logo: string, githubLink: string }> = ({ title, logo, githubLink }) => {

    return (
        <div className='banner'>

            <div className='banner-left'>
                <a href={githubLink}>
                    <div className='title-wrapper'>
                        <img src={logo} alt='logo' className='logo' />
                        <h1>{title}</h1>
                    </div>
                </a>
            </div>

            <div className='banner-right'>
                <a href = { "https://" + githubLink } target="_blank" rel="noopener noreferrer">
                    <GitHub size={getIconSize()} className='github-icon' />
                    {githubLink}
                </a>
            </div>

        </div>
    );
}

export default Banner;