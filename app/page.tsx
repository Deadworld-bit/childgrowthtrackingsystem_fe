import HeroSlider from "@/components/HeroSlider";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import CallToAction from "@/partials/CallToAction";
import { getCollectionProducts, getCollections } from "@/lib/childcare";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";

const { collections } = config.childcare;

const ShowHeroSlider = async () => {
  const sliderImages = await getCollectionProducts({
    collection: collections.hero_slider,
  });
  const { products } = sliderImages;
  return <HeroSlider products={products} />;
};

const Home = () => {
  // const callToAction = getListPage("sections/call-to-action.md");

  // return (
  //   <>
  //     <SeoMeta />
  //     <section>
  //       <div className="container">
  //         <div className="bg-gradient py-10 rounded-md">
  //           <Suspense>
  //             <ShowHeroSlider />
  //           </Suspense>
  //         </div>
  //       </div>
  //     </section>

  //     <CallToAction data={callToAction} />
  //   </>
  // );
};

export default Home;