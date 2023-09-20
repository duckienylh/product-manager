import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customers, categories, products, orders, notifications } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
import { ProductEdge, ProductConnection } from '../db_models/mysql/products';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type ICategory = {
  __typename?: 'Category';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ICreateCategoryInput = {
  name: Scalars['String']['input'];
};

export type ICreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type ICreateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId: Scalars['Int']['input'];
  deliverAddress?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  freightPrice?: InputMaybe<Scalars['Float']['input']>;
  product: Array<IProductInput>;
  saleId: Scalars['Int']['input'];
};

export type ICreateProductInput = {
  categoryId: Scalars['Int']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type ICreateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  role: IRole;
  userName: Scalars['String']['input'];
};

export type ICustomer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phoneNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IDeleteCustomerInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IDeleteProductInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IDeleteUserInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IListAllProductInput = {
  args?: InputMaybe<IPaginationInput>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  checkInventory?: InputMaybe<Scalars['Boolean']['input']>;
  stringQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IMutation = {
  __typename?: 'Mutation';
  createCategory: ICategory;
  createCustomer: ICustomer;
  createOrder: IOrder;
  createProduct: IProduct;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteProduct: ISuccessResponse;
  deleteUser: ISuccessResponse;
  updateCategory: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateOrder: ISuccessResponse;
  updateProduct: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCategoryArgs = {
  input: ICreateCategoryInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
};


export type IMutationCreateOrderArgs = {
  input: ICreateOrderInput;
};


export type IMutationCreateProductArgs = {
  input: ICreateProductInput;
};


export type IMutationCreateUserArgs = {
  input: ICreateUserInput;
};


export type IMutationDeleteCustomerArgs = {
  input: IDeleteCustomerInput;
};


export type IMutationDeleteProductArgs = {
  input: IDeleteProductInput;
};


export type IMutationDeleteUserArgs = {
  input: IDeleteUserInput;
};


export type IMutationUpdateCategoryArgs = {
  input: IUpdateCategoryInput;
};


export type IMutationUpdateCustomerArgs = {
  input: IUpdateCustomerInput;
};


export type IMutationUpdateOrderArgs = {
  input: IUpdateOrderInput;
};


export type IMutationUpdateProductArgs = {
  input: IUpdateProductInput;
};


export type IMutationUpdateUserArgs = {
  input: IUpdateUserInput;
};

export type INotification = {
  __typename?: 'Notification';
  Order?: Maybe<IOrder>;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  event: INotificationEvent;
  id: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum INotificationEvent {
  Common = 'Common',
  NewMessage = 'NewMessage',
  NewOrder = 'NewOrder',
  UpdateOrder = 'updateOrder'
}

export type INotificationResponse = {
  __typename?: 'NotificationResponse';
  message: Scalars['String']['output'];
  notification?: Maybe<INotification>;
};

export type IOrder = {
  __typename?: 'Order';
  VAT?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  customer: ICustomer;
  deliverAddress?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['Float']['output']>;
  freightPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  invoiceNo: Scalars['String']['output'];
  sale: IUser;
  status: IStatusOrder;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IPageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type IPaginationInput = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type IProduct = {
  __typename?: 'Product';
  category: ICategory;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type IProductConnection = {
  __typename?: 'ProductConnection';
  edges?: Maybe<Array<Maybe<IProductEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IProduct>;
};

export type IQuery = {
  __typename?: 'Query';
  listAllCategory: Array<Maybe<ICategory>>;
  listAllProduct: IProductConnection;
  login: IUserLoginResponse;
  me: IUser;
  users: IUserConnection;
};


export type IQueryListAllProductArgs = {
  input: IListAllProductInput;
};


export type IQueryLoginArgs = {
  input: IUserLoginInput;
};


export type IQueryUsersArgs = {
  input: IUsersInput;
};

export enum IRole {
  Accountant = 'Accountant',
  Admin = 'Admin',
  AssistantDriver = 'AssistantDriver',
  Director = 'Director',
  Driver = 'Driver',
  Manager = 'Manager',
  Sales = 'Sales',
  TransporterManager = 'TransporterManager'
}

export enum IStatusOrder {
  Delivering = 'Delivering',
  CreatNew = 'creatNew',
  Done = 'done',
  Paid = 'paid',
  PaymentConfirmation = 'paymentConfirmation',
  SuccessDelivery = 'successDelivery'
}

export type ISubscribeNotificationsInput = {
  /** excludingEvent: Khi user không muốn nhận thông từ 1 sự kiện nào đó */
  excludingEvent?: InputMaybe<Array<INotificationEvent>>;
  /** #### User Id: ID của user sẽ nhận đc các thông báo */
  userId: Scalars['Int']['input'];
};

export type ISubscription = {
  __typename?: 'Subscription';
  subscribeNotifications: INotificationResponse;
};


export type ISubscriptionSubscribeNotificationsArgs = {
  input: ISubscribeNotificationsInput;
};

export enum ISuccessResponse {
  Success = 'success'
}

export type IUpdateCategoryInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateOrderInput = {
  VAT?: InputMaybe<Scalars['Float']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  deliverAddress?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Float']['input']>;
  freightPrice?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['Int']['input'];
  invoiceNo?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Array<IUpdateProductOrderInput>>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<IStatusOrder>;
};

export type IUpdateProductInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductOrderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  orderItem: Scalars['Int']['input'];
  priceProduct?: InputMaybe<Scalars['Float']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  weightProduct?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  avatarURL?: InputMaybe<Scalars['Upload']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<IRole>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type IUser = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  avatarURL?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  role?: Maybe<IRole>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userName: Scalars['String']['output'];
};

export type IUserConnection = {
  __typename?: 'UserConnection';
  edges?: Maybe<Array<Maybe<IUserEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IUserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IUser>;
};

export type IUserLoginInput = {
  account: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type IUserLoginResponse = {
  __typename?: 'UserLoginResponse';
  token: Scalars['String']['output'];
  user: IUser;
};

export type IUsersInput = {
  args?: InputMaybe<IPaginationInput>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<IRole>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  priceProduct: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  weightProduct?: InputMaybe<Scalars['Float']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<categories>;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<ICustomer>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductInput: IDeleteProductInput;
  DeleteUserInput: IDeleteUserInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  ListAllProductInput: IListAllProductInput;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<notifications>;
  NotificationEvent: INotificationEvent;
  NotificationResponse: ResolverTypeWrapper<Omit<INotificationResponse, 'notification'> & { notification?: Maybe<IResolversTypes['Notification']> }>;
  Order: ResolverTypeWrapper<orders>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  Product: ResolverTypeWrapper<products>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  Query: ResolverTypeWrapper<{}>;
  Role: IRole;
  StatusOrder: IStatusOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductOrderInput: IUpdateProductOrderInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<user>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: ResolverTypeWrapper<Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }>;
  UsersInput: IUsersInput;
  productInput: IProductInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Category: categories;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: ICustomer;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductInput: IDeleteProductInput;
  DeleteUserInput: IDeleteUserInput;
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  ListAllProductInput: IListAllProductInput;
  Mutation: {};
  Notification: notifications;
  NotificationResponse: Omit<INotificationResponse, 'notification'> & { notification?: Maybe<IResolversParentTypes['Notification']> };
  Order: orders;
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  Product: products;
  ProductConnection: ProductConnection;
  ProductEdge: ProductEdge;
  Query: {};
  String: Scalars['String']['output'];
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: {};
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductOrderInput: IUpdateProductOrderInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: Scalars['Upload']['output'];
  User: user;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: Omit<IUserLoginResponse, 'user'> & { user: IResolversParentTypes['User'] };
  UsersInput: IUsersInput;
  productInput: IProductInput;
};

export type ICategoryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Category'] = IResolversParentTypes['Category']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ICursorScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type ICustomerResolvers<ContextType = any, ParentType extends IResolversParentTypes['Customer'] = IResolversParentTypes['Customer']> = {
  address?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  companyName?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IDateScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
  name: 'Date';
}

export interface IJsonScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IMutationCreateCategoryArgs, 'input'>>;
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createOrder?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IMutationCreateOrderArgs, 'input'>>;
  createProduct?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IMutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteProduct?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteProductArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  updateCategory?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCategoryArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateOrderArgs, 'input'>>;
  updateProduct?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductArgs, 'input'>>;
  updateUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateUserArgs, 'input'>>;
};

export type INotificationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Notification'] = IResolversParentTypes['Notification']> = {
  Order?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
  content?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  event?: Resolver<IResolversTypes['NotificationEvent'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type INotificationResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['NotificationResponse'] = IResolversParentTypes['NotificationResponse']> = {
  message?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  notification?: Resolver<Maybe<IResolversTypes['Notification']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderResolvers<ContextType = any, ParentType extends IResolversParentTypes['Order'] = IResolversParentTypes['Order']> = {
  VAT?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType>;
  deliverAddress?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  discount?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  freightPrice?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  invoiceNo?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  sale?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  status?: Resolver<IResolversTypes['StatusOrder'], ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IPageInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<IResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductResolvers<ContextType = any, ParentType extends IResolversParentTypes['Product'] = IResolversParentTypes['Product']> = {
  category?: Resolver<IResolversTypes['Category'], ParentType, ContextType>;
  code?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  width?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['ProductConnection'] = IResolversParentTypes['ProductConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['ProductEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['ProductEdge'] = IResolversParentTypes['ProductEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  listAllCategory?: Resolver<Array<Maybe<IResolversTypes['Category']>>, ParentType, ContextType>;
  listAllProduct?: Resolver<IResolversTypes['ProductConnection'], ParentType, ContextType, RequireFields<IQueryListAllProductArgs, 'input'>>;
  login?: Resolver<IResolversTypes['UserLoginResponse'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'input'>>;
  me?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  users?: Resolver<IResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<IQueryUsersArgs, 'input'>>;
};

export type ISubscriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['Subscription'] = IResolversParentTypes['Subscription']> = {
  subscribeNotifications?: SubscriptionResolver<IResolversTypes['NotificationResponse'], "subscribeNotifications", ParentType, ContextType, RequireFields<ISubscriptionSubscribeNotificationsArgs, 'input'>>;
};

export interface IUploadScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type IUserResolvers<ContextType = any, ParentType extends IResolversParentTypes['User'] = IResolversParentTypes['User']> = {
  address?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  avatarURL?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  fullName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<IResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  phoneNumber?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<Maybe<IResolversTypes['Role']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  userName?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserConnection'] = IResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['UserEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserEdge'] = IResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserLoginResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserLoginResponse'] = IResolversParentTypes['UserLoginResponse']> = {
  token?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
  Category?: ICategoryResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  Customer?: ICustomerResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: IMutationResolvers<ContextType>;
  Notification?: INotificationResolvers<ContextType>;
  NotificationResponse?: INotificationResponseResolvers<ContextType>;
  Order?: IOrderResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
  Product?: IProductResolvers<ContextType>;
  ProductConnection?: IProductConnectionResolvers<ContextType>;
  ProductEdge?: IProductEdgeResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: IUserResolvers<ContextType>;
  UserConnection?: IUserConnectionResolvers<ContextType>;
  UserEdge?: IUserEdgeResolvers<ContextType>;
  UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
};

