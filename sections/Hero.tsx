import Button from "@/components/button";

export default function Hero() {
    return (
        <section className="py-24">
            <div className="container">
                <div className="flex justify-center">
                    <div className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full text-neutral-950 font-semibold">
                        1.2M child have been taken cared
                    </div>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6">Impactful actions, child will not die somehow</h1>
                <p className="text-center text-xl text-white/50 mt-8 max-w-2xl mx-auto">
                    Something Something Something&apos; Something Something
                    Something SomethingSomething SomethingSomething SomethingSomething 
                </p>
                <form className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto">
                    <input type="email" placeholder="Enter your email" className="bg-transparent px-4 md:flex-1 w-full"/>
                    <Button type="submit" variant="primary" className="whitespace-nowrap" size="sm">Sign up</Button>
                </form>
            </div>
        </section>
    );
}
