import { useContext } from "react";
import "./UserSettings.scss";
import { UserContext } from "../../context/User";

function UserSettings() {
  const { user } = useContext(UserContext);

  if (user == null) {
    return (
      <div className="userSettings">
        <header className="userSettingsHeader">
          <h1 className="pageHeroTitle">My Account</h1>
          <p className="userSettingsSubtitle">Manage your account details</p>
        </header>
        <div className="accountDetails">
          <section className="detailsSec">
            <div className="detailItem userSettingsSkeleton">
              <span className="userSettingsSkeletonLine" />
            </div>
            <div className="detailItem userSettingsSkeleton">
              <span className="userSettingsSkeletonLine" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="userSettings">
      <header className="userSettingsHeader">
        <h1 className="pageHeroTitle">My Account</h1>
        <p className="userSettingsSubtitle">Manage your account details</p>
      </header>
      <div className="accountDetails">
        <section className="detailsSec">
          <div className="detailItem">
            <h3><i className="bi bi-person-circle" aria-hidden="true" /> Full name:</h3>
            <p>{user.fullName ?? "—"}</p>
          </div>
          <div className="detailItem">
            <h3><i className="bi bi-envelope-fill" aria-hidden="true" /> Email:</h3>
            <p>{user.email ?? "—"}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserSettings
