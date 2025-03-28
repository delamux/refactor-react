import { MockWebServer } from '../../MockWebServer.ts';
import productsResponse from './data/productsResponse.json';

export function givenProducts(mockWebServer: MockWebServer) {
    mockWebServer.addRequestHandlers([
        {
            method: 'get',
            endpoint: 'https://fakestoreapi.com/products',
            response: productsResponse,
            httpStatusCode: 200,
        },
    ]);
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
