import React from 'react'

const ResetPasswordPage = () => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg w-full px-6 py-12 bg-gray-800 rounded-2xl shadow-lg">
        {/* Section header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Forgot your password?
          </h1>
          <p className="mt-2 text-gray-400">
            Enter your email, and we'll send you a link to reset your password.
          </p>
        </div>
        {/* Reset form */}
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="mt-2 w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition">
            Send Reset Link
          </button>
        </form>
        {/* Back to login */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <a href="/SignIn" className="text-indigo-400 hover:underline">
            SignIn
          </a>
        </div>
      </div>
    </section>
  )
}

export default ResetPasswordPage
