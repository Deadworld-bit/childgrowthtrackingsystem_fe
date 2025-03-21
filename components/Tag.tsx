import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Tag(props: HTMLAttributes<HTMLDivElement>) {
    const { className, children, ...otherProps } = props;
    return (
        <div
            className={twMerge(
                "inline-flex border border-lime-400 gap-2 text-lime-400 px-3 py-1 rounded-full uppercase items-center transition-colors duration-300 hover:bg-lime-400 hover:text-gray-900",
                className
            )}
            {...otherProps}
        >
            <span></span>
            <span className="text-sm">{children}</span>
        </div>
    );
}