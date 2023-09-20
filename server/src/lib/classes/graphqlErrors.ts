import { GraphQLError } from 'graphql';

export enum PM_ERROR_CODE {
    /**
     * Invalid access token passed
     */
    Unauthenticated = 'Unauthenticated',
    /**
     * User not found.
     */
    UserNotFound = 'UserNotFound',
    InValidRole = 'InValidRole',
    InValidValue = 'InValidValue',
    Permission = 'Permission',
    UserAlreadyExist = 'UserAlreadyExist',
    /**
     * Error query in mysql.
     */
    MySQL = 'MySQL',
    /**
     * pagination Error
     */
    InvalidPaginationArgument = 'InvalidPaginationArgument',
    CustomerNotFound = 'CustomerNotFound',
    CategoryNotFound = 'CategoryNotFound',
    ProductNotFound = 'ProductNotFound',
    OrderNotFound = 'OrderNotFound',
    OrderItemNotFound = 'OrderItemNotFound',
}

export class AuthenticationError extends GraphQLError {
    constructor(message: string | null) {
        super(message || 'Lỗi xác thực quyền truy cập của người dùng', {
            extensions: {
                code: PM_ERROR_CODE.Unauthenticated,
            },
        });
    }
}

export class UserNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Người dùng không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.UserNotFound,
            },
        });
    }
}

export class InValidRoleError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không xác định được quyền truy cập của người dùng', {
            extensions: {
                code: PM_ERROR_CODE.InValidRole,
            },
        });
    }
}

export class InValidValueError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không xác định được giá trị truyền vào', {
            extensions: {
                code: PM_ERROR_CODE.InValidValue,
            },
        });
    }
}

export class PermissionError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không có quyền truy cập và thực hiện chức năng này', {
            extensions: {
                code: PM_ERROR_CODE.Permission,
            },
        });
    }
}

export class UserAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Người dùng có email, tài khoản đã tồn tại. Hãy đăng nhập hoặc chọn email, tài khoản khác', {
            extensions: {
                code: PM_ERROR_CODE.UserAlreadyExist,
            },
        });
    }
}

export class MySQLError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Lỗi bất thường khi thao tác trong cơ sở dữ liệu', {
            extensions: {
                code: PM_ERROR_CODE.MySQL,
            },
        });
    }
}

export class InvalidPaginationArgumentError extends GraphQLError {
    constructor(message: string) {
        super(message, {
            extensions: {
                code: PM_ERROR_CODE.InvalidPaginationArgument,
            },
        });
    }
}

export class CustomerNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'khách hàng không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.CustomerNotFound,
            },
        });
    }
}

export class CategoryNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Loại sản phẩm không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.CategoryNotFound,
            },
        });
    }
}

export class ProductNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Sản phẩm không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.ProductNotFound,
            },
        });
    }
}

export class OrderNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Đơn hàng không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.OrderNotFound,
            },
        });
    }
}

export class OrderItemNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Chi tiết đơn hàng không tồn tại', {
            extensions: {
                code: PM_ERROR_CODE.OrderItemNotFound,
            },
        });
    }
}
