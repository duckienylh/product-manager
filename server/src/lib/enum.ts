export enum DefaultHashValue {
    saltRounds = 10,
}
export enum RoleList {
    director = 999,
    admin = 99,
    manager = 9,
    accountant = 5,
    sales = 1,
    driver = 3,
}

export enum BucketValue {
    DEVTEAM = 'dev-team',
}

export enum StatusOrder {
    creatNew = 'Tạo mới',
    createExportOrder = 'Chốt đơn - Tạo lệnh xuất hàng',
    delivering = 'Đang giao hàng',
    successDelivery = 'Giao hàng thành công',
    paymentConfirmation = 'Xác nhận thanh toán và hồ sơ',
    paid = 'Đã thanh toán',
    done = 'Đơn hàng hoàn thành',
}
