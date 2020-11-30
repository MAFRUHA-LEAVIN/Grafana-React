import { getBackendSrv } from '@grafana/runtime';
import { AnalysisPayload } from 'types';

/**
 * This request API can proxy requests if a datasource plugin is configured with
 * the wanted target urls. An example of a datasource plugin is simpod JSON
 * datasource that can be found in the link below. Two datasources are needed, one
 * for the options fetching and one for the analysis results fetching.
 * https://grafana.com/grafana/plugins/simpod-json-datasource
 *
 * Additionally the ip and port of the target server needs to be set in the
 * Grafana configuration variable "data_source_proxy_whitelist".
 * Path of the configuration file: /conf/custom.ini
 * Format of the variable should be: ip_or_domain:port
 * */

/**
 * Find the id of a datasource that is configured with the given url
 * @param url query url
 * @returns datasource id or null if no datasource is found
 */
async function findDatasourceId(url: string) {
  const res = await getBackendSrv().datasourceRequest({
    method: 'GET',
    url: '/api/datasources/',
  });
  for (const dataSource of res.data) {
    if (dataSource.url === url) {
      return dataSource.id;
    }
  }
  return null;
}

/**
 * Handle fetching of analysis results
 * @param payload data for the POST request as JSON
 * @returns analysis results as HTML
 */
export async function sendAnalysisRequest(payload: any) {
  /*const payload: any = {
    rangeData: [{
      name: 'testi123',
      rows: [[1, 2],[2, 3],[3, 4]]
    }],
    command: 'statistics',
    options: {
      Robust_only: 'All',
      Percentile: 50
    }
  }*/
  let res;
  // Check if a datasource is available for proxying
  const id = await findDatasourceId('http://13.49.88.32:443/analyse');
  if (!id) {
    // If no datasource is found just send the request without proxying
    res = await request('http://13.49.88.32:443/analyse', 'POST', payload);
  } else {
    res = await request('/api/datasources/proxy/' + id, 'POST', payload);
  }
  console.log(res.data);
  if (res) {
    return res.data; // return the analysis
  }
}

/**
 * Handle fetching of analysis options
 * @returns analysis options as JSON
 */
export async function getAnalysisOptions() {
  let res;
  // Check if a datasource is available for proxying
  const id = await findDatasourceId('http://13.49.88.32:443/scripts');
  if (!id) {
    // If no datasource is found just send the request without proxying
    res = await request('http://13.49.88.32:443/scripts', 'GET');
  } else {
    res = await request('/api/datasources/proxy/' + id, 'GET');
  }
  if (res) {
    return res.data; // return the options
  }
}

/**
 * Send a HTTP request through the grafana BackendSrv API and return the response
 * @param url target url
 * @param method request method (POST or GET)
 * @param payload data for the POST request (optional)
 * @returns response object
 */
async function request(url: string, method: string, payload?: any) {
  let res;
  if (method === 'POST') {
    res = await getBackendSrv().datasourceRequest({
      method: method,
      url: url,
      data: payload,
    });
  } else if (method === 'GET') {
    res = await getBackendSrv().datasourceRequest({
      method: method,
      url: url,
    });
  }
  if (res) {
    return res;
  }
}
