import axios from 'axios';

export async function api<T>(url: string): Promise<T> {
  return axios
    .get(url)
    .then((response) => response.data as Promise<T>);
}
