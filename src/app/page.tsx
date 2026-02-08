

import { getPageData } from "@/lib/api";
import PageBuilder from "@/components/PageBuilder";

// export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const homeData = await getPageData("home");
  // const servicesData = await getPageData("services");

  return (
    <div>
      {homeData ? <PageBuilder sections={homeData.sections} /> : null}

    </div>
  );
}
