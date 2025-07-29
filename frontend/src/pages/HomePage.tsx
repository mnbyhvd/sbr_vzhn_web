import React from 'react';
import Hero from '../components/Hero/Hero';
import PartnersSlider from '../components/Partners/PartnersSlider';
import DirectionsMosaic from '../components/Directions/DirectionsMosaic';
import ProjectsSlider from '../components/Projects/ProjectsSlider';
import InternationalExperience from '../components/International/InternationalExperience';
import TeamSlider from '../components/Team/TeamSlider';
import About from '../components/About/About';
import FAQ from '../components/FAQ/FAQ';
import ContactForm from '../components/ContactForm/ContactForm';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <PartnersSlider />
            <DirectionsMosaic />
            <ProjectsSlider />
            <InternationalExperience />
            <TeamSlider />
            <About />
            <FAQ />
            <ContactForm />
        </>
    );
};

export default HomePage; 