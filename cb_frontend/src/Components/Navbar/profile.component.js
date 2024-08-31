import {useTranslation} from "react-i18next";
import '../../Styles/Navbar/profile.css'
import {useEffect, useState} from "react";
import {getUserData, isUserLoggedIn} from "../../Hooks/UserDataHandler";

const Profile = () => {
    const { t} = useTranslation()
    const [credits, setCredits] = useState(0)

    useEffect(() => {
        setCredits(getUserData()?.credits)
    }, []);

    return <div className={'top-right profile-container'}>
        {isUserLoggedIn()?(credits?`${credits} credits`:'Out of credits!'):''}
    </div>
}
export default Profile