import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { user, customers } from '../db_models/mysql/init-models';
import { UserEdge, UserConnection } from '../db_models/mysql/user';
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

export type ICreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
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

export type IDeleteUserInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type IMutation = {
  __typename?: 'Mutation';
  createCustomer: ICustomer;
  createUser: IUser;
  deleteCustomer: ISuccessResponse;
  deleteUser: ISuccessResponse;
  updateCustomer: ISuccessResponse;
  updateUser: ISuccessResponse;
};


export type IMutationCreateCustomerArgs = {
  input: ICreateCustomerInput;
};


export type IMutationCreateUserArgs = {
  input: ICreateUserInput;
};


export type IMutationDeleteCustomerArgs = {
  input: IDeleteCustomerInput;
};


export type IMutationDeleteUserArgs = {
  input: IDeleteUserInput;
};


export type IMutationUpdateCustomerArgs = {
  input: IUpdateCustomerInput;
};


export type IMutationUpdateUserArgs = {
  input: IUpdateUserInput;
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

export type IQuery = {
  __typename?: 'Query';
  login: IUserLoginResponse;
  me: IUser;
  users: IUserConnection;
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

export type ISubscription = {
  __typename?: 'Subscription';
  subscribeNotifications: IUser;
};

export enum ISuccessResponse {
  Success = 'success'
}

export type IUpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
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
  CreateCustomerInput: ICreateCustomerInput;
  CreateUserInput: ICreateUserInput;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  Customer: ResolverTypeWrapper<ICustomer>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteUserInput: IDeleteUserInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<IPageInfo>;
  PaginationInput: IPaginationInput;
  Query: ResolverTypeWrapper<{}>;
  Role: IRole;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  SuccessResponse: ISuccessResponse;
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<user>;
  UserConnection: ResolverTypeWrapper<UserConnection>;
  UserEdge: ResolverTypeWrapper<UserEdge>;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: ResolverTypeWrapper<Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }>;
  UsersInput: IUsersInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateCustomerInput: ICreateCustomerInput;
  CreateUserInput: ICreateUserInput;
  Cursor: Scalars['Cursor']['output'];
  Customer: ICustomer;
  Date: Scalars['Date']['output'];
  DeleteCustomerInput: IDeleteCustomerInput;
  DeleteUserInput: IDeleteUserInput;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  PageInfo: IPageInfo;
  PaginationInput: IPaginationInput;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateCustomerInput: IUpdateCustomerInput;
  UpdateUserInput: IUpdateUserInput;
  Upload: Scalars['Upload']['output'];
  User: user;
  UserConnection: UserConnection;
  UserEdge: UserEdge;
  UserLoginInput: IUserLoginInput;
  UserLoginResponse: Omit<IUserLoginResponse, 'user'> & { user: IResolversParentTypes['User'] };
  UsersInput: IUsersInput;
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
  createCustomer?: Resolver<IResolversTypes['Customer'], ParentType, ContextType, RequireFields<IMutationCreateCustomerArgs, 'input'>>;
  createUser?: Resolver<IResolversTypes['User'], ParentType, ContextType, RequireFields<IMutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteCustomerArgs, 'input'>>;
  deleteUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationDeleteUserArgs, 'input'>>;
  updateCustomer?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateCustomerArgs, 'input'>>;
  updateUser?: Resolver<IResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<IMutationUpdateUserArgs, 'input'>>;
};

export type IPageInfoResolvers<ContextType = any, ParentType extends IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<IResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IQueryResolvers<ContextType = any, ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']> = {
  login?: Resolver<IResolversTypes['UserLoginResponse'], ParentType, ContextType, RequireFields<IQueryLoginArgs, 'input'>>;
  me?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
  users?: Resolver<IResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<IQueryUsersArgs, 'input'>>;
};

export type ISubscriptionResolvers<ContextType = any, ParentType extends IResolversParentTypes['Subscription'] = IResolversParentTypes['Subscription']> = {
  subscribeNotifications?: SubscriptionResolver<IResolversTypes['User'], "subscribeNotifications", ParentType, ContextType>;
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
  Cursor?: GraphQLScalarType;
  Customer?: ICustomerResolvers<ContextType>;
  Date?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: IMutationResolvers<ContextType>;
  PageInfo?: IPageInfoResolvers<ContextType>;
  Query?: IQueryResolvers<ContextType>;
  Subscription?: ISubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: IUserResolvers<ContextType>;
  UserConnection?: IUserConnectionResolvers<ContextType>;
  UserEdge?: IUserEdgeResolvers<ContextType>;
  UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
};

