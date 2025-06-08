import { ChangeEvent, useEffect, useState } from 'react';
import { changeLanguage, i18n } from '@shared/i18n/i18n';
import api from '@shared/services/api';

const options = [
  { value: 'pt', label: 'Português (BR)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const;

type Language = typeof options[number]['value'];

export default function LanguageControl() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('pt');

  const handleLanguageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.value as Language;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);

    try {
      await api.post(`/users/set-language/${newLanguage}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('i18nextLng') as Language | null;
    if (saved) {
      setSelectedLanguage(saved);
    }
  }, []);

  return (
    <div className="space-y-2">
      <label htmlFor="language-select" className="font-medium">
        {i18n.t('selectLanguage')}
      </label>
      <div
        id="language-select"
        className="flex space-x-4"
        onChange={handleLanguageChange}
      >
        {options.map(option => (
          <label key={option.value} className="flex items-center space-x-1">
            <input
              type="radio"
              name="language-radio-group"
              value={option.value}
              checked={selectedLanguage === option.value}
              onChange={() => {}}
              className="text-blue-600"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
