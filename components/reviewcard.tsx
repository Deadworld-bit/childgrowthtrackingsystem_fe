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
                "bg-neutral-900 border-white/10 p-6 rounded-3xl",
                className
            )}
        >
            <div className="aspect-video flex items-center justify-center gap-4">
                <Avatar className="z-40 ">
                    <Image
                        src={image}
                        alt={name}
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </Avatar>
                <div>
                    <h3 className="text-3xl font-medium mt-6-">{name}</h3>
                    <p className="text-sm text-[#B0BEC5]">{role}</p>
                </div>
            </div>
            <p className="text-white/50 mt-2">“{review}”</p>
        </div>
    );
}
