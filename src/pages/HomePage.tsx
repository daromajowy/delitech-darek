import React from 'react';
import { HeroVideo } from '../components/HeroVideo';
import { HomeFunctionStrip } from '../components/HomeFunctionStrip';
import { HomeKnxReasons } from '../components/HomeTechnologySections';
import { JungEquipment } from '../components/JungEquipment';
import './HomePage.css';

export const HomePage = () => (
  <div className="home-editorial">
    <HeroVideo />
    <HomeFunctionStrip />
    <HomeKnxReasons />
    <JungEquipment />
  </div>
);
