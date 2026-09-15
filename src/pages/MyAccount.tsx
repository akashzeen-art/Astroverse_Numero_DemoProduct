import Layout from "@/components/Layout";

const MyAccount = () => (
  <Layout>
    <div className="px-4 max-w-lg mx-auto py-12">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center">
        <h1 className="text-2xl font-black text-white mb-1">My Account</h1>
        <p className="text-purple-400 text-sm font-bold mb-6">Sign In</p>
        <p className="text-white/70 text-base font-semibold mb-2">Access your account</p>
        <p className="text-white/40 text-sm mb-8">
          Sign in with your registered mobile number to access your subscription and enjoy unlimited astrology content.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors mb-3"
        >
          Sign In / Subscribe
        </button>
        <p className="text-white/30 text-xs">New here? Subscribe now to get started.</p>
      </div>
    </div>
  </Layout>
);

export default MyAccount;
