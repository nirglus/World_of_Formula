import {useContext} from 'react'
import "./UserSettings.scss";
import { UserContext } from '../../context/User';

function UserSettings() {
  const {user} = useContext(UserContext);
  return (
    <div className='userSettings'>
        <div className="titles">
            <h1>My Account</h1>
            <hr/>
      </div>
      <div className="accountDetails">
        <h2>Account Details</h2>
        <section className='detailsSec'>
            <div className="detailItem">
                <h3><i className="bi bi-person-circle"></i> Full name:</h3>
                <p>{user.fullName}</p>
            </div>
            <div className="detailItem">
                <h3><i className="bi bi-envelope-fill"></i> Email:</h3>
                <p>{user.email}</p>
            </div>
        </section>
      </div>
    </div>
  )
}

export default UserSettings
