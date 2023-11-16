import { INotificationEvent, IRole, IStatusOrder } from '../__generated__/graphql';
import { RoleList, StatusOrder } from './enum';
import { InValidRoleError, InValidValueError } from './classes/graphqlErrors';
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
        case INotificationEvent.NewOrder:
            return NotificationEvent.NewOrder;
        case INotificationEvent.UpdateOrder:
            return NotificationEvent.UpdateOrder;
    }
};

export const StatusOrderTypeResolve = (input: string | undefined) => {
    switch (input) {
        case StatusOrder.creatNew:
            return IStatusOrder.CreatNew;
        case StatusOrder.createExportOrder:
            return IStatusOrder.CreateExportOrder;
        case StatusOrder.delivering:
            return IStatusOrder.Delivering;
        case StatusOrder.successDelivery:
            return IStatusOrder.SuccessDelivery;
        case StatusOrder.paymentConfirmation:
            return IStatusOrder.PaymentConfirmation;
        case StatusOrder.paid:
            return IStatusOrder.Paid;
        case StatusOrder.done:
            return IStatusOrder.Done;
        default:
            throw new InValidValueError();
    }
};

export const IStatusOrderToStatusOrder = (iStatusOrderInput: IStatusOrder) => {
    switch (iStatusOrderInput) {
        case IStatusOrder.CreatNew:
            return StatusOrder.creatNew;
        case IStatusOrder.CreateExportOrder:
            return StatusOrder.createExportOrder;
        case IStatusOrder.Delivering:
            return StatusOrder.delivering;
        case IStatusOrder.SuccessDelivery:
            return StatusOrder.successDelivery;
        case IStatusOrder.PaymentConfirmation:
            return StatusOrder.paymentConfirmation;
        case IStatusOrder.Paid:
            return StatusOrder.paid;
        case IStatusOrder.Done:
            return StatusOrder.done;
        default:
            throw new InValidValueError();
    }
};
