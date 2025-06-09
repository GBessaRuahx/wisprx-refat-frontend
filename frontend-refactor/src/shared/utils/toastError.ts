import { toast } from 'react-toastify';
import { i18n } from '@shared/i18n/i18n';
import { isString } from 'lodash';

export interface AxiosErrorLike {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function toastError(err: unknown): void {
  const error = err as AxiosErrorLike;
  const errorMsg = error.response?.data?.error;
  if (errorMsg) {
    if (i18n.exists(`backendErrors.${errorMsg}`)) {
      console.error(`Error: ${i18n.t(`backendErrors.${errorMsg}`)}`);
      toast.error(i18n.t(`backendErrors.${errorMsg}`), {
        toastId: errorMsg,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    toast.error(errorMsg, {
      toastId: errorMsg,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    return;
  }
  if (isString(err)) {
    console.error(`Error: ${err}`);
    return;
  }
  console.error('An error occurred!');
}
