import React from 'react';
import Image from 'next/image';
import { REVIEWS } from '@/constants';

const Review = () => {
  return (
    <section className="flex flex-col items-center bg-neutral-950 py-24 text-white">
      <h2 className="bold-40 lg:bold-64 text-center">What Our Users Say</h2>
      <p className="text-white text-center mt-4 max-w-2xl">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review) => (
          <ReviewItem 
            key={review.name}
            name={review.name}
            role={review.role}
            image={review.image}
            review={review.review}
          />
        ))}
      </div>
    </section>
  );
};

type ReviewItemProps = {
  name: string;
  role: string;
  image: string;
  review: string;
};

const ReviewItem = ({ name, role, image, review }: ReviewItemProps) => {
  return (
    <div className="flex flex-col items-center bg-[#343435] p-6 rounded-2xl shadow-lg max-w-md">
      <div className="flex items-center gap-4">
        <Image src={image} alt={name} width={50} height={50} className="rounded-full" />
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-[#B0BEC5]">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-center text-white">“{review}”</p>
    </div>
  );
};

export default Review;