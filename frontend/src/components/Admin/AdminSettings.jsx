import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function AdminSettings({ setIsLoggedIn }) {
  const [settings, setSettings] = useState({
    disable_leaderboard: false,
    allow_students_to_opt_in_leaderboard: false, 
    leaderboard_visibility: "username", 
    logo: "",
    primary_color: "",
    secondary_color: "",
    accent_color: "",
  });
  const [admin, setAdmin] = useState({
    unchangedName: "",
    unchangedEmail: ""
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [changedName, setChangedName] = useState("");
  const [changedEmail, setChangedEmail] = useState("");
  const [adminId, setAdminId] = useState();

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminPasswordConfirm, setNewAdminPasswordConfirm] = useState("");
  const [newAdminInfo, setNewAdminInfo] = useState("");
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [newAdminError, setNewAdminError] = useState("");

  const [isBasicInfoChanged, setIsBasicInfoChanged] = useState(false);
  const [passwordUpdateConfirmation, setPasswordUpdateConfirmation] = useState(false);

  const [showAdminCurrentPassword, setShowAdminCurrentPassword] = useState(false);
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);

  const [passwordChangeError, setPasswordChangeError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettingData(){
      try{
        const response = await api.get('/admin/setting');
        const data = response.data;
        const settings = data.settings;
        const accountSettings = data.accountSettings;
        
        const updatedSettings = settings.reduce((acc, { setting_name, setting_value }) => {
          switch (setting_name) {
            case "disable_leaderboard":
              acc.disable_leaderboard = setting_value === "1";
              break;
            case "logo":
              acc.logo = setting_value;
              break;
            case "primary_color":
              acc.primary_color = setting_value;
              break;
            case "secondary_color":
              acc.secondary_color = setting_value;
              break;
            case "accent_color":
              acc.accent_color = setting_value;
              break;
            default:
              break;
          }
          return acc;
        }, {});

        setAdmin(prevState => ({
          ...prevState,
          unchangedName: accountSettings[0].name,
          unchangedEmail: accountSettings[0].email,
          })
        );
        setChangedName(accountSettings[0].name);
        setChangedEmail(accountSettings[0].email);
        setSettings(updatedSettings);
        setAdminId(accountSettings[0].id);
      }
      catch(err){
        console.error(err);
      }
    }

    fetchSettingData();
  }, []);

  async function changeSettings(field, value){
    value = value.toString();
    try{
      const settings = {
        setting_name: field, 
        setting_value: value
      }
      // console.log(settings);
      const response = await api.post('/admin/setting', 
        settings
      );
    }
    catch(err){
      console.log(err);
    }
  }

  async function updateAdminBasicInfo(){
    try{
      const adminUserInfo = await api.patch('/admin/user-info', {
        'id': adminId, 
        'name': changedName, 
        'email': changedEmail
      });
      const adminUserInfoData = adminUserInfo.data[0][0];
      setChangedName(adminUserInfoData.name);
      setChangedEmail(adminUserInfoData.email);
      setAdminId(adminUserInfoData.id);
      setAdmin(prevState => ({
        ...prevState,
        unchangedName: adminUserInfoData.name,
        unchangedEmail: adminUserInfoData.email,
        })
      );
      setIsBasicInfoChanged(false);
    }
    catch(err){
      console.log(err);
    }
  }

  async function updatePassword(){
    setPasswordUpdateConfirmation(false);
    try{
      const response = await api.patch('/admin/update-password', {
        'id': adminId, 
        'current_password': currentPassword, 
        'password': newPassword, 
        'password_confirmation': newPasswordConfirm, 
      });

      setIsLoggedIn(false);
      navigate('/');
    }
    catch(err){
      setPasswordChangeError(err.response.data.message);
    }
  }

  async function addNewAdmin(){
    try{
      const response = await api.post('/admin/new-admin', {
        'name': newAdminName,
        'email': newAdminEmail,
        'password': newAdminPassword,
        'password_confirmation': newAdminPasswordConfirm
      });
      setNewAdminInfo(response.data.message);
      setNewAdminError("");
    }
    catch(err){
      setNewAdminError(err.response.data.message);
    }
  }

  function handleAdminInputChange(field, value){
    setAdmin(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }

  function handleSettingInputChange(field, value){
    setSettings(prevState => ({
      ...prevState,
      [field]: value,
    }));
  }

  function handleNameChange(e) {
    const newName = e.target.value;
    setChangedName(newName);
    setIsBasicInfoChanged(newName !== admin.unchangedName || changedEmail !== admin.unchangedEmail);
  }

  function handleEmailChange(e) {
    const newEmail = e.target.value;
    setChangedEmail(newEmail);
    setIsBasicInfoChanged(changedName !== admin.unchangedName || newEmail !== admin.unchangedEmail);
  }

  function handleBasicInfoChangeCancel(){
    setChangedName(admin.unchangedName);
    setChangedEmail(admin.unchangedEmail);
    setIsBasicInfoChanged(false);
  }

  function handlePasswordChangeCancel(){
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  }

  function handleNewAdminCancel(){
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPassword("");
    setNewAdminPasswordConfirm("");
  }

  function toggleAdminCurrentPasswordVisibility(){
    setShowAdminCurrentPassword(!showAdminCurrentPassword);
  }

  function toggleAdminNewPasswordVisibility(){
    setShowAdminNewPassword(!showAdminNewPassword);
  }

  function toggleNewAdminPasswordVisibility(){
    setShowNewAdminPassword(!showNewAdminPassword);
  }

  return (
    <div className="container-fluid ms-5 mt-3">
      <h1 className="my-3">Settings</h1>
      <div>
        <h3 style={{ color: "#7d7d7d" }}>Leaderboard Settings & Student Preferences</h3>
        <div className="ms-5 container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary-subtle p-3">
              <p>Disable leaderboard</p>
              <button 
              className="btn btn-primary" 
              onClick={() => {
                handleSettingInputChange("disable_leaderboard", !settings.disable_leaderboard);
                changeSettings("disable_leaderboard", !settings.disable_leaderboard);
              }}
              >{
                settings.disable_leaderboard ? "Enable" : "Disable"
              }</button>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary-subtle p-3">
              <p>Allow Students to choose whether to be displayed on leaderboard.</p>
              <button 
              className="btn btn-primary"
              onClick={() => {
                handleSettingInputChange("allow_students_to_opt_in_leaderboard", !settings.allow_students_to_opt_in_leaderboard);
                changeSettings("allow_students_to_opt_in_leaderboard", !settings.allow_students_to_opt_in_leaderboard);
              }} 
              >{settings.allow_students_to_opt_in_leaderboard ? "Disallow" : "Allow"}</button>
            </div>

            <div className="col-12 mb-3 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
              <p>How name is displayed on leaderboard</p>
              <select className="form-select mt-3" onChange={(e) => changeSettings("leaderboard_visibility", e.target.value)}>
                <option value="username">Display username</option>
                <option value="name">Display actual name</option>
                <option value="choose">Allow students to choose (username/actual name)</option>
              </select>
            </div>

            <div className="col-12 mb-3 border-bottom border-secondary-subtle p-3">
              <div className="d-flex flex-column">
                <p>Leaderboard Participation control</p>
                <p className="fw-light fs-6 text-body-secondary">
                  Determines which student won't be displayed on leaderboard
                </p>
              </div>
              <button 
              className="btn btn-primary float-end" 
              >Add students to be excluded</button>
            </div>

            <div className="col-12 mb-3 border-bottom border-secondary-subtle p-3">
              <div className="d-flex flex-column">
                <p>Reset Leaderboard</p>
                <p className="fw-light fs-6 text-danger">
                  Warning: This will reset the leaderboard for all students
                </p>
              </div>
              <button className="btn btn-primary float-end">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: "#7d7d7d" }}>Appearance</h3>
        <div className="ms-5 container">
          <div className="row">
            <div className="col-12 mb-3 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
              <p>Theme</p>
              <div className="ms-5 my-3">
                {/* TODO: store theme on client side */}
                {/* <button className="btn btn-primary me-3" onClick={() => {
                  changeSettings("theme", settings.theme == "light" ? "dark" : "light");
                  setSettings(prevState => ({
                    ...prevState,
                    theme: settings.theme == "light" ? "dark" : "light"
                  }));
                  }}>
                  {settings.theme == "light" ? "Dark" : "Light"}
                </button> */}
              </div>
            </div>
            <div>
              <h6>Website</h6>
              <div className="ms-5 mb-2">
                <p className="text-danger">Warning: This will effect the entire site.</p>
              </div>
              <div className="ms-5 mb-3">
                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
                  <p>Logo</p>
                  <input type="file" accept="image/*" />
                </div>
                <div className="mt-3">
                  <h6>Color scheme</h6>
                  <div>
                    <div className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
                      <p>Primary color</p>
                      <input 
                      type="color" 
                      value={settings.primary_color}
                      onChange={(e) => {
                        handleSettingInputChange("primary_color", e.target.value);
                        changeSettings("primary_color", e.target.value);
                      }}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
                      <p>Secondary color</p>
                      <input 
                      type="color" 
                      value={settings.secondary_color}
                      onChange={(e) => {
                        handleSettingInputChange("secondary_color", e.target.value);
                        changeSettings("secondary_color", e.target.value);
                      }}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle p-3">
                      <p>Accent color</p>
                      <input 
                      type="color" 
                      value={settings.accent_color}
                      onChange={(e) => {
                        handleSettingInputChange("accent_color", e.target.value);
                        changeSettings("accent_color", e.target.value)
                      }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: "#7d7d7d" }}>Account</h3>
        <div className="ms-5 container">
          <h6>Basic information</h6>
          <div className="row ms-3">
            <div className="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                id="floatingInput" 
                placeholder="Name" 
                value={changedName} 
                onChange={handleNameChange}
              />
              <label for="floatingInput">Name</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="email" 
                class="form-control" 
                id="floatingInput" 
                placeholder="Email" 
                value={changedEmail} 
                onChange={handleEmailChange}
              />
              <label for="floatingInput">Email</label>
            </div>
          </div>
          <button 
          className={`btn btn-primary me-3 px-5 ${isBasicInfoChanged ? "" : "disabled"}`} 
          onClick={updateAdminBasicInfo} 
          >Update</button>
          <button 
          className={`btn btn-primary px-5 ${isBasicInfoChanged ? "" : "disabled"}`} 
          onClick={handleBasicInfoChangeCancel}
          >Cancel</button>
        </div>
        <div className="ms-5 container mt-5">
          <h6>Change Password</h6>
          <div className="row ms-3">
            <div className="form-floating mb-3">
              <input 
                type={showAdminCurrentPassword ? "text" : "password"} 
                class="form-control" 
                id="floatingInput" 
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <label for="floatingInput">Current Password</label>
              <i
                onClick={toggleAdminCurrentPasswordVisibility}
                className={`bi ${showAdminCurrentPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} position-absolute`}
                style={{ top: '50%', right: '25px', transform: 'translateY(-50%)', cursor: 'pointer' }}
              ></i>
            </div>
            <div className="form-floating mb-3">
              <input 
                type={showAdminNewPassword ? "text" : "password"}  
                class="form-control" 
                id="floatingInput" 
                placeholder="New password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label for="floatingInput">New Password</label>
              <i
                onClick={toggleAdminNewPasswordVisibility}
                className={`bi ${showAdminNewPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} position-absolute`}
                style={{ top: '50%', right: '25px', transform: 'translateY(-50%)', cursor: 'pointer' }}
              ></i>
            </div>
            <div class="form-floating mb-3">
              <input 
                type={showAdminNewPassword ? "text" : "password"} 
                class="form-control" 
                id="floatingInput" 
                placeholder="Confirm new password" 
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
              <label for="floatingInput">Confirm new password</label>
            </div>
            { passwordChangeError && <p className="text-danger">{passwordChangeError}</p> }
          </div>
          <button 
          className={`btn btn-primary me-3 px-5 ${currentPassword && newPassword && newPasswordConfirm ? "" : "disabled"}`} 
          onClick={() => setPasswordUpdateConfirmation(true)}
          >Update</button>
          <button 
          className={`btn btn-primary me-3 px-5 ${currentPassword && newPassword && newPasswordConfirm ? "" : "disabled"}`}
          onClick={handlePasswordChangeCancel}
          >Cancel</button>
        </div>
        <div className="ms-5 container mt-5">
          <h6>Add new admin account</h6>
          <div className="row ms-3">
            <div className="form-floating mb-3">
              <input 
                type="text" 
                class="form-control" 
                id="floatingInput" 
                placeholder="Name" 
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
              />
              <label for="floatingInput">Name</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type="email" 
                class="form-control" 
                id="floatingInput" 
                placeholder="Email" 
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
              <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <input 
                type={showNewAdminPassword ? "text" : "password"} 
                class="form-control" 
                id="floatingInput" 
                placeholder="Password" 
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
              />
              <label for="floatingInput">Password</label>
              <i
                onClick={toggleNewAdminPasswordVisibility}
                className={`bi ${showNewAdminPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} position-absolute`}
                style={{ top: '50%', right: '25px', transform: 'translateY(-50%)', cursor: 'pointer' }}
              ></i>
            </div>
            <div class="form-floating mb-3">
              <input 
                type={showNewAdminPassword ? "text" : "password"} 
                class="form-control" 
                id="floatingInput" 
                placeholder="Confirm Password" 
                value={newAdminPasswordConfirm}
                onChange={(e) => setNewAdminPasswordConfirm(e.target.value)}
              />
              <label for="floatingInput">Confirm Password</label>
            </div>
          </div>
          {newAdminInfo && <p className="text-primary">{newAdminInfo}</p>}
          { newAdminError && <p className="text-danger">{newAdminError}</p> }
          <button 
          className={`btn btn-primary me-3 px-5 ${newAdminName && newAdminEmail && newAdminPassword && newAdminPasswordConfirm ? "" : "disabled"}`}
          onClick={addNewAdmin}>
            Add</button>
          <button 
          className={`btn btn-primary me-3 px-5 ${newAdminName || newAdminEmail || newAdminPassword || newAdminPasswordConfirm ? "" : "disabled"}`}
          onClick={handleNewAdminCancel}>Cancel</button>
        </div>
      </div>
      {
        passwordUpdateConfirmation && (
          <div className="popup d-flex justify-content-center align-items-center">
            <div className="popup-content p-4 bg-white rounded shadow">
              <h5>Confirm password update</h5>
              <p>Are you sure you want to update your password?</p>
              <p className="fw-light fst-italic">You will be automatically logged out once you updated your password.</p>
              <div className="d-flex justify-content-end">
                <button 
                className="btn btn-primary me-3"
                onClick={updatePassword}>Yes, update</button>
                <button 
                className="btn btn-secondary" 
                onClick={() => setPasswordUpdateConfirmation(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default AdminSettings;
