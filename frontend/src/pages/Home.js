import React, { useState } from "react";
import Navbar from "./../components/Navbar";
import "./../scss/Home.scss";
import axios from "axios";

const Home = () => {
  const [signup, setSignup] = useState(false);
  const [signin, setSignin] = useState(false);
  const [upload, setUpload] = useState(false);

  // for login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // for signup state
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [spasswprd, ssetPasswprd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [images, setImages] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  // signup popup box
  const signupPopUp = () => {
    setSignup(!signup);
  };

  // signin popup box
  const signinPopUp = () => {
    setSignin(!signin);
  };

  // upload images popup box
  const uploadImagePopUp = () => {
    setUpload(!upload);
  };

  // upload image function
  const uploadImage = async (evt) => {
    evt.preventDefault();
    if (!user) {
      alert("please signin to upload image");
      return;
    }
    let form = new FormData();
    let name = document.getElementById("name").value;
    let image = document.getElementById("file").files[0];
    if (name) {
      form.append("name", name);
    }
    if (image) {
      form.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/users/upload",
        form,
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        alert("image uploaded.");
        window.location.reload();
      }
    } catch (err) {
      alert(err.response.data.message);
      console.log(err.response);
    }
  };

  // get images to display
  const getImages = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/users/images",
      {
        withCredentials: true,
      }
    );
    localStorage.setItem("userImages", JSON.stringify(data.data.images));
    setImages(data.data.images);
    console.log(data);
  };

  // signup
  const handleSignup = async (evt) => {
    evt.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/users/signup",
        {
          firstname,
          lastname,
          email: emailAddress,
          password: spasswprd,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      if (data.status === "success") {
        window.location.replace("/");
      }
      alert("signup successful..!");
    } catch (err) {
      alert(err.response.data.message);
      console.log(err.response);
    }
  };

  //  signin
  const handleSignin = async (evt) => {
    evt.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/users/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(data));
      if (data.status === "success") {
        window.location.replace("/");
      }
      alert("signin successful..!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  // signout
  const handleSignOut = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/signout");
      console.log(data);

      if (data.status === "success") {
        localStorage.removeItem("user");
        alert(data.message);
        window.location.reload();
      }
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar
        signinPopUp={signinPopUp}
        signupPopUp={signupPopUp}
        signout={handleSignOut}
        getImages={getImages}
        uploadImagePopUp={uploadImagePopUp}
      />
      {!user && <div className='mes'>sign in to see your images</div>}
      {images && (
        <div className='images-container'>
          {images.map((image) => (
            <div key={image.name} className='image-box'>
              <img
                className='image'
                src={`/images/${image.image}`}
                alt='asdasdas'
              />
              <div className='image-txt'>{image.name}</div>
            </div>
          ))}
        </div>
      )}
      {signup && (
        <div className='background-box'>
          <div className='signup-box'>
            <span onClick={signupPopUp} className='cross'>
              &#10005;
            </span>
            <div className='step1'>
              <h2 className='heading__secondary'>Sign Up</h2>
              <div className='heading__sub'>It's quick and easy</div>

              <form onSubmit={handleSignup} className='form__signup'>
                <input
                  onChange={(evt) => setFirstname(evt.target.value)}
                  className='form__input'
                  type='text'
                  placeholder='First Name'
                  required
                />
                <input
                  onChange={(evt) => setLastname(evt.target.value)}
                  className='form__input'
                  type='text'
                  placeholder='Last Name'
                  required
                />
                <input
                  onChange={(evt) => setEmailAddress(evt.target.value)}
                  className='form__input custom__input'
                  type='email'
                  placeholder='Email'
                  required
                />
                <input
                  onChange={(evt) => ssetPasswprd(evt.target.value)}
                  className='form__input custom__input'
                  type='password'
                  placeholder='Password'
                  required
                />
                <input
                  onChange={(evt) => setConfirmPassword(evt.target.value)}
                  className='form__input custom__input'
                  type='password'
                  placeholder='Confirm Password'
                  required
                />
                <button type='submit' className='btn btn-submit custom__input'>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* end of sign up */}

      {upload && (
        <div className='background-box'>
          <div className='signin-box'>
            <span onClick={uploadImagePopUp} className='cross'>
              &#10005;
            </span>
            <div className='step1'>
              <h2 className='heading__secondary'>Upload image</h2>

              <form onSubmit={uploadImage} className='form__signup'>
                <input
                  id='name'
                  onChange={(evt) => setEmail(evt.target.value)}
                  className='form__input custom__input'
                  type='text'
                  placeholder='Name'
                />
                <input
                  id='file'
                  className='form__input custom__input'
                  type='file'
                />
                <button type='submit' className='btn btn-submit custom__input'>
                  upload
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {signin && (
        <div className='background-box'>
          <div className='signin-box'>
            <span onClick={signinPopUp} className='cross'>
              &#10005;
            </span>
            <div className='step1'>
              <h2 className='heading__secondary'>Sign In</h2>

              <form onSubmit={handleSignin} className='form__signup'>
                <input
                  onChange={(evt) => setEmail(evt.target.value)}
                  className='form__input custom__input'
                  type='text'
                  placeholder='Email'
                  required
                />
                <input
                  onChange={(evt) => setPassword(evt.target.value)}
                  className='form__input custom__input'
                  type='password'
                  placeholder='Password'
                  required
                />
                <button type='submit' className='btn btn-submit custom__input'>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
