import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'global';
import { pages } from './pages';
import { onMessageListener } from 'firebaseInit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ layout: Layout, isPublic }) => {
  const [, setNotification] = useState({ title: '', body: '' });

  const auth = useAuth();
  if (isPublic === true || !!auth.user) {
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.data.title,
          body: payload.data.body,
        });
        if (!auth.openNotifiMenu) {
          toast.info(
            <div
              onClick={(e) => {
                window.open(payload.data.url, '_blank', 'noreferrer');
                console.log(payload.data.url);
              }}
            >
              <h1> {payload.data.title}</h1>
              <p> {payload.data.body} </p>
            </div>,
          );
          console.log(payload);
        }
      })
      .catch((err) => console.log('failed: ', err));

    return (
      <Layout>
        <div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
        <Outlet />
      </Layout>
    );
  }
  return <Navigate to="/auth/login" />;
};

const Page = ({ title, component: Comp, ...props }) => {
  const auth = useAuth();

  useEffect(() => {
    auth.setTitlePage('' + title || '');
  }, [title, auth]);

  if (typeof Comp === 'string') {
    return <Navigate to={Comp} />;
  }
  return <Comp {...props} />;
};
const Pages = () => (
  <HashRouter>
    <Routes>
      {pages.map(({ layout, isPublic, child }, index) => (
        <Route key={index} element={<Layout layout={layout} isPublic={isPublic} />}>
          {child.map(({ path, title, component }, subIndex) => (
            <Route exact key={path + subIndex} path={path} element={<Page title={title} component={component} />} />
          ))}
        </Route>
      ))}
    </Routes>
  </HashRouter>
);

export default Pages;
