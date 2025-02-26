import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg">
        {/* Section header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Create an Account
          </h1>
          <p className="text-gray-400">Join us and start your journey today.</p>
        </div>

        {/* Contact form */}
        <form>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="name">
                Name <span className="text-red-500">*</span>
              </label>
              <input id="name" type="text" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400" placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input id="email" type="email" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400" placeholder="Your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input id="password" type="password" className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400" placeholder="Password (at least 10 characters)" required />
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300">
              Register
            </button>
          </div>
        </form>

        {/* Bottom link */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link className="font-medium text-green-400 hover:underline" href="/SignIn">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
