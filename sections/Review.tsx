import React from "react";
import { REVIEWS } from "@/constants";
import Tag from "@/components/Tag";
import ReviewCard from "@/components/reviewcard";

const Review = () => {
    return (
        <section className="py-24">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Review</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6">
                    What users say about our{" "}
                    <span className="text-lime-400">Services</span>
                </h2>
                <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {REVIEWS.map((review) => (
                        <ReviewCard
                            key={review.name}
                            name={review.name}
                            role={review.role}
                            image={review.image}
                            review={review.review}
                            className="col-span-1 col-start-auto"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Review;