import React from "react";
import { User } from "@/app/api/user";

interface SetDoctorModalProps {
    isOpen: boolean;
    doctors: User[];
    closeSetDoctorModal: () => void;
    handleSetDoctor: (doctorId: BigInt) => void;
}

const SetDoctorModal: React.FC<SetDoctorModalProps> = ({
    isOpen,
    doctors,
    closeSetDoctorModal,
    handleSetDoctor,
}) => {
    const [selectedDoctorId, setSelectedDoctorId] = React.useState<BigInt | null>(null);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (selectedDoctorId) {
            handleSetDoctor(selectedDoctorId);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Set Doctor</h2>
                <div className="mb-4">
                    <label className="block text-sm">Select Doctor</label>
                    <select
                        value={selectedDoctorId ? selectedDoctorId.toString() : ""}
                        onChange={(e) => setSelectedDoctorId(BigInt(e.target.value))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id.toString()} value={doctor.id.toString()}>
                                {doctor.username} - {doctor.specialization}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeSetDoctorModal}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Set Doctor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetDoctorModal;