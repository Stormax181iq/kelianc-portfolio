import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { isLocale } from "@kelianc/shared";
import LocaleLayout from "./components/LocaleLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import BeyondCode from "./pages/BeyondCode";
import LearningPortfolio from "./pages/LearningPortfolio";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en" replace />} />
      <Route path="/:locale/*" element={<LocaleGuard />} />
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  );
}

function LocaleGuard() {
  const { locale } = useParams();
  if (!isLocale(locale)) return <Navigate to="/en" replace />;
  return (
    <Routes>
      <Route path="/" element={<LocaleLayout locale={locale} />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="beyond" element={<BeyondCode />} />
        <Route path="learning" element={<LearningPortfolio />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
