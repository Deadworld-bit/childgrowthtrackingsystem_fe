import { FaEnvelope, FaLock, FaUserShield, FaCalendarAlt, FaEye, FaEyeSlash } from "react-icons/fa";

interface User {
  username: string;
  email: string;
  role: string;
  createdDate: Date;
  password: string;
}

interface ProfileCardProps {
  user: User;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  openUpdateModal: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, showPassword, setShowPassword, openUpdateModal }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden w-full lg:w-[800px] flex flex-col min-h-[600px]">
      {/* Cover Image */}
      <div className="relative">
        <img src="/parttern01.jpg" alt="Cover" className="w-full h-48 object-cover" />
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <img src="/neutral.png" alt="Avatar" className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 px-8 py-6 flex-1 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">{user.username}</h2>
          <p className="mt-2 text-gray-300 flex items-center justify-center gap-2">
            <FaEnvelope /> {user.email}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {[
            { icon: <FaUserShield />, label: "Role", value: user.role },
            {
              icon: <FaCalendarAlt />,
              label: "Joined",
              value: new Date(user.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            },
            {
              icon: <FaLock />,
              label: "Password",
              value: showPassword ? user.password : "************",
              action: () => setShowPassword(!showPassword),
              actionIcon: showPassword ? <FaEyeSlash /> : <FaEye />,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-700 bg-opacity-30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-gray-300">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="text-lg font-medium text-white">{item.value}</p>
                </div>
              </div>
              {item.action && (
                <button onClick={item.action} className="text-gray-300 hover:text-white">
                  {item.actionIcon}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Update Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={openUpdateModal}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;