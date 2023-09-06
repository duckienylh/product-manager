import { INotificationEvent, IRole } from '../__generated__/graphql';
import { RoleList } from './enum';
import { InValidRoleError } from './classes/graphqlErrors';
import { NotificationEvent } from './classes/PubSubService';

export const iRoleToNumber = (role: IRole) => {
    switch (role) {
        case IRole.Director:
            return RoleList.director;
        case IRole.Admin:
            return RoleList.admin;
        case IRole.Manager:
            return RoleList.manager;
        case IRole.Accountant:
            return RoleList.accountant;
        case IRole.Sales:
            return RoleList.sales;
        case IRole.TransporterManager:
            return RoleList.transporterManager;
        case IRole.Driver:
            return RoleList.driver;
        case IRole.AssistantDriver:
            return RoleList.assistantDriver;
        default:
            throw new InValidRoleError();
    }
};

export const roleNumberToIRole = (roleNumber: RoleList) => {
    switch (roleNumber) {
        case RoleList.director:
            return IRole.Director;
        case RoleList.admin:
            return IRole.Admin;
        case RoleList.manager:
            return IRole.Manager;
        case RoleList.accountant:
            return IRole.Accountant;
        case RoleList.sales:
            return IRole.Sales;
        case RoleList.transporterManager:
            return IRole.TransporterManager;
        case RoleList.driver:
            return IRole.Driver;
        case RoleList.assistantDriver:
            return IRole.AssistantDriver;
        default:
            throw new InValidRoleError();
    }
};

// eslint-disable-next-line consistent-return
export const iNotificationEventToValueResolve = (event: INotificationEvent) => {
    // eslint-disable-next-line default-case
    switch (event) {
        case INotificationEvent.Common:
            return NotificationEvent.Common;
        case INotificationEvent.NewMessage:
            return NotificationEvent.NewMessage;
    }
};
