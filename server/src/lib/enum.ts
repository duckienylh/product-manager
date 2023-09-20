export enum DefaultHashValue {
    saltRounds = 10,
}
export enum RoleList {
    director = 999,
    admin = 99,
    manager = 9,
    accountant = 5,
    sales = 1,
    transporterManager = 2,
    driver = 3,
    assistantDriver = 4,
}

export enum BucketValue {
    DEVAPP = 'dev-app',
}

export enum StatusOrder {
    creatNew = 'Tạo mới',
    delivering = 'Đang giao hàng',
    successDelivery = 'Giao hàng thành công',
    paymentConfirmation = 'Xác nhận thanh toán và hồ sơ',
    paid = 'Đã thanh toán',
    done = 'Đơn hàng hoàn thành',
}
