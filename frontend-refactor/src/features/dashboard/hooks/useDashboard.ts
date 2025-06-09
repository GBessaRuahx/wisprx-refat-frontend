import api from '@shared/services/api';

export interface DashboardParams {
  start?: string;
  end?: string;
  [key: string]: string | undefined;
}

export interface DashboardData {
  [key: string]: number | string | unknown;
}

export function useDashboard() {
  const find = async (params: DashboardParams): Promise<DashboardData> => {
    const { data } = await api.request<DashboardData>({
      url: '/dashboard',
      method: 'GET',
      params,
    });
    return data;
  };

  return { find };
}

export default useDashboard;
