import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => (
  <Layout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
        Back to Home
      </Link>
    </div>
  </Layout>
);

export default NotFound;
