import Tag from "@/components/Tag";

const text = `You're racing to create exceptional child, but traditional child slow you down with unnecessary complexity and steep learning curves.`;

export default function Introduction() {
    return (
        <section className="py-28 lg:py-40">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Why we do This?</Tag>
                </div>
                <div className="text-4xl text-center font-medium mt-10">
                    <span>Your child's health deserves better. </span>
                    <span className="text-white/15">{text}</span>
                    <span className="text-lime-400 block"> That&apos;s why we made this Thing.</span>
                </div>
            </div>
        </section>
    );
}
