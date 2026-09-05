import EventDetails from "@/app/components/eventDetails";
import { Suspense } from "react";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = params.then((p) => p.slug);
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails params={params} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;
