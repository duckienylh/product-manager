import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customers, categories, products, orders, notifications, orderItem, orderProcess, deliverOrder, userNotifications } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
import { CustomerEdge, CustomerConnection } from '../db_models/mysql/customers';
import { ProductEdge, ProductConnection } from '../db_models/mysql/products';
import { OrderEdge, OrderConnection } from '../db_models/mysql/orders';
import { DeliverOrderEdge, DeliverOrderConnection } from '../db_models/mysql/deliverOrder';
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

export type IAdminReportRevenueByMonthInput = {
  endAt: Scalars['Date']['input'];
  startAt: Scalars['Date']['input'];
};

export type IAdminReportRevenueByMonthResponse = {
  __typename?: 'AdminReportRevenueByMonthResponse';
  sale: Scalars['String']['output'];
  totalOrder: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
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

export type ICreateDeliverOrderInput = {
  createdBy: Scalars['Int']['input'];
  customerId: Scalars['Int']['input'];
  deliveryDate: Scalars['Date']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
  receivingNote?: InputMaybe<Scalars['String']['input']>;
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
  age?: InputMaybe<Scalars['Int']['input']>;
  categoryId: Scalars['Int']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  inventory?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
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

export type ICustomerConnection = {
  __typename?: 'CustomerConnection';
  edges?: Maybe<Array<Maybe<ICustomerEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ICustomerEdge = {
  __typename?: 'CustomerEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<ICustomer>;
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

export type IDeliverOrder = {
  __typename?: 'DeliverOrder';
  createdAt?: Maybe<Scalars['Date']['output']>;
  customer: ICustomer;
  deliveryDate: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  driver?: Maybe<IUser>;
  id: Scalars['Int']['output'];
  order: IOrder;
  receivingNote?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IDeliverOrderConnection = {
  __typename?: 'DeliverOrderConnection';
  edges?: Maybe<Array<Maybe<IDeliverOrderEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IDeliverOrderEdge = {
  __typename?: 'DeliverOrderEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IDeliverOrder>;
};

export type IImportExcelProductInput = {
  fileExcelProducts: Scalars['Upload']['input'];
};

export type IListAllCustomerInput = {
  args?: InputMaybe<IPaginationInput>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllDeliverOrderInput = {
  args?: InputMaybe<IPaginationInput>;
  createAt?: InputMaybe<IFilterDate>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  queryString?: InputMaybe<Scalars['String']['input']>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type IListAllDeliverOrderResponse = {
  __typename?: 'ListAllDeliverOrderResponse';
  allOrderCounter: Scalars['Int']['output'];
  createExportOrderCounter: Scalars['Int']['output'];
  deliverOrder?: Maybe<IDeliverOrderConnection>;
  doneOrderCounter: Scalars['Int']['output'];
  inProcessingCounter: Scalars['Int']['output'];
};

export type IListAllOrderInput = {
  args?: InputMaybe<IPaginationInput>;
  createAt?: InputMaybe<IFilterDate>;
  invoiceNo?: InputMaybe<Scalars['String']['input']>;
  queryString?: InputMaybe<Scalars['String']['input']>;
  saleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<IStatusOrder>;
};

export type IListAllOrderResponse = {
  __typename?: 'ListAllOrderResponse';
  allOrderCounter: Scalars['Int']['output'];
  creatNewOrderCounter: Scalars['Int']['output'];
  createExportOrderCounter: Scalars['Int']['output'];
  deliveryOrderCounter: Scalars['Int']['output'];
  doneOrderCounter: Scalars['Int']['output'];
  orders?: Maybe<IOrderConnection>;
  paidOrderCounter: Scalars['Int']['output'];
  paymentConfirmationOrderCounter: Scalars['Int']['output'];
  successDeliveryOrderCounter: Scalars['Int']['output'];
  totalCompleted?: Maybe<Scalars['Float']['output']>;
  totalDeliver?: Maybe<Scalars['Float']['output']>;
  totalPaid?: Maybe<Scalars['Float']['output']>;
  totalRevenue?: Maybe<Scalars['Float']['output']>;
};

export type IListAllProductInput = {
  args?: InputMaybe<IPaginationInput>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  checkInventory?: InputMaybe<Scalars['Boolean']['input']>;
  stringQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IListArrayUserNotificationInput = {
  event?: InputMaybe<INotificationEvent>;
  userId: Scalars['Int']['input'];
};

export type IMutation = {
  __typename?: 'Mutation';
  createCategory: ICategory;
  createCustomer: ICustomer;
  createDeliverOrder: IDeliverOrder;
  createOrder: IOrder;
  createProduct: IProduct;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteProduct: ISuccessResponse;
  deleteUser: ISuccessResponse;
  importExcelProduct: Array<Maybe<IProduct>>;
  updateCategory: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateDeliverOrder: ISuccessResponse;
  updateOrder: ISuccessResponse;
  updateProduct: ISuccessResponse;
  updateStatusUserNotification: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCategoryArgs = {
  input: ICreateCategoryInput;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
};


export type IMutationCreateDeliverOrderArgs = {
  input: ICreateDeliverOrderInput;
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


export type IMutationImportExcelProductArgs = {
  input: IImportExcelProductInput;
};


export type IMutationUpdateCategoryArgs = {
  input: IUpdateCategoryInput;
};


export type IMutationUpdateCustomerArgs = {
  input: IUpdateCustomerInput;
};


export type IMutationUpdateDeliverOrderArgs = {
  input: IUpdateDeliverOrderInput;
};


export type IMutationUpdateOrderArgs = {
  input: IUpdateOrderInput;
};


export type IMutationUpdateProductArgs = {
  input: IUpdateProductInput;
};


export type IMutationUpdateStatusUserNotificationArgs = {
  input: IUpdateStatusUserNotificationInput;
};


export type IMutationUpdateUserArgs = {
  input: IUpdateUserInput;
};

export type INotification = {
  __typename?: 'Notification';
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  event: INotificationEvent;
  id: Scalars['Int']['output'];
  order?: Maybe<IOrder>;
  updatedAt: Scalars['Date']['output'];
};

export enum INotificationEvent {
  Common = 'Common',
  NewDeliverOrder = 'NewDeliverOrder',
  NewMessage = 'NewMessage',
  NewOrder = 'NewOrder',
  UpdateOrder = 'UpdateOrder',
  UpdatedDeliverOrder = 'UpdatedDeliverOrder'
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
  deliverOrderList?: Maybe<Array<Maybe<IDeliverOrder>>>;
  discount?: Maybe<Scalars['Float']['output']>;
  freightPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  invoiceNo: Scalars['String']['output'];
  orderItemList?: Maybe<Array<Maybe<IOrderItem>>>;
  sale: IUser;
  status: IStatusOrder;
  totalMoney?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type IOrderConnection = {
  __typename?: 'OrderConnection';
  edges?: Maybe<Array<Maybe<IOrderEdge>>>;
  pageInfo: IPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IOrderEdge = {
  __typename?: 'OrderEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<IOrder>;
};

export type IOrderItem = {
  __typename?: 'OrderItem';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  order: IOrder;
  product: IProduct;
  quantity?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type IOrderProcess = {
  __typename?: 'OrderProcess';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fromStatus: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  order: IOrder;
  toStatus: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user: IUser;
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
  age?: Maybe<Scalars['Int']['output']>;
  category: ICategory;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  inventory?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
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
  adminReportRevenueByMonth: Array<Maybe<IAdminReportRevenueByMonthResponse>>;
  getCategoryById: ICategory;
  getCustomerById: ICustomer;
  getOrderById: IOrder;
  getProductById: IProduct;
  getUserById: IUser;
  listAllCategory: Array<Maybe<ICategory>>;
  listAllCustomer: ICustomerConnection;
  listAllDeliverOrder: IListAllDeliverOrderResponse;
  listAllOrder: IListAllOrderResponse;
  listAllProduct: IProductConnection;
  listArrayUserNotification: Array<Maybe<IUserNotification>>;
  listInformationOrder: Array<Maybe<IOrderProcess>>;
  login: IUserLoginResponse;
  me: IUser;
  salesReportRevenueByMonth: Array<Maybe<ISalesReportRevenueByMonthResponse>>;
  salesReportRevenueByWeek: Array<Maybe<ISalesReportRevenueByWeekResponse>>;
  users: IUserConnection;
};


export type IQueryAdminReportRevenueByMonthArgs = {
  input: IAdminReportRevenueByMonthInput;
};


export type IQueryGetCategoryByIdArgs = {
  id: Scalars['Int']['input'];
};


export type IQueryGetCustomerByIdArgs = {
  CustomerId: Scalars['Int']['input'];
};


export type IQueryGetOrderByIdArgs = {
  orderId: Scalars['Int']['input'];
};


export type IQueryGetProductByIdArgs = {
  productId: Scalars['Int']['input'];
};


export type IQueryGetUserByIdArgs = {
  userId: Scalars['Int']['input'];
};


export type IQueryListAllCustomerArgs = {
  input: IListAllCustomerInput;
};


export type IQueryListAllDeliverOrderArgs = {
  input: IListAllDeliverOrderInput;
};


export type IQueryListAllOrderArgs = {
  input: IListAllOrderInput;
};


export type IQueryListAllProductArgs = {
  input: IListAllProductInput;
};


export type IQueryListArrayUserNotificationArgs = {
  input: IListArrayUserNotificationInput;
};


export type IQueryListInformationOrderArgs = {
  orderId: Scalars['Int']['input'];
};


export type IQueryLoginArgs = {
  input: IUserLoginInput;
};


export type IQuerySalesReportRevenueByMonthArgs = {
  input: ISalesReportRevenueByMonthInput;
};


export type IQuerySalesReportRevenueByWeekArgs = {
  input: ISalesReportRevenueByWeekInput;
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

export type ISalesReportRevenueByMonthInput = {
  endAt: Scalars['Date']['input'];
  saleId?: InputMaybe<Scalars['Int']['input']>;
  startAt: Scalars['Date']['input'];
};

export type ISalesReportRevenueByMonthResponse = {
  __typename?: 'SalesReportRevenueByMonthResponse';
  month: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type ISalesReportRevenueByWeekInput = {
  endAt: Scalars['Date']['input'];
  saleId?: InputMaybe<Scalars['Int']['input']>;
  startAt: Scalars['Date']['input'];
};

export type ISalesReportRevenueByWeekResponse = {
  __typename?: 'SalesReportRevenueByWeekResponse';
  date: Scalars['Date']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export enum IStatusOrder {
  CreatNew = 'creatNew',
  CreateExportOrder = 'createExportOrder',
  Delivering = 'delivering',
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

export type IUpdateDeliverOrderInput = {
  customerId?: InputMaybe<Scalars['Int']['input']>;
  deliveryDate?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  driverId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  orderId?: InputMaybe<Scalars['Int']['input']>;
  receivingNote?: InputMaybe<Scalars['String']['input']>;
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
  saleId: Scalars['Int']['input'];
  status?: InputMaybe<IStatusOrder>;
};

export type IUpdateProductInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
  inventory?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type IUpdateProductOrderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  orderItem?: InputMaybe<Scalars['Int']['input']>;
  priceProduct?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type IUpdateStatusUserNotificationInput = {
  isRead: Scalars['Boolean']['input'];
  userNotificationIds: Array<Scalars['Int']['input']>;
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

export type IUserNotification = {
  __typename?: 'UserNotification';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  notification: INotification;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user: IUser;
};

export type IUsersInput = {
  args?: InputMaybe<IPaginationInput>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<IRole>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type IFilterDate = {
  endAt: Scalars['Date']['input'];
  startAt: Scalars['Date']['input'];
};

export type IProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  priceProduct: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
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
  AdminReportRevenueByMonthInput: IAdminReportRevenueByMonthInput;
  AdminReportRevenueByMonthResponse: ResolverTypeWrapper<IAdminReportRevenueByMonthResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<categories>;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateDeliverOrderInput: ICreateDeliverOrderInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<ICustomer>;
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>;
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductInput: IDeleteProductInput;
  DeleteUserInput: IDeleteUserInput;
  DeliverOrder: ResolverTypeWrapper<deliverOrder>;
  DeliverOrderConnection: ResolverTypeWrapper<DeliverOrderConnection>;
  DeliverOrderEdge: ResolverTypeWrapper<DeliverOrderEdge>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ImportExcelProductInput: IImportExcelProductInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllDeliverOrderInput: IListAllDeliverOrderInput;
  ListAllDeliverOrderResponse: ResolverTypeWrapper<Omit<IListAllDeliverOrderResponse, 'deliverOrder'> & { deliverOrder?: Maybe<IResolversTypes['DeliverOrderConnection']> }>;
  ListAllOrderInput: IListAllOrderInput;
  ListAllOrderResponse: ResolverTypeWrapper<Omit<IListAllOrderResponse, 'orders'> & { orders?: Maybe<IResolversTypes['OrderConnection']> }>;
  ListAllProductInput: IListAllProductInput;
  ListArrayUserNotificationInput: IListArrayUserNotificationInput;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<notifications>;
  NotificationEvent: INotificationEvent;
  NotificationResponse: ResolverTypeWrapper<Omit<INotificationResponse, 'notification'> & { notification?: Maybe<IResolversTypes['Notification']> }>;
  Order: ResolverTypeWrapper<orders>;
  OrderConnection: ResolverTypeWrapper<OrderConnection>;
  OrderEdge: ResolverTypeWrapper<OrderEdge>;
  OrderItem: ResolverTypeWrapper<orderItem>;
  OrderProcess: ResolverTypeWrapper<orderProcess>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  Product: ResolverTypeWrapper<products>;
  ProductConnection: ResolverTypeWrapper<ProductConnection>;
  ProductEdge: ResolverTypeWrapper<ProductEdge>;
  Query: ResolverTypeWrapper<{}>;
  Role: IRole;
  SalesReportRevenueByMonthInput: ISalesReportRevenueByMonthInput;
  SalesReportRevenueByMonthResponse: ResolverTypeWrapper<ISalesReportRevenueByMonthResponse>;
  SalesReportRevenueByWeekInput: ISalesReportRevenueByWeekInput;
  SalesReportRevenueByWeekResponse: ResolverTypeWrapper<ISalesReportRevenueByWeekResponse>;
  StatusOrder: IStatusOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateDeliverOrderInput: IUpdateDeliverOrderInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductOrderInput: IUpdateProductOrderInput;
  UpdateStatusUserNotificationInput: IUpdateStatusUserNotificationInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<user>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: ResolverTypeWrapper<Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }>;
  UserNotification: ResolverTypeWrapper<userNotifications>;
  UsersInput: IUsersInput;
  filterDate: IFilterDate;
  productInput: IProductInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  AdminReportRevenueByMonthInput: IAdminReportRevenueByMonthInput;
  AdminReportRevenueByMonthResponse: IAdminReportRevenueByMonthResponse;
  Boolean: Scalars['Boolean']['output'];
  Category: categories;
  CreateCategoryInput: ICreateCategoryInput;
  CreateCustomerInput: ICreateCustomerInput;
  CreateDeliverOrderInput: ICreateDeliverOrderInput;
  CreateOrderInput: ICreateOrderInput;
  CreateProductInput: ICreateProductInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: ICustomer;
  CustomerConnection: CustomerConnection;
  CustomerEdge: CustomerEdge;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteProductInput: IDeleteProductInput;
  DeleteUserInput: IDeleteUserInput;
  DeliverOrder: deliverOrder;
  DeliverOrderConnection: DeliverOrderConnection;
  DeliverOrderEdge: DeliverOrderEdge;
  Float: Scalars['Float']['output'];
  ImportExcelProductInput: IImportExcelProductInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  ListAllCustomerInput: IListAllCustomerInput;
  ListAllDeliverOrderInput: IListAllDeliverOrderInput;
  ListAllDeliverOrderResponse: Omit<IListAllDeliverOrderResponse, 'deliverOrder'> & { deliverOrder?: Maybe<IResolversParentTypes['DeliverOrderConnection']> };
  ListAllOrderInput: IListAllOrderInput;
  ListAllOrderResponse: Omit<IListAllOrderResponse, 'orders'> & { orders?: Maybe<IResolversParentTypes['OrderConnection']> };
  ListAllProductInput: IListAllProductInput;
  ListArrayUserNotificationInput: IListArrayUserNotificationInput;
  Mutation: {};
  Notification: notifications;
  NotificationResponse: Omit<INotificationResponse, 'notification'> & { notification?: Maybe<IResolversParentTypes['Notification']> };
  Order: orders;
  OrderConnection: OrderConnection;
  OrderEdge: OrderEdge;
  OrderItem: orderItem;
  OrderProcess: orderProcess;
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  Product: products;
  ProductConnection: ProductConnection;
  ProductEdge: ProductEdge;
  Query: {};
  SalesReportRevenueByMonthInput: ISalesReportRevenueByMonthInput;
  SalesReportRevenueByMonthResponse: ISalesReportRevenueByMonthResponse;
  SalesReportRevenueByWeekInput: ISalesReportRevenueByWeekInput;
  SalesReportRevenueByWeekResponse: ISalesReportRevenueByWeekResponse;
  String: Scalars['String']['output'];
  SubscribeNotificationsInput: ISubscribeNotificationsInput;
  Subscription: {};
  UpdateCategoryInput: IUpdateCategoryInput;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateDeliverOrderInput: IUpdateDeliverOrderInput;
  UpdateOrderInput: IUpdateOrderInput;
  UpdateProductInput: IUpdateProductInput;
  UpdateProductOrderInput: IUpdateProductOrderInput;
  UpdateStatusUserNotificationInput: IUpdateStatusUserNotificationInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: Scalars['Upload']['output'];
  User: user;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: Omit<IUserLoginResponse, 'user'> & { user: IResolversParentTypes['User'] };
  UserNotification: userNotifications;
  UsersInput: IUsersInput;
  filterDate: IFilterDate;
  productInput: IProductInput;
};

export type IAdminReportRevenueByMonthResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['AdminReportRevenueByMonthResponse'] = IResolversParentTypes['AdminReportRevenueByMonthResponse']> = {
  sale?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  totalOrder?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  totalRevenue?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type ICustomerConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['CustomerConnection'] = IResolversParentTypes['CustomerConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['CustomerEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICustomerEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['CustomerEdge'] = IResolversParentTypes['CustomerEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Customer']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IDateScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
  name: 'Date';
}

export type IDeliverOrderResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrder'] = IResolversParentTypes['DeliverOrder']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  customer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType>;
  deliveryDate?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  driver?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  order?: Resolver<IResolversTypes['Order'], ParentType, ContextType>;
  receivingNote?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IDeliverOrderConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrderConnection'] = IResolversParentTypes['DeliverOrderConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['DeliverOrderEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IDeliverOrderEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['DeliverOrderEdge'] = IResolversParentTypes['DeliverOrderEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['DeliverOrder']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IJsonScalarConfig extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type IListAllDeliverOrderResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['ListAllDeliverOrderResponse'] = IResolversParentTypes['ListAllDeliverOrderResponse']> = {
  allOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  createExportOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  deliverOrder?: Resolver<Maybe<IResolversTypes['DeliverOrderConnection']>, ParentType, ContextType>;
  doneOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  inProcessingCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IListAllOrderResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['ListAllOrderResponse'] = IResolversParentTypes['ListAllOrderResponse']> = {
  allOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  creatNewOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  createExportOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  deliveryOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  doneOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  orders?: Resolver<Maybe<IResolversTypes['OrderConnection']>, ParentType, ContextType>;
  paidOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  paymentConfirmationOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  successDeliveryOrderCounter?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  totalCompleted?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalDeliver?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalPaid?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  totalRevenue?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMutationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']> = {
  createCategory?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IMutationCreateCategoryArgs, 'input'>>;
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createDeliverOrder?: Resolver<IResolversTypes['DeliverOrder'], ParentType, ContextType, RequireFields<IMutationCreateDeliverOrderArgs, 'input'>>;
  createOrder?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IMutationCreateOrderArgs, 'input'>>;
  createProduct?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IMutationCreateProductArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteProduct?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteProductArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  importExcelProduct?: Resolver<Array<Maybe<IResolversTypes['Product']>>, ParentType, ContextType, RequireFields<IMutationImportExcelProductArgs, 'input'>>;
  updateCategory?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCategoryArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateDeliverOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateDeliverOrderArgs, 'input'>>;
  updateOrder?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateOrderArgs, 'input'>>;
  updateProduct?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateProductArgs, 'input'>>;
  updateStatusUserNotification?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateStatusUserNotificationArgs, 'input'>>;
  updateUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateUserArgs, 'input'>>;
};

export type INotificationResolvers<ContextType = any, ParentType extends IResolversParentTypes['Notification'] = IResolversParentTypes['Notification']> = {
  content?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  event?: Resolver<IResolversTypes['NotificationEvent'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  order?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
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
  deliverOrderList?: Resolver<Maybe<Array<Maybe<IResolversTypes['DeliverOrder']>>>, ParentType, ContextType>;
  discount?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  freightPrice?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  invoiceNo?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  orderItemList?: Resolver<Maybe<Array<Maybe<IResolversTypes['OrderItem']>>>, ParentType, ContextType>;
  sale?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  status?: Resolver<IResolversTypes['StatusOrder'], ParentType, ContextType>;
  totalMoney?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderConnectionResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderConnection'] = IResolversParentTypes['OrderConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<IResolversTypes['OrderEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<IResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderEdgeResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderEdge'] = IResolversParentTypes['OrderEdge']> = {
  cursor?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Maybe<IResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderItemResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderItem'] = IResolversParentTypes['OrderItem']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  note?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<IResolversTypes['Order'], ParentType, ContextType>;
  product?: Resolver<IResolversTypes['Product'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  unitPrice?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IOrderProcessResolvers<ContextType = any, ParentType extends IResolversParentTypes['OrderProcess'] = IResolversParentTypes['OrderProcess']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  fromStatus?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  order?: Resolver<IResolversTypes['Order'], ParentType, ContextType>;
  toStatus?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IPageInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<IResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IProductResolvers<ContextType = any, ParentType extends IResolversParentTypes['Product'] = IResolversParentTypes['Product']> = {
  age?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
  category?: Resolver<IResolversTypes['Category'], ParentType, ContextType>;
  code?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
  inventory?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<IResolversTypes['Float']>, ParentType, ContextType>;
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
  adminReportRevenueByMonth?: Resolver<Array<Maybe<IResolversTypes['AdminReportRevenueByMonthResponse']>>, ParentType, ContextType, RequireFields<IQueryAdminReportRevenueByMonthArgs, 'input'>>;
  getCategoryById?: Resolver<IResolversTypes['Category'], ParentType, ContextType, RequireFields<IQueryGetCategoryByIdArgs, 'id'>>;
  getCustomerById?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IQueryGetCustomerByIdArgs, 'CustomerId'>>;
  getOrderById?: Resolver<IResolversTypes['Order'], ParentType, ContextType, RequireFields<IQueryGetOrderByIdArgs, 'orderId'>>;
  getProductById?: Resolver<IResolversTypes['Product'], ParentType, ContextType, RequireFields<IQueryGetProductByIdArgs, 'productId'>>;
  getUserById?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IQueryGetUserByIdArgs, 'userId'>>;
  listAllCategory?: Resolver<Array<Maybe<IResolversTypes['Category']>>, ParentType, ContextType>;
  listAllCustomer?: Resolver<IResolversTypes['CustomerConnection'], ParentType, ContextType, RequireFields<IQueryListAllCustomerArgs, 'input'>>;
  listAllDeliverOrder?: Resolver<IResolversTypes['ListAllDeliverOrderResponse'], ParentType, ContextType, RequireFields<IQueryListAllDeliverOrderArgs, 'input'>>;
  listAllOrder?: Resolver<IResolversTypes['ListAllOrderResponse'], ParentType, ContextType, RequireFields<IQueryListAllOrderArgs, 'input'>>;
  listAllProduct?: Resolver<IResolversTypes['ProductConnection'], ParentType, ContextType, RequireFields<IQueryListAllProductArgs, 'input'>>;
  listArrayUserNotification?: Resolver<Array<Maybe<IResolversTypes['UserNotification']>>, ParentType, ContextType, RequireFields<IQueryListArrayUserNotificationArgs, 'input'>>;
  listInformationOrder?: Resolver<Array<Maybe<IResolversTypes['OrderProcess']>>, ParentType, ContextType, RequireFields<IQueryListInformationOrderArgs, 'orderId'>>;
  login?: Resolver<IResolversTypes['UserLoginResponse'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'input'>>;
  me?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  salesReportRevenueByMonth?: Resolver<Array<Maybe<IResolversTypes['SalesReportRevenueByMonthResponse']>>, ParentType, ContextType, RequireFields<IQuerySalesReportRevenueByMonthArgs, 'input'>>;
  salesReportRevenueByWeek?: Resolver<Array<Maybe<IResolversTypes['SalesReportRevenueByWeekResponse']>>, ParentType, ContextType, RequireFields<IQuerySalesReportRevenueByWeekArgs, 'input'>>;
  users?: Resolver<IResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<IQueryUsersArgs, 'input'>>;
};

export type ISalesReportRevenueByMonthResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['SalesReportRevenueByMonthResponse'] = IResolversParentTypes['SalesReportRevenueByMonthResponse']> = {
  month?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  totalRevenue?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISalesReportRevenueByWeekResponseResolvers<ContextType = any, ParentType extends IResolversParentTypes['SalesReportRevenueByWeekResponse'] = IResolversParentTypes['SalesReportRevenueByWeekResponse']> = {
  date?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
  totalRevenue?: Resolver<IResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type IUserNotificationResolvers<ContextType = any, ParentType extends IResolversParentTypes['UserNotification'] = IResolversParentTypes['UserNotification']> = {
  createdAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
  isRead?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  notification?: Resolver<IResolversTypes['Notification'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<IResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
  AdminReportRevenueByMonthResponse?: IAdminReportRevenueByMonthResponseResolvers<ContextType>;
  Category?: ICategoryResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  Customer?: ICustomerResolvers<ContextType>;
  CustomerConnection?: ICustomerConnectionResolvers<ContextType>;
  CustomerEdge?: ICustomerEdgeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeliverOrder?: IDeliverOrderResolvers<ContextType>;
  DeliverOrderConnection?: IDeliverOrderConnectionResolvers<ContextType>;
  DeliverOrderEdge?: IDeliverOrderEdgeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  ListAllDeliverOrderResponse?: IListAllDeliverOrderResponseResolvers<ContextType>;
  ListAllOrderResponse?: IListAllOrderResponseResolvers<ContextType>;
  Mutation?: IMutationResolvers<ContextType>;
  Notification?: INotificationResolvers<ContextType>;
  NotificationResponse?: INotificationResponseResolvers<ContextType>;
  Order?: IOrderResolvers<ContextType>;
  OrderConnection?: IOrderConnectionResolvers<ContextType>;
  OrderEdge?: IOrderEdgeResolvers<ContextType>;
  OrderItem?: IOrderItemResolvers<ContextType>;
  OrderProcess?: IOrderProcessResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
  Product?: IProductResolvers<ContextType>;
  ProductConnection?: IProductConnectionResolvers<ContextType>;
  ProductEdge?: IProductEdgeResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  SalesReportRevenueByMonthResponse?: ISalesReportRevenueByMonthResponseResolvers<ContextType>;
  SalesReportRevenueByWeekResponse?: ISalesReportRevenueByWeekResponseResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: IUserResolvers<ContextType>;
  UserConnection?: IUserConnectionResolvers<ContextType>;
  UserEdge?: IUserEdgeResolvers<ContextType>;
  UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
  UserNotification?: IUserNotificationResolvers<ContextType>;
};

