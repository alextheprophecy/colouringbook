import { useEffect, React } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveUserToken, saveUserData } from '../../Hooks/UserDataHandler';
import { updateCredits } from '../../redux/websiteSlice';
const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const user = searchParams.get('user');
        const token = searchParams.get('token');
        if (token && user) {
            const {__v, ...data} = JSON.parse(decodeURIComponent(user))
            
            saveUserData(data)
            saveUserToken(token)
            dispatch(updateCredits(data.credits))
            window.location.href = '/create'            
            
            // Redirect to home or dashboard
            navigate('/');
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Logging you in...</h2>
                <p className="text-gray-600">Please wait while we complete the authentication.</p>
            </div>
        </div>
    );
};

export default AuthSuccess; 