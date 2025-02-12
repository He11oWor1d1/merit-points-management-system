import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom'

function TeachersNavbar(){
  const [logoUrl, setLogoUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function getLogo(){
      try{
        const response = await api.get('/logo');
        setLogoUrl(response.data.path);
      }
      catch(err){
        console.log(err);
      }
    }

    getLogo();
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return(
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand ms-4" to="/">
            <div style={{ maxWidth: "73px" }}>
              <img src={logoUrl} className="img-fluid" alt="Logo" />
            </div>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={`nav-link navLink ${isActive('/manage-merit-points') ? 'active' : ''}`} to="/manage-merit-points">Manage-merit-points</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link navLink ${isActive('/leaderboard') ? 'active' : ''}`} to="/leaderboard">Leaderboard</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0 me-5">
              {/* <li>
                <NavLink className={`nav-link navLink ${isActive('/announcements') ? 'active' : ''}`} to="/announcements">Announcements</NavLink>
              </li> */}
              <li>
                <NavLink className={`nav-link navLink ${isActive('/settings') ? 'active' : ''}`} to="/settings">Settings</NavLink>
              </li>
              <li>
                <NavLink className={`nav-link navLink ${isActive('/logout') ? 'active' : ''}`} to="/logout"><i className="bi bi-box-arrow-left"></i> Logout</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default TeachersNavbar
