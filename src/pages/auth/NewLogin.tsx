import "../../assets/scss/custom/components/_newlogin.scss";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useLocation, Navigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import FeatherIcons from "feather-icons-react";
import logo from "../../assets/images/Logo.png";
import properryImage from "../../assets/images/bro.png";
// actions
import { resetAuth, loginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";
import beers from "../../assets/images/beers.png"

// components
import { VerticalForm, FormInput } from "../../components/";

export const NewLogin = (): JSX.Element => {
  interface UserData {
    email: string;
    password: string;
  }
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const nevigate = useNavigate();
  // const onSubmit = async (formData: any) => {
  //   console.log(formData)
  //   // const response = await login({email:"admin@gmail.com", password: "123456"});
  //   dispatch(loginUser("admin@yopmail.com", "123456"));
  //   nevigate('/users')
  //   // console.log(response);
  // };

  const onSubmit = async (formData: UserData) => {
    dispatch(loginUser(formData["email"], formData["password"]));
    nevigate("/#/dashboard");
  };

  const { user, userLoggedIn, loading, error } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      loading: state.Auth.loading,
      error: state.Auth.error,
      userLoggedIn: state.Auth.userLoggedIn,
    })
  );

  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Please enter Email")),
      password: yup.string().required(t("Please enter Password")),
      // checkbox: yup.bool().oneOf([true]),
    })
  );

  const location = useLocation();
  const redirectUrl = location?.search?.slice(6) || "/";
  return (
    <>
      {userLoggedIn || user ? <Navigate to={redirectUrl}></Navigate> : null}
      <div className="sign-in">
        <div className="login-graphic">
          <img src={beers} alt="" className="w-100 h-100" />
        </div>
        <div className="form-section">
          <section className="sign-up-frame">
            <div className="sign-up-text">
              <h1 className="sign-up">Login</h1>
              <h3 className="create-an-account">Welcome back</h3>
            </div>
            <div className="input-frame">
              <VerticalForm<UserData>
                onSubmit={onSubmit}
                resolver={schemaResolver}
                defaultValues={{ email: "", password: "" }}
                formClass="authentication-form textfield-container"
              >
                <FormInput
                  type="email"
                  name="email"
                  label={t("Email")}
                  startIcon={
                    <FeatherIcons icon={"mail"} className="icon-dual" />
                  }
                  placeholder={t("Enter Email")}
                  containerClass={"mb-3"}
                  className="enter-email"
                  autoComplete={"off"}
                />

                <FormInput
                  type="password"
                  name="password"
                  label={t("Password")}
                  className="enter-password"
                  startIcon={
                    <FeatherIcons icon={"lock"} className="icon-dual" />
                  }
                  placeholder={t("Enter  Password")}
                  containerClass={"mb-3"}
                  autoComplete={"off"}
                ></FormInput>

                <div className="button-54 button-position">
                  <Button
                    style={{ width: "100%" }}
                    className="button-54"
                    type="submit"
                    disabled={loading}
                  >
                    {t("Log In")}
                  </Button>
                </div>
              </VerticalForm>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
