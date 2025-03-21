import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Avatar from "./avatar";

type ReviewCardProps = {
    name: string;
    role: string;
    image: string;
    review: string;
    className?: string;
};

export default function ReviewCard({
    name,
    role,
    image,
    review,
    className,
}: ReviewCardProps) {
    return (
        <div
            className={twMerge(
                "bg-neutral-900 border border-gray-700 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2",
                className
            )}
        >
            <div className="flex items-center gap-4">
                <Avatar className="z-40">
                    <Image
                        src={image}
                        alt={name}
                        width={100}
                        height={100}
                        className="rounded-full border-2 border-lime-400"
                    />
                </Avatar>
                <div>
                    <h3 className="text-xl font-bold">{name}</h3>
                    <p className="text-sm text-gray-400">{role}</p>
                </div>
            </div>
            <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                “{review}”
            </p>
        </div>
    );
}