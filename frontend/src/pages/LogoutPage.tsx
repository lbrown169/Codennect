import { useContext, useEffect } from 'react';
import { deleteToken } from '../api/utils';
import { UserContext } from '../hooks/UserContext';
import { Navigate } from 'react-router-dom';

export default function LogoutPage() {
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        deleteToken();
        if (setUser) {
            setUser(null);
        }
    }, []);

    return <Navigate to="/login" />;
}
