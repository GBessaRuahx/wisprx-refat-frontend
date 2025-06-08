import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/pt-br';
import { momentLocalizer } from 'react-big-calendar';

export const createMomentLocalizer = () => {
  const savedLanguage =
    typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'pt' : 'pt';
  moment.locale(savedLanguage === 'pt' ? 'pt-br' : savedLanguage);
  return momentLocalizer(moment);
};
