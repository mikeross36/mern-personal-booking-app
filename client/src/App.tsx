import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ERoutes } from "./@types/links";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useAppContext } from "./hooks";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyAccount from "./components/VerifyAccount";
import ResetPassword from "./pages/ResetPassword";
import UserAccount from "./pages/UserAccount";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import SearchPage from "./pages/SearchPage";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import BookingPage from "./pages/BookingPage";

export default function App() {
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route
            path={ERoutes.home}
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path={ERoutes.register}
            element={
              <Layout>
                <RegisterPage />
              </Layout>
            }
          />
          <Route
            path={ERoutes.login}
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path={`${ERoutes.verify}/:verificationString`}
            element={
              <Layout>
                <VerifyAccount />
              </Layout>
            }
          />
          <Route
            path={`${ERoutes.resetpassword}/:resetString`}
            element={
              <Layout>
                <ResetPassword />
              </Layout>
            }
          />
          <Route
            path={ERoutes.search}
            element={
              <Layout>
                <SearchPage />
              </Layout>
            }
          />
          <Route
            path={`${ERoutes.hoteldetails}/:id`}
            element={
              <Layout>
                <HotelDetails />
              </Layout>
            }
          />
          {userInfo && (
            <>
              <Route
                path={ERoutes.useraccount}
                element={
                  <Layout>
                    <UserAccount />
                  </Layout>
                }
              />
              <Route
                path={ERoutes.addhotel}
                element={
                  <Layout>
                    <AddHotel />
                  </Layout>
                }
              />
              <Route
                path={ERoutes.myhotels}
                element={
                  <Layout>
                    <MyHotels />
                  </Layout>
                }
              />
              <Route
                path={`${ERoutes.edithotel}/:hotelId`}
                element={
                  <Layout>
                    <EditHotel />
                  </Layout>
                }
              />
              <Route
                path={`${ERoutes.hotel}/:hotelId/booking`}
                element={
                  <Layout>
                    <BookingPage />
                  </Layout>
                }
              />
              <Route
                path={ERoutes.mybookings}
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }
              />
              <Route path="*" element={<Navigate to={ERoutes.home} />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
