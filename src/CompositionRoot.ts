import { StoreApi } from './data/api/StoreApi.ts';
import { ProductApiRepository } from './data/ProductApiRepository.ts';
import { GetProductsUseCase } from './domain/GetProductsUseCase.ts';
import { GetProductByIdUseCase } from './domain/GetProductByIdUseCase.ts';

export class CompositionRoot {
  private readonly storeApi: StoreApi;
  private readonly repository: ProductApiRepository;

  private constructor() {
    this.storeApi = new StoreApi();
    this.repository = new ProductApiRepository(this.storeApi);
  }

  private static instance: CompositionRoot;

  public static getInstance(): CompositionRoot {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot();
    }
    return CompositionRoot.instance;
  }
  public provideGetProductsUseCase() {
    return new GetProductsUseCase(this.repository);
  }

  public provideGetProductByIdUseCase(): GetProductByIdUseCase {
    return new GetProductByIdUseCase(this.repository);
  }

  public provideStoreApi(): StoreApi {
    return this.storeApi;
  }
}
