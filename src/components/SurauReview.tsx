/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StarIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NotFound404 from "../pages/404";
import { api } from "../utils/api";
import ReviewSurauForm from "./ReviewSurauForm";
import SurauOverview from "./SurauOverview";
import Header from "./shared/Header";
import Modal from "./shared/Modal";
import SignIn from "./shared/SignIn";
import SkeletonLoader from "./shared/SkeletonLoader";
import SkeletonRectangle from "./shared/SkeletonRectangle";
import Badge from "./shared/Badge";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const imagePaths = [
  "/assets/background/carisurau.jpeg",
  "/assets/background/carisurau1.jpeg",
  "/assets/background/carisurau2.jpeg",
];

const SurauReview = () => {
  const [open, setOpen] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const randomImagePath =
      imagePaths[Math.floor(Math.random() * imagePaths.length)];
    setImagePath(randomImagePath as string);
  }, []);

  const router = useRouter();
  const uniqueName = router.query["id"];

  const surau = api.surau.getSurau.useQuery({
    unique_name: uniqueName ? (uniqueName as string) : "",
  });

  const rating = api.rate.getRating.useQuery({
    surau_id: surau.isFetched ? (surau.data?.id as string) : "",
  });

  const refetchRating = () => {
    void rating.refetch();
  };

  const handleWriteReview = () => {
    if (!session) {
      setOpenSignInModal(true);
      return;
    }
    setOpen(true);
  };

  if (!rating?.data) {
    // if is still fetching rating, show the skeleton, otherwise show 404 page
    if (!rating.isFetched) {
      return (
        <section className="bg-white">
          <div className="relative bg-gray-900">
            <Header />
          </div>
          <div className="py-18 mx-auto max-w-2xl px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8">
            <SkeletonLoader className="gap-2 overflow-hidden lg:col-span-4">
              <SkeletonRectangle height={24} />
              <SkeletonRectangle height={32} marginTop={4} marginBottom={8} />
              <SkeletonRectangle height={288} marginBottom={8} />
              <SkeletonRectangle
                flexDirection="row"
                lines={1}
                width="w-[144px]"
                height={96}
                gap={8}
              />
              <SkeletonRectangle height={28} marginTop={32} />
              <SkeletonRectangle height={40} marginTop={4} />
              <SkeletonRectangle height={28} marginTop={16} />
              <SkeletonRectangle height={40} marginTop={4} />
              <SkeletonRectangle height={28} marginTop={24} />
              <SkeletonRectangle height={32} marginTop={16} />
              <SkeletonRectangle height={20} marginTop={12} marginBottom={24} />
              <SkeletonRectangle height={20} lines={5} gap={12} />
            </SkeletonLoader>
          </div>
        </section>
      );
    } else {
      return <NotFound404 />;
    }
    // return <div>Loading...</div>; // or handle the case in a different way
  }

  return (
    <>
      <Head>
        {/* Google meta tags */}
        {surau.data ? (
          <>
            <meta
              name="description"
              content={`Carisurau | ${surau.data.name}`}
            />
            <meta
              name="keywords"
              content="carisurau, surau finder, next.js, prayer times, mosque finder, surau locator, Islamic prayer app"
            />
            <meta name="author" content="farhanhelmy" />
            {/* Twitter meta tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@farhanhelmycode" />
            <meta
              name="twitter:title"
              content={`Carisurau | ${surau.data.name}`}
            />
            <meta
              name="twitter:description"
              content={`Carisurau | ${surau.data.name}`}
            />
            <meta
              name="twitter:image"
              content={surau.data?.images[0]?.file_path as string}
            ></meta>
            {/* Facebook meta tags */}
            <meta property="og:url" content="https://carisurau.com" />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={`Carisurau | ${surau.data.name}`}
            />
            <meta property="og:description" content={surau.data.name} />
            <meta property="fb:app_id" content="571114311611632" />
            <meta
              property="og:image"
              content={surau.data?.images[0]?.file_path as string}
            />
            <meta property="og:image:alt" content="Carisurau Logo" />
            <meta property="og:site_name" content="Carisurau"></meta>
            <title>Carisurau | {surau.data?.name}</title>
          </>
        ) : null}
      </Head>

      <Modal open={open} setOpen={setOpen}>
        <ReviewSurauForm
          setOpen={setOpen}
          surauName={surau.data?.name as string}
          surauId={surau.data?.id as string}
          refetch={refetchRating}
        />
      </Modal>
      <SignIn
        openSignInModal={openSignInModal}
        setOpenSignInModal={setOpenSignInModal}
        message="Please sign in to review"
        callbackUrl={`/surau/${surau.data?.unique_name as string}`}
      />
      <section className="bg-background">
        {/* Hero section */}
        <div className="relative bg-gray-900">
          {/* Decorative image and overlay */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            {imagePath !== "" ? (
              <Image
                src={imagePath}
                alt="random background image"
                className="h-full w-full object-cover object-center"
                width={1920}
                height={1080}
                priority
              />
            ) : null}
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gray-900 opacity-50"
          />

          {/* Navigation */}
          <Header />
        </div>

        <div className="py-18 mx-auto max-w-2xl px-4 pt-10 sm:px-6 sm:pb-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8">
          <div className="lg:col-span-4">
            {surau.data ? (
              <SurauOverview surau={surau.data} />
            ) : (
              <div>Loading...</div>
            )}

            <div className="mt-2 flex flex-row space-x-2">
              {surau.data?.is_solat_jumaat ? (
                <Badge color="green" text="Solat Jumaat" />
              ) : null}
              {surau.data?.is_qiblat_certified ? (
                <Badge color="purple" text="Qiblat Certified" />
              ) : null}
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-medium text-foreground">Direction</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {surau.data?.brief_direction as string}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-foreground">
                Share your thoughts
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                If you’ve been / went to this surau, write a review and post
                some pictures.
              </p>
              <button
                onClick={() => handleWriteReview()}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-accent bg-accent py-2 px-8 text-sm font-medium text-accent-foreground hover:bg-accent/80 sm:w-auto lg:w-full"
              >
                Write a review
              </button>
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Reviews
            </h2>

            <div className="mt-3 flex items-center">
              <div>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((ratingz) => (
                    <StarIcon
                      key={ratingz}
                      className={classNames(
                        rating.data?.averageRatingRounded > ratingz
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">
                  {rating.data.averageRatingRounded} out of 5 stars
                </p>
              </div>
              <p className="ml-2 text-sm text-foreground">
                Based on {rating.data?.ratings.length} reviews
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Review data</h3>

              <dl className="space-y-3">
                {rating.data?.formattedCounts.map((count) => (
                  <div key={count.rating} className="flex items-center text-sm">
                    <dt className="flex flex-1 items-center">
                      <p className="w-3 font-medium text-foreground">
                        {count.rating}
                        <span className="sr-only"> star reviews</span>
                      </p>
                      <div
                        aria-hidden="true"
                        className="ml-1 flex flex-1 items-center"
                      >
                        <StarIcon
                          className={classNames(
                            count.count > 0
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />

                        <div className="relative ml-3 flex-1">
                          <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                          {count.count > 0 ? (
                            <div
                              className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                              style={{
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                width: `calc(${count.count} / ${rating.data.totalRating} * 100%)`,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </dt>
                    <dd className="ml-3 w-10 text-right text-sm tabular-nums text-primary-foreground">
                      {count.count > 0 ? (
                        <>
                          {Math.round(
                            (count.count / rating.data.totalFeedback) * 100
                          )}
                          %
                        </>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <h3 className="sr-only">Recent reviews</h3>

            <div className="flow-root">
              <div className="max-h-screen divide-y divide-muted overflow-auto">
                {rating.data.ratings.map((review) => (
                  <div key={review.id} className="py-8">
                    <div className="flex items-center">
                      <Image
                        src={`https://api.dicebear.com/5.x/thumbs/svg?seed=${review.user?.name
                          ?.trim()
                          .toLowerCase()}&background=%23fff&radius=50&width=50&height=50}`}
                        alt="nil"
                        className="h-12 w-12 rounded-full"
                        width={12}
                        height={12}
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-bold text-primary-foreground">
                          {review.user?.name}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="sr-only">
                          {review.rating} out of 5 stars
                        </p>
                      </div>
                    </div>

                    <div
                      className="text--600 mt-4 space-y-6 text-base italic"
                      dangerouslySetInnerHTML={{
                        __html: review.review as string,
                      }}
                    />
                    <div className="space-x-2">
                      {/* {review.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.alt}
                          className="w-32 h-32 rounded-lg object-cover ring-2 ring-white sm:w-48 sm:h-48"
                        />
                      ))} */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SurauReview;
