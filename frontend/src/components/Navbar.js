import React from "react";
import "./../scss/Navbar.scss";

const Navbar = ({
  signupPopUp,
  signinPopUp,
  signout,
  getImages,
  uploadImagePopUp,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className='navbar__container'>
      <div className='navbar'>
        <div>
          <button onClick={uploadImagePopUp} className='btn btn-upload'>
            upload image
          </button>
        </div>
        <div className='auth'>
          {!user ? (
            <div>
              <span onClick={signinPopUp} className='btn btn-signin'>
                signin
              </span>
              <span onClick={signupPopUp} className='btn btn-signup'>
                signup
              </span>
            </div>
          ) : (
            <div>
              <span className='btn btn-signin'>{user.data.user.firstname}</span>
              <span onClick={getImages} className='btn btn-signin'>
                my images
              </span>
              <span onClick={signout} className='btn btn-signup'>
                logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
