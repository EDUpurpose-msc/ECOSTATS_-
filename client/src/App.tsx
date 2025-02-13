import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/Home/HomePage'
import Login from './pages/Home/Login/Login'
import Users from './pages/Admin/Users/Users'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import { useEffect } from 'react'
import { getUserById, isAuthenticated } from './services/api/userApi'
import { useAuthStore } from './stores/useAuthStore'
import { jwtDecode } from 'jwt-decode'
import Cookies from "js-cookie"
import { ConfigProvider, Layout, message } from 'antd'
import axios from 'axios'
import Programs from './pages/Admin/Programs/Programs'
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS for the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional theme
import Admin from './pages/Admin/Admin'
import Navbar from './components/Navbar/Navbar'
import Reports from './pages/Reports/Reports'
import LandingPage from './pages/Home/LandingPage'
import ErrorLog from './components/ErrorLog'
import { useErrorLogStore } from './stores/useErrorLogStore'
import ToApprove from './pages/Reports/ApprovalWorkFlow/ToApprove'
import ToReview from './pages/Reports/ApprovalWorkFlow/ToReview'
import Dashboard from './pages/Dashboard/Dashboard'
import ForgotPassword from './pages/Home/ForgotPassword.tsx/ForgotPassword'
import ResetPassword from './pages/Home/ForgotPassword.tsx/ResetPassword'
import Data from './pages/Admin/Budget/Data'
import BudgetAnalytics from './pages/Admin/Budget/BudgetAnalytics'
import EmailVerifiedResult from './pages/Home/EmailVerifiedResult'
import SendVerification from './pages/Home/SendVerification'
import Profile from './pages/Profile'
import Sectors from './pages/Admin/Configurations/Sector'
import ReportsConfiguration from './pages/Admin/Configurations/ReportsConfiguration'
import Report from './pages/Reports/DataEntry/Report'
import ReportDashboard from './pages/Dashboard/ReportDashboard'
import Index from './pages/Admin/Index'
import ReportsIndex from './pages/Reports/ReportsIndex'
import DashboardIndex from './pages/Dashboard/Index'
import ColorSchemeConfiguration from './pages/Admin/Configurations/ColorSchemeConfig'

axios.defaults.withCredentials = true;

