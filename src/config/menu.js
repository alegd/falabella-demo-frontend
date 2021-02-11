import React from 'react';
import {
  RiUserStarLine as ValueChainIcon,
  RiGroupLine as GroupIcon,
  RiUserReceived2Line as LegalFormIcon
} from 'react-icons/ri';
import { CgListTree as SubSectorIcon } from 'react-icons/cg';
import { FaTheaterMasks } from 'react-icons/fa';

const Menu = [
  {
    key: 'agents',
    name: 'Agentes',
    link: `/agents`,
    icon: <GroupIcon size={20} />
  },
  {
    key: 'scopes',
    name: 'Ámbitos',
    link: `/scopes`,
    icon: <SubSectorIcon size={20} />
  },
  {
    key: 'sectors',
    name: 'Sectores',
    link: `/sectors`,
    icon: <SubSectorIcon size={20} />
  },
  {
    key: 'sub-sectors',
    name: 'Sub-sectores',
    link: `/sub-sectors`,
    icon: <SubSectorIcon size={20} />
  },
  {
    key: 'activities',
    name: 'Actividades',
    link: `/activities`,
    icon: <FaTheaterMasks size={20} />
  },
  {
    key: 'legal-forms',
    name: 'Formas Jurídicas',
    link: `/legal-forms`,
    icon: <LegalFormIcon size={20} />
  },

  {
    key: 'value-chains',
    name: 'Cadenas de valor',
    link: `/value-chains`,
    icon: <ValueChainIcon size={20} />
  }
];

export default Menu;
