import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import jwt from "jwt-decode";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Home from "../Com-1/Home";

const Login = () => {
  const navigate = useNavigate();
  const [sign, setSign] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");

  var digit = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digit[Math.floor(Math.random() * 10)];
  }
  console.log("otp", otp);

  //check facebook siginup
  const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    swal({
      title: "LOGIN SUCCESS!",
      text: "welcome",
      icon: "success",
      button: "OK",
    });
    facebooksingin(response);
    if (response.status === "unknown") {
      alert("Login failed!");
    }
  };

  // login database
  const signin = () => {
    let data = {
      username: mail,
      password: password,
    };
    axios
      .post("http://localhost:8080/user/Login", data)
      .then((result) => {
        console.log("data", result.data);
        console.log(JSON.stringify(result));
        console.log("jagn", result.data.status);
        if (result.data.status == "success") {
          swal({
            title: "LOGIN SUCCESS!",
            text: "welcome",
            icon: "success",
            button: "OK",
          });
          navigate("/home", { state: result.data });
        } else {
          swal("userName and password is Wrong!");
        }
        setData(result);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  //facebook signup
  const facebooksingin = async (decode) => {
    let Data = {
      username: decode.name,
      phone: "1234567890",
      email: `bmjagan17@gmail.com`,
      password: "bike",
      loginType: "Facebook",
    };
    console.log("logintype", Data);
    await axios
      .post("http://localhost:8080/user/Register", Data)
      .then((userData) => {
        console.log("data", userData.result);
        console.log("result", JSON.stringify(userData));
        console.log("status", userData.data.status);
        if (userData.data.status == "success") {
          swal({
            title: "REGISTER SUCCESS!",
            text: "welcome",
            icon: "success",
            button: "OK",
          });
        }
        navigate("/home", { state: userData.data });
      })
      .catch((err) => {
        console.log("err", err.message);
        //swal("User Already Exist!");
        googlesignin(decode);
      });
  };

  // google register in database
  const autosing = async (decode) => {
    let Data = {
      username: decode.name,
      phone: `${decode.phone}`,
      email: decode.email,
      password: "bike",
      loginType: "google",
    };
    console.log("logintype", Data);
    await axios
      .post("http://localhost:8080/user/Register", Data)
      .then((userData) => {
        console.log("data", userData.data.result.email);
        console.log("result", JSON.stringify(userData));
        console.log("status", userData.data.status);
        if (userData.data.status == "success") {
          let email = userData.data.result.email;
          swal("Enter you mobile number:", {
            content: "input",
          }).then((value) => {
            // moblienumber(value,uuid);
            verify(value, email);
          });
        }

        navigate("/home", { state: userData.data });
      })
      .catch((err) => {
        console.log("err", err.message);
        googlesignin(decode);
      });
  };

  //verify mobile number
  const verify = async (value, email) => {
    let smsdata = {
      number: value,
      text: "this your otp :" + otp,
    };
    await axios
      .post("http://localhost:8080/user/sms", smsdata)
      .then((result) => {
        console.log("otp sended your mobile number");
        swal("Enter your OTP :", {
          content: "input",
        })
          .then((digit) => {
            if (otp == digit) {
              moblienumber(value, email);
              console.log("its same");
            } else {
              swal("please enter valid OTP!");
            }
          })
          .catch((err) => {
            console.log("err", err.message);
            swal("somthing went wrong!");
          });
      });
  };

  //moblie number update
  const moblienumber = (value, email) => {
    console.log("uuid", email);
    console.log("vla", value);
    let detail = {
      email: email,
      phone: value,
    };
    axios
      .put(`http://localhost:8080/user/update`, detail)
      .then((result) => {
        if ((result.data.status = "success")) {
          swal({
            title: "REGISTER SUCCESS!",
            text: "welcome",
            icon: "success",
            button: "OK",
          });
        }
        console.log("datas", result.data.result);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  // google login in database
  const googlesignin = async (decode) => {
    let data = {
      username: decode.email,
      password: "bike",
    };
    await axios
      .post("http://localhost:8080/user/Login", data)
      .then((result) => {
        console.log("data", result.data);
        if (result.data.status == "success") {
          swal({
            title: "LOGIN SUCCESS!",
            text: "welcome",
            icon: "success",
            button: "OK",
          });
          navigate("/home", { state: result.data });
        } else {
          swal("userName and password is Wrong!");
        }
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  //check google siginup
  const handleLogin = (googleData) => {
    console.log("data", googleData.credential);
    var decode = jwt(googleData.credential);
    console.log(decode);
    console.log(decode.name);
    console.log(decode.picture);
    setData(decode);
    //    navigate('/home',{state:decode})
    console.log("string", JSON.stringify(googleData));
    autosing(decode);
  };

  const handleFailure = (result) => {
    console.log(result);
    alert("fail");
  };

  return (
    <>
      <div className="con">
        <div className=" center">
          <div className="container aline">
            <div className="img">
              <img src="https://images.theconversation.com/files/433956/original/file-20211125-23-vzbjao.jpeg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop" />
            </div>

            <div className="right">
              <h4>SIGN-IN</h4>
              <form>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(p) => setMail(p.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  onChange={(p) => setPassword(p.target.value)}
                />
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1365px-Facebook_f_logo_%282019%29.svg.png" width="40"></img>
               <img src="https://image.similarpng.com/very-thumbnail/2020/12/Flat-design-Google-logo-design-Vector-PNG.png" width="40"></img><br></br>        */}
                <button type="button" className="btn1" onClick={signin}>
                  Login
                </button>
                <br></br>
                <span onClick={() => (window.location.href = "/signup")}>
                  Create New Account
                </span>
                <br></br>
                <span onClick={() => (window.location.href = "/forget")}>
                  Forget-password
                </span>
                <br></br>
                <br></br>
              </form>
              <div className="google">
                <GoogleOAuthProvider clientId="551835202218-qttsmjeipdj01fnoia1q7s3tkmdln7fb.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleLogin}
                    onError={handleFailure}
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="facebook">
                <FacebookLogin
                  appId="355457510062045"
                  autoLoad={false}
                  fields="name,email,picture"
                  scope="public_profile,email,user_friends"
                  callback={responseFacebook}
                  icon="fa-facebook"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;







import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

function RegisterProperty() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="State" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
  );
}

export default RegisterProperty;

