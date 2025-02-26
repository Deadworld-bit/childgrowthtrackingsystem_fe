import Tag from "@/components/Tag";
import FeatureCard from "@/components/featurecard";
import avatar1 from "@/assets/images/avatar-ashwin-santiago.jpg";
import avatar2 from "@/assets/images/avatar-florence-shaw.jpg";
import avatar3 from "@/assets/images/avatar-lula-meyers.jpg";
import avatar4 from "@/assets/images/avatar-owen-garcia.jpg";
import Image from "next/image";
import Avatar from "@/components/avatar";
import Key from "@/components/key";

const features = [
    "Early Learning Hub",
    "Parenting Insights",
    "Growth Tracker",
    "Caregiver Connect",
    "Daily Routine Planner",
    "Quick Tips",
    "Smart Guides",
];

export default function Features() {
    return (
        <section className="py-24">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Features</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6">
                    Helping Hands for{" "}
                    <span className="text-lime-400">Happy Children</span>
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Real-time Chat"
                        description="Connect instantly with caregivers, teachers, or family members to ensure your child’s well-being and happiness."
                        className="col-span-2 lg:col-span-1 group"
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <Avatar className="z-40 ">
                                <Image
                                    src={avatar1}
                                    alt="Avatar 1"
                                    className="rounded-full"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-indigo-500 z-30">
                                <Image
                                    src={avatar2}
                                    alt="Avatar 1"
                                    className="rounded-full"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-amber-500  z-20">
                                <Image
                                    src={avatar3}
                                    alt="Avatar 1"
                                    className="rounded-full"
                                />
                            </Avatar>
                            <Avatar className="-ml-6 border-transparent group-hover:border-green-500 transition">
                                <div className="size-full bg-neutral-700 rounded-full inline-flex items-center justify-center gap-1 relative">
                                    <Image
                                        src={avatar4}
                                        alt="Avatar 4"
                                        className="absolute size-full rounded-full opacity-0 group-hover:opacity-100 transition"
                                    />
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <span
                                            className="size-1.5 rounded-full bg-white inline-flex"
                                            key={i}
                                        ></span>
                                    ))}
                                </div>
                            </Avatar>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        title="Interactive Growth Tracker"
                        description="Monitor your child's development with insightful graphs and expert-backed milestones to keep them on the right path."
                        className="col-span-2 lg:col-span-1 group"
                    >
                        <div className="aspect-video flex items-center justify-center">
                            <p className="text-4xl font-extrabold text-white/20 group-hover:text-white/10 transition duration-500 text-center">
                                We've archived{" "}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative">
                                    {" "}
                                    incredible
                                    <video
                                        src={"/gif-incredible.mp4"}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
                                    />
                                </span>{" "}
                                growth this year
                            </p>
                        </div>
                    </FeatureCard>
                    <FeatureCard
                        title="Quick Response"
                        description="Get instant alerts and updates on your child’s activities, needs, and safety to stay informed at all times."
                        className="col-span-2 lg:col-span-1 col-start-2 lg:col-start-auto"
                    >
                        <div className="aspect-video flex items-center justify-center gap-3">
                            <Key className="w-28 outline-2 outline-offset-4 group-hover:outline-lime-500 transition translate-y-1">
                                shift
                            </Key>
                            <Key className="outline-2 outline-offset-4 group-hover:outline-lime-500 transition  translate-y-1">
                                alt
                            </Key>
                            <Key className="outline-2 outline-offset-4 group-hover:outline-lime-500 transition  translate-y-1">
                                c
                            </Key>
                        </div>
                    </FeatureCard>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="bg-neutral-900 border border-white/10 inline-flex px-3 md:px-5 py-1.5 md:py-2 rounded-2xl gap-2 items-center hover:scale-105 transition duration-500 group"
                        >
                            <span className="bg-lime-400 text-neutral-950 size-5 rounded-full inline-flex items-center justify-center text-xl group-hover: rotate-45 transition duration-500">
                                &#10038;
                            </span>
                            <span className="font-medium md:text-lg">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
