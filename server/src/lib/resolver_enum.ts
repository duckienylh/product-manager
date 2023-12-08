import { INotificationEvent, IRole, IStatusOrder, ITypeImageOfVehicle } from '../__generated__/graphql';
import { RoleList, StatusOrder, TypeImageOfVehicle } from './enum';
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
        case IRole.Driver:
            return RoleList.driver;
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
        case RoleList.driver:
            return IRole.Driver;
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
        case INotificationEvent.NewDeliverOrder:
            return NotificationEvent.NewDeliverOrder;
        case INotificationEvent.UpdatedDeliverOrder:
            return NotificationEvent.UpdatedDeliverOrder;
        case INotificationEvent.NewPayment:
            return NotificationEvent.NewPayment;
        case INotificationEvent.NewVehicle:
            return NotificationEvent.NewVehicle;
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

export const typeImageOfVehicleToITypeImageOfVehicle = (input: TypeImageOfVehicle | string) => {
    switch (input) {
        case TypeImageOfVehicle.licenseImage:
            return ITypeImageOfVehicle.LicenseImage;
        case TypeImageOfVehicle.registrationImage:
            return ITypeImageOfVehicle.RegistrationImage;
        case TypeImageOfVehicle.vehicleImage:
            return ITypeImageOfVehicle.VehicleImage;
        default:
            throw new InValidValueError();
    }
};
