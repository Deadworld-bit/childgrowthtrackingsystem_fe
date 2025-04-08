interface User {
  specialization?: string;
  certificate?: string;
}

interface DoctorSpecializationProps {
  user: User;
  openSpecModal: () => void;
}

const DoctorSpecialization = ({ user, openSpecModal }: DoctorSpecializationProps) => {
    return (
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-8 flex flex-col h-full">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Specialization</h3>
          <p className="text-gray-200 mb-6 text-center">{user.specialization || "Not specified"}</p>
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Certificate</h3>
          <img
            src={user.certificate || "/placeholder.png"}
            alt="Certificate"
            className="w-full h-auto max-h-64 object-contain rounded-lg mb-6"
          />
          <div className="mt-auto flex justify-center">
            <button
              onClick={openSpecModal}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition duration-200"
            >
              Update Specialization
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DoctorSpecialization;