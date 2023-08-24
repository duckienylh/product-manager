import { PmContext } from '../../server';
import { AuthenticationError } from '../classes/graphqlErrors';

export const checkAuthentication = (context: PmContext) => {
    if (!context.isAuth && !context.user) throw new AuthenticationError(context.error);
};
