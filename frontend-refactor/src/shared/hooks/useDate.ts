import dayjs from 'dayjs';

export function useDate() {
  const dateToClient = (strDate: string): string => {
    return dayjs(strDate).isValid() ? dayjs(strDate).format('DD/MM/YYYY') : strDate;
  };

  const datetimeToClient = (strDate: string): string => {
    return dayjs(strDate).isValid() ? dayjs(strDate).format('DD/MM/YYYY HH:mm') : strDate;
  };

  const dateToDatabase = (strDate: string): string => {
    return dayjs(strDate, 'DD/MM/YYYY').isValid()
      ? dayjs(strDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
      : strDate;
  };

  return {
    dateToClient,
    datetimeToClient,
    dateToDatabase,
  };
}

export default useDate;