function App() {
  const {setUser, accessToken} = useAuthStore();


  const configTheme = {
    "token": {
      "colorPrimary": "#41a61d",
      "colorInfo": "#41a61d"
    }
  }

  const initUser = () => {
    try {
      isAuthenticated().then(_isAuth => {
        if(_isAuth){
          // fetch user
          const decoded = jwtDecode<any>(Cookies.get("accessToken"))
          const id = decoded.id
          getUserById(id).then(res => {
            setUser(res.data)
          });
        }
        else{
          setUser(null);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initUser();
  }, [accessToken])

  return (
    <ConfigProvider
      theme={configTheme}>
      <BrowserRouter >
        <Layout className="h-screen">
            <Navbar />
            <Layout className="h-full">
              <Routes >
                <Route path='/' element={<HomePage />} >
                  <Route path="" element={<LandingPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="login" element={<Login />} />
                  {/* <Route path="signup" element={<SignUp />} /> */}
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="email-verified" element={<EmailVerifiedResult />} />
                  <Route path="verify-email/:email" element={<SendVerification />} />
                </Route>

                <Route path='admin' element={<Admin />}>
                  <Route path='' element={<Index />} />
                  <Route path='users' element={<Users />} />
                  <Route path='programs' element={<Programs />} />
                  <Route path="configurations/sectors" element={<Sectors />} />
                  <Route path="configurations/reports" element={<ReportsConfiguration />} />
                  <Route path="configurations/color-schemes" element={<ColorSchemeConfiguration />} />
                  <Route path='budgets'  > 
                    <Route path='data' element={<Data />} />
                    <Route path='' element={<BudgetAnalytics />} />
                  </Route>
                </Route>

                <Route path='dashboard' element={<Dashboard />}>
                  <Route path='' element={<DashboardIndex />} />

                  <Route path='report/:_id' element={<ReportDashboard />} />
                  
                  {/* <Route path='' element={<Overview />} /> */}

                  {/* <Route path='land_1' element={<Land_1_Dashboard />} />
                  <Route path='land_2' element={<Land_2_Dashboard />} />
                  <Route path='land_3' element={<Land_3_Dashboard />} />
                  <Route path='land_4' element={<Land_4_Dashboard />} />
                  <Route path='land_5' element={<Land_5_Dashboard />} />
                  <Route path='land_6' element={<Land_6_Dashboard />} />
                  <Route path='land_7' element={<Land_7_Dashboard />} />

                  <Route path='forestry_1' element={<Forestry_1_Dashboard />} />
                  <Route path='forestry_2' element={<Forestry_2_Dashboard />} />
                  <Route path='forestry_3' element={<Forestry_3_Dashboard />} />
                  <Route path='forestry_4' element={<Forestry_4_Dashboard />} />
                  <Route path='forestry_5' element={<Forestry_5_Dashboard />} />
                  <Route path='forestry_6' element={<Forestry_6_Dashboard />} />
                  <Route path='forestry_7' element={<Forestry_7_Dashboard />} />
                  <Route path='forestry_8' element={<Forestry_8_Dashboard />} />
                  <Route path='forestry_9' element={<Forestry_9_Dashboard />} />
                  <Route path='forestry_10' element={<Forestry_10_Dashboard />} />
                  <Route path='forestry_11' element={<Forestry_11_Dashboard />} />
                  <Route path='forestry_12' element={<Forestry_12_Dashboard />} />    
                  <Route path='forestry_13' element={<Forestry_13_Dashboard />} />
                  <Route path='forestry_14' element={<Forestry_14_Dashboard />} />
                  <Route path='forestry_15' element={<Forestry_15_Dashboard />} />
                  <Route path='forestry_16' element={<Forestry_16_Dashboard />} />
                  <Route path='forestry_17' element={<Forestry_17_Dashboard />} /> 
                  <Route path='forestry_18' element={<Forestry_18_Dashboard />} />
                  <Route path='forestry_19' element={<Forestry_19_Dashboard />} />


                  <Route path='forestry_24' element={<Forestry_24_Dashboard />} />

                  <Route path='biodiversity_2' element={<Biodiversity_2_Dashboard />} />
                  <Route path='biodiversity_3' element={<Biodiversity_3_Dashboard />} />
                  <Route path='biodiversity_4' element={<Biodiversity_4_Dashboard />} />
                  <Route path='biodiversity_5' element={<Biodiversity_5_Dashboard />} />
                  <Route path='biodiversity_6' element={<Biodiversity_6_Dashboard />} />
                  <Route path='biodiversity_7' element={<Biodiversity_7_Dashboard />} />
                  <Route path='biodiversity_8' element={<Biodiversity_8_Dashboard />} />
                  <Route path='biodiversity_9' element={<Biodiversity_9_Dashboard />} />
                  <Route path='biodiversity_10' element={<Biodiversity_10_Dashboard />} />
                  <Route path='biodiversity_11' element={<Biodiversity_11_Dashboard />} />
                  <Route path='biodiversity_12' element={<Biodiversity_12_Dashboard />} />

                  <Route path='biodiversity_15' element={<Biodiversity_15_Dashboard />} />
                  <Route path='biodiversity_16' element={<Biodiversity_16_Dashboard />} />
                  <Route path='biodiversity_17' element={<Biodiversity_17_Dashboard />} />

                  <Route path='biodiversity_19' element={<Biodiversity_19_Dashboard />} />
                  <Route path='biodiversity_20' element={<Biodiversity_20_Dashboard />} />
                  <Route path='biodiversity_21' element={<Biodiversity_21_Dashboard />} />
                  <Route path='biodiversity_22' element={<Biodiversity_22_Dashboard />} />
                  <Route path='biodiversity_23' element={<Biodiversity_23_Dashboard />} />
                  <Route path='biodiversity_24' element={<Biodiversity_24_Dashboard />} />
                  <Route path='biodiversity_25' element={<Biodiversity_25_Dashboard />} />
                  <Route path='biodiversity_26' element={<Biodiversity_26_Dashboard />} />
                  <Route path='biodiversity_27' element={<Biodiversity_27_Dashboard />} />
                  <Route path='biodiversity_28' element={<Biodiversity_28_Dashboard />} />
                  <Route path='biodiversity_29' element={<Biodiversity_29_Dashboard />} />
                  <Route path='biodiversity_30' element={<Biodiversity_30_Dashboard />} />
                  <Route path='biodiversity_31' element={<Biodiversity_31_Dashboard />} />
                  <Route path='biodiversity_32' element={<Biodiversity_32_Dashboard />} />
                  <Route path='biodiversity_33' element={<Biodiversity_33_Dashboard />} /> */}
                </Route>

                <Route path='reports' element={<Reports />}>
                    <Route path='' element={<ReportsIndex />} />
                    <Route path='to-approve' element={<ToApprove />} />
                    <Route path='to-review' element={<ToReview />} />

                    <Route path='report/:_id' element={<Report />} />

                    {/* <Route path={Sector.LAND} >
                      <Route path='toc' element={<LandTOC />} />
                      <Route path='land_1' element={<Land_1 />} />
                      <Route path='land_2' element={<Land_2 />} />
                      <Route path='land_3' element={<Land_3 />} />
                      <Route path='land_4' element={<Land_4 />} />
                      <Route path='land_5' element={<Land_5 />} />
                      <Route path='land_6' element={<Land_6 />} />
                      <Route path='land_7' element={<Land_7 />} />
                    </Route>
                    
                    <Route path={Sector.FORESTRY} >
                      <Route path={FormEnum.FORESTRY_1} element={<Forestry_1 />} />
                      <Route path={FormEnum.FORESTRY_2} element={<Forestry_2 />} />
                      <Route path={FormEnum.FORESTRY_3} element={<Forestry_3 />} />
                      <Route path={FormEnum.FORESTRY_4} element={<Forestry_4 />} />
                      <Route path={FormEnum.FORESTRY_5} element={<Forestry_5 />} />
                      <Route path={FormEnum.FORESTRY_6} element={<Forestry_6 />} />
                      <Route path={FormEnum.FORESTRY_7} element={<Forestry_7 />} />
                      <Route path={FormEnum.FORESTRY_8} element={<Forestry_8 />} />
                      <Route path={FormEnum.FORESTRY_9} element={<Forestry_9 />} />
                      <Route path={FormEnum.FORESTRY_10} element={<Forestry_10 />} />
                      <Route path={FormEnum.FORESTRY_11} element={<Forestry_11 />} />
                      <Route path={FormEnum.FORESTRY_12} element={<Forestry_12 />} />
                      <Route path={FormEnum.FORESTRY_13} element={<Forestry_13 />} />
                      <Route path={FormEnum.FORESTRY_14} element={<Forestry_14 />} />
                      <Route path={FormEnum.FORESTRY_15} element={<Forestry_15 />} />
                      <Route path={FormEnum.FORESTRY_16} element={<Forestry_16 />} />
                      <Route path={FormEnum.FORESTRY_17} element={<Forestry_17 />} />
                      <Route path={FormEnum.FORESTRY_18} element={<Forestry_18 />} />
                      <Route path={FormEnum.FORESTRY_19} element={<Forestry_19 />} />

                      
                      <Route path={FormEnum.FORESTRY_24} element={<Forestry_24 />} />
                    </Route>

                    <Route path={Sector.BIODIVERSITY} >
                      <Route path={FormEnum.BIODIVERSITY_2} element={<Biodiversity_2 />} />
                      <Route path={FormEnum.BIODIVERSITY_3} element={<Biodiversity_3 />} />
                      <Route path={FormEnum.BIODIVERSITY_4} element={<Biodiversity_4 />} />
                      <Route path={FormEnum.BIODIVERSITY_5} element={<Biodiversity_5 />} />
                      <Route path={FormEnum.BIODIVERSITY_6} element={<Biodiversity_6 />} />
                      <Route path={FormEnum.BIODIVERSITY_7} element={<Biodiversity_7 />} />
                      <Route path={FormEnum.BIODIVERSITY_8} element={<Biodiversity_8 />} />
                      <Route path={FormEnum.BIODIVERSITY_9} element={<Biodiversity_9 />} />
                      <Route path={FormEnum.BIODIVERSITY_10} element={<Biodiversity_10 />} />
                      <Route path={FormEnum.BIODIVERSITY_11} element={<Biodiversity_11 />} />
                      <Route path={FormEnum.BIODIVERSITY_12} element={<Biodiversity_12 />} />

                      <Route path={FormEnum.BIODIVERSITY_15} element={<Biodiversity_15 />} />
                      <Route path={FormEnum.BIODIVERSITY_16} element={<Biodiversity_16 />} />
                      <Route path={FormEnum.BIODIVERSITY_17} element={<Biodiversity_17 />} />

                      <Route path={FormEnum.BIODIVERSITY_19} element={<Biodiversity_19 />} />
                      <Route path={FormEnum.BIODIVERSITY_20} element={<Biodiversity_20 />} />
                      <Route path={FormEnum.BIODIVERSITY_21} element={<Biodiversity_21 />} />
                      <Route path={FormEnum.BIODIVERSITY_22} element={<Biodiversity_22 />} />
                      <Route path={FormEnum.BIODIVERSITY_22} element={<Biodiversity_22 />} />
                      <Route path={FormEnum.BIODIVERSITY_23} element={<Biodiversity_23 />} />
                      <Route path={FormEnum.BIODIVERSITY_24} element={<Biodiversity_24 />} />
                      <Route path={FormEnum.BIODIVERSITY_25} element={<Biodiversity_25 />} />
                      <Route path={FormEnum.BIODIVERSITY_26} element={<Biodiversity_26 />} />
                      <Route path={FormEnum.BIODIVERSITY_27} element={<Biodiversity_27 />} />
                      <Route path={FormEnum.BIODIVERSITY_28} element={<Biodiversity_28 />} />
                      <Route path={FormEnum.BIODIVERSITY_29} element={<Biodiversity_29 />} />
                      <Route path={FormEnum.BIODIVERSITY_30} element={<Biodiversity_30 />} />
                      <Route path={FormEnum.BIODIVERSITY_31} element={<Biodiversity_31 />} />
                      <Route path={FormEnum.BIODIVERSITY_32} element={<Biodiversity_32 />} />
                      <Route path={FormEnum.BIODIVERSITY_33} element={<Biodiversity_33 />} />
                    </Route> */}
                </Route>

                {/* Error Pages */}
                <Route path="/error/401" element={<ErrorPage code={401} message="Unauthorized Access" />} />

              </Routes>
            </Layout>
        </Layout>

        <ErrorLog  />
        
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
