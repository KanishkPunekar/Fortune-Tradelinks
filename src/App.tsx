// Latin subset only: every character the site uses (incl. © · —) is in it.
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import './styles/global.css';
import './styles/components.css';

import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router';
import { pages, type PageKey } from './config/pages';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import EthanolSupply from './pages/EthanolSupply';
import Industries from './pages/Industries';
import Logistics from './pages/Logistics';
import QualityDocumentation from './pages/QualityDocumentation';
import Compliance from './pages/Compliance';
import RequestAQuote from './pages/RequestAQuote';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

const routes: Record<PageKey, ReactElement> = {
  home: <Home />,
  about: <AboutUs />,
  products: <Products />,
  ethanolSupply: <EthanolSupply />,
  industries: <Industries />,
  logistics: <Logistics />,
  quality: <QualityDocumentation />,
  compliance: <Compliance />,
  quote: <RequestAQuote />,
  contact: <Contact />,
  privacy: <PrivacyPolicy />,
  terms: <Terms />,
};

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {(Object.keys(routes) as PageKey[]).map((key) => (
          // caseSensitive matches getPageMeta() and static hosts: "/About-Us" is a 404, not About with 404 metadata.
          <Route key={key} path={pages[key].path} element={routes[key]} caseSensitive />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
