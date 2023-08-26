import { InvalidPaginationArgumentError } from '../classes/graphqlErrors';
import { IPaginationInput } from '../../__generated__/graphql';

export type TRDBPaginationParam = {
    limit: number | undefined;
    offset: number;
    limitForLast: number | undefined;
};

export type TRDBEdge<T = any> = {
    model: T;
    cursor: number;
};

export type TRDBConnection<T = any> = {
    rows: TRDBEdge<T>[];
    count: number;
    hasNextPage: boolean;
};

const defaultPaginationInput = {
    first: undefined,
    last: undefined,
    before: undefined,
    after: undefined,
};

const setCursorToRDBRows = <T>(rows: T[], offset: number): TRDBEdge<T>[] =>
    rows.map((model, idx) => ({
        cursor: idx + 1 + offset,
        model,
    }));

export const convertRDBRowsToConnection = <T>(
    { rows, count }: { rows: T[]; count: number },
    offset: number,
    limitForLast: number | undefined
): TRDBConnection<T> => {
    let rowsWithCursor = setCursorToRDBRows(rows, offset);
    rowsWithCursor = limitForLast ? rowsWithCursor.slice(-limitForLast) : rowsWithCursor;
    return {
        count,
        rows: rowsWithCursor,
        hasNextPage: rows.length < 1 ? false : !(count === rowsWithCursor.slice(-1)[0].cursor),
    };
};

export const getRDBPaginationParams = (input: IPaginationInput | null | undefined) => {
    const { first, last, before, after } = input || defaultPaginationInput;
    if (first !== undefined && first !== null && first < 1) {
        throw new InvalidPaginationArgumentError(`'first' argument must be greater than 0 but ${first}`);
    }
    if (last !== undefined && last !== null && last < 1) {
        throw new InvalidPaginationArgumentError(`'last' argument must be greater than 0 but ${last}`);
    }
    const result: TRDBPaginationParam = {
        limit: first || last || 25,
        offset: after || 0,
        limitForLast: undefined,
    };
    if (!after && before) {
        if (result.limit && before > result.limit) {
            result.offset = before - result.limit;
        }
    } else if (!first && last) {
        result.limitForLast = result.limit;
        result.limit = undefined;
    }
    return result;
};

export const rdbConnectionResolver = {
    edges: (parent: TRDBConnection) => parent.rows,
    totalCount: (parent: TRDBConnection) => parent.count,
    pageInfo: (parent: TRDBConnection) => {
        const last = parent.rows.length < 1 ? null : parent.rows.slice(-1)[0].cursor;
        return {
            hasNextPage: parent.hasNextPage,
            endCursor: last,
        };
    },
};

export const rdbEdgeResolver = {
    node: (parent: TRDBEdge) => parent.model,
    cursor: (parent: TRDBEdge) => `${parent.cursor}`,
};
