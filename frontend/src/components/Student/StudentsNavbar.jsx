import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../api';

function StudentsNavbar({ setIsLoggedIn }){
  const [popup, setPopup] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

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

  async function handleLogout(e){
    e.preventDefault();
    setPopup(false);

    try{
      const response = await api.post('/logout');

      setIsLoggedIn(false);
      navigate('/');
    }
    catch(err){
      console.log(err);
    }
  }

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
              {/* <li className="nav-item">
                <NavLink className={`nav-link navLink ${isActive('/my-merit-points') ? 'active' : ''}`} to="my-merit-points">My-merit-points</NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink className={`nav-link navLink ${isActive('/leaderboard') ? 'active' : ''}`} to="leaderboard">Leaderboard</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mb-2 mb-lg-0 me-5">
              {/* <li>
                <NavLink className={`nav-link navLink ${isActive('/announcements') ? 'active' : ''}`} to="/announcements">Announcements</NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink className={`nav-link navLink ${isActive('/settings') ? 'active' : ''}`} to="settings">Settings</NavLink>
              </li>
              <li>
                <a 
                className={`nav-link navLink cursor-progress cursor-pointer`} 
                onClick={() => setPopup(true)}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {
        popup && (
          <div className="popup d-flex justify-content-center align-items-center">
            <div className="popup-content p-4 bg-white rounded shadow">
              <h5>Confirm Logout</h5>
              <p>Are you sure you want to logout?</p>
              <div className="d-flex justify-content-end">
                <button className="btn btn-danger me-3" onClick={handleLogout}>Yes, Logout</button>
                <button className="btn btn-secondary" onClick={() => setPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
        )
      }
    </>
  )
}

export default StudentsNavbar