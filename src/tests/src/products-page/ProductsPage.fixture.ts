import { MockWebServer } from '../../MockWebServer.ts';
import productsResponse from './data/productsResponse.json';
import { RemoteProduct } from '../../../api/StoreApi.ts';

export function givenProducts(mockWebServer: MockWebServer): RemoteProduct[] {
  mockWebServer.addRequestHandlers([
    {
      method: 'get',
      endpoint: 'https://fakestoreapi.com/products',
      response: productsResponse,
      httpStatusCode: 200,
    },
  ]);

  return productsResponse;
}

export function givenEmptyProducts(mockWebServer: MockWebServer) {
  mockWebServer.addRequestHandlers([
    {
      method: 'get',
      endpoint: 'https://fakestoreapi.com/products',
      response: [],
      httpStatusCode: 200,
    },
  ]);
}
