import { FaCrown, FaUserShield, FaCalendarAlt } from "react-icons/fa";

interface Membership {
    planname: string;
    maxChildren: number;
    duration: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
}

const MembershipDetails = ({ membership }: { membership: Membership }) => {
    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Membership Details
                </h3>
                <ul className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: <FaCrown className="text-yellow-400" />,
                                text: membership.planname,
                            },
                            {
                                icon: (
                                    <FaUserShield className="text-blue-400" />
                                ),
                                text: `Max Children: ${membership.maxChildren}`,
                            },
                            {
                                icon: (
                                    <FaCalendarAlt className="text-green-400" />
                                ),
                                text: `Duration: ${membership.duration} days`,
                            },
                            {
                                icon: (
                                    <FaCalendarAlt className="text-pink-400" />
                                ),
                                text: `Start: ${new Date(
                                    membership.startDate
                                ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}`,
                            },
                            {
                                icon: (
                                    <FaCalendarAlt className="text-red-400" />
                                ),
                                text: `End: ${new Date(
                                    membership.endDate
                                ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}`,
                            },
                        ].map(({ icon, text }, idx) => (
                            <li
                                key={idx}
                                className="flex items-center gap-3 bg-gray-700 bg-opacity-30 p-4 rounded-xl"
                            >
                                {icon}
                                <span className="text-gray-200">{text}</span>
                            </li>
                        ))}
                        <li className="flex justify-center">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    membership.status
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                }`}
                            >
                                {membership.status ? "Active" : "Inactive"}
                            </span>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default MembershipDetails;
